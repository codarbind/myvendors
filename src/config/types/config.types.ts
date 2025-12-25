export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface MongoConfig {
  uri: string;
  dbName: string;
}

export interface RateLimitConfig {
  ttl: number;
  limit: number;
}

export interface OtpConfig {
  provider: 'mock' | 'whatsapp_cloud' | 'baileys';
  expirationMinutes: number;
  whatsappCloud: {
    token?: string;
    phoneNumberId?: string;
    apiVersion: string;
  };
  baileys: {
    sessionPath: string;
  };
}

export interface AppConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  apiPrefix: string;
  corsOrigin: string;
  helmetEnabled: boolean;
  rateLimitEnabled: boolean;
  sessionExpiryDays: number;
  reinviteCooldownDays: number;
  nameEditCooldownMonths: number;
}

export interface Config {
  app: AppConfig;
  jwt: JwtConfig;
  mongo: MongoConfig;
  rateLimit: RateLimitConfig;
  otp: OtpConfig;
}