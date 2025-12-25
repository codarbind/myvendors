import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { 
  AppConfig, 
  JwtConfig, 
  MongoConfig, 
  RateLimitConfig, 
  OtpConfig,
  Config 
} from './types/config.types';

@Injectable()
export class ConfigService {
  constructor(private nestConfigService: NestConfigService) {}

  get app(): AppConfig {
    return this.nestConfigService.get<AppConfig>('app')!;
  }

  get jwt(): JwtConfig {
    return this.nestConfigService.get<JwtConfig>('jwt')!;
  }

  get mongo(): MongoConfig {
    return this.nestConfigService.get<MongoConfig>('mongo')!;
  }

  get rateLimit(): RateLimitConfig {
    return this.nestConfigService.get<RateLimitConfig>('rateLimit')!;
  }

  get otp(): OtpConfig {
    return this.nestConfigService.get<OtpConfig>('otp')!;
  }

  get<T = any>(propertyPath: string): T {
    return this.nestConfigService.get<T>(propertyPath)!;
  }

  getOrThrow<T = any>(propertyPath: string): T {
    const value = this.nestConfigService.get<T>(propertyPath);
    if (value === undefined || value === null) {
      throw new Error(`Configuration property "${propertyPath}" is not defined`);
    }
    return value;
  }
}