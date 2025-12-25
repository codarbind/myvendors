import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpService } from './otp/otp.service';
import { UsersModule } from '../users/users.module';
import { Session, SessionSchema } from './schemas/session.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { MockProvider } from './otp/providers/mock.provider';
import { WhatsappCloudProvider } from './otp/providers/whatsapp-cloud.provider';
import { BaileysProvider } from './otp/providers/baileys.provider';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    OtpService,
    {
      provide: 'OTP_PROVIDER',
      useFactory: (configService: ConfigService) => {
        const provider = configService.get<string>('OTP_PROVIDER', 'mock');
        switch (provider) {
          case 'whatsapp_cloud':
            return new WhatsappCloudProvider(configService);
          case 'baileys':
            return new BaileysProvider(configService);
          default:
            return new MockProvider();
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}