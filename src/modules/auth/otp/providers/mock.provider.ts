import { Injectable } from '@nestjs/common';
import { OtpProvider } from '../otp.provider';

@Injectable()
export class MockProvider implements OtpProvider {
  async sendOtp(phone: string, otp: string): Promise<void> {
    console.log(`[MOCK OTP] Sending OTP ${otp} to ${phone}`);
    // In development, just log the OTP
    console.log(`Your OTP is: ${otp}`);
  }
}