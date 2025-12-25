import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { validationSchema } from './config/validation.schema';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import mongoConfig from './config/mongo.config';
import rateLimitConfig from './config/rate-limit.config';
import otpConfig from './config/otp.config';
import { UsersModule } from './modules/users/users.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { InvitesModule } from './modules/invites/invites.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    // Configuration Module with Validation
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions: {
        abortEarly: true, // Stop validation on first error
        allowUnknown: false, // Don't allow unknown keys
      },
      load: [appConfig, jwtConfig, mongoConfig, rateLimitConfig, otpConfig],
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),
    
    // MongoDB Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoConfig = configService.get('mongo');
        if (!mongoConfig?.uri) {
          throw new Error('MONGODB_URI is not defined in configuration');
        }
        return {
          uri: mongoConfig.uri,
          dbName: mongoConfig.dbName,
        };
      },
      inject: [ConfigService],
    }),
    
    // JWT Module
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtConfig = configService.get('jwt');
        if (!jwtConfig?.secret) {
          throw new Error('JWT_SECRET is not defined in configuration');
        }
        return {
          secret: jwtConfig.secret,
          signOptions: { expiresIn: jwtConfig.expiresIn },
        };
      },
      inject: [ConfigService],
    }),
    
    // Rate Limiting Module (Optional)
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const rateLimitConfig = configService.get('rateLimit');
        const appConfig = configService.get('app');
        
        return appConfig?.rateLimitEnabled ? [{
          ttl: rateLimitConfig?.ttl || 60,
          limit: rateLimitConfig?.limit || 100,
        }] : [];
      },
      inject: [ConfigService],
    }),
    
    // Feature Modules
    UsersModule,
    VendorsModule,
    InvitesModule,
    AuthModule,
    AdminModule,
    NotificationsModule,
  ],
})
export class AppModule {}