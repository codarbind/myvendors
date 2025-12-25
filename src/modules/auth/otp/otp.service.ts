import { Injectable, Inject } from '@nestjs/common';
import { OtpProvider } from './otp.provider';

@Injectable()
export class OtpService {
  constructor(
    @Inject('OTP_PROVIDER') private readonly provider: OtpProvider,
  ) {}

  async sendOtp(phone: string, otp: string): Promise<void> {
    await this.provider.sendOtp(phone, otp);
  }
}