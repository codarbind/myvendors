import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OtpService } from './otp/otp.service';
import { UsersService } from '../users/users.service';
import { Session } from './schemas/session.schema';
import { RefreshToken } from './schemas/refresh-token.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly usersService: UsersService,
  ) {}

  private otpStore = new Map<string, { otp: string; expiresAt: Date }>();

  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP for ${phone}: ${otp}`);
    // Store OTP with 10-minute expiration
    this.otpStore.set(phone, {
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send OTP via selected provider
    await this.otpService.sendOtp(phone, otp);

    return {
      success: true,
      message: 'OTP sent successfully',
    };
  }

  async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; user: any; token: string }> {

    const stored = this.otpStore.get(phone);
   
    if (!stored || stored.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (stored.expiresAt < new Date()) {
      this.otpStore.delete(phone);
      throw new UnauthorizedException('OTP expired');
    }

    // Clear OTP after successful verification
    this.otpStore.delete(phone);

    // Find or create user
    let user = await this.usersService.findByPhone(phone);

    if (!user) {
      user = await this.usersService.create({ phone });
    }

    // Generate JWT token
    const payload = { 
      sub: user._id, 
      phone: user.phone,
      role: 'user' 
    };
    const token = this.jwtService.sign(payload);

    // Create session
    await this.sessionModel.create({
      userId: user._id.toString(),
      token,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    });

    return {
      success: true,
      user: this.usersService.sanitizeUser(user),
      token,
    };
  }

  async validateUser(payload: any) {
    return this.usersService.findById(payload.sub);
  }
}