import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || '',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Security
  helmetEnabled: process.env.HELMET_ENABLED !== 'false',
  rateLimitEnabled: process.env.RATE_LIMIT_ENABLED !== 'false',
  
  // Session
  sessionExpiryDays: parseInt(process.env.SESSION_EXPIRY_DAYS || '14', 10),
  
  // Invite
  reinviteCooldownDays: parseInt(process.env.REINVITE_COOLDOWN_DAYS || '10', 10),
  nameEditCooldownMonths: parseInt(process.env.NAME_EDIT_COOLDOWN_MONTHS || '3', 10),
}));