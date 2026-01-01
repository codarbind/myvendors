import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default(''), //version api prefix
  CORS_ORIGIN: Joi.string().default('*'),
  
  // MongoDB
  MONGODB_URI: Joi.string().required(),
  MONGODB_DB_NAME: Joi.string().default('myvendors'),
  
  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  JWT_REFRESH_SECRET: Joi.string(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  
  // OTP
  OTP_PROVIDER: Joi.string()
    .valid('mock', 'whatsapp_cloud', 'baileys')
    .default('mock'),
  OTP_EXPIRATION_MINUTES: Joi.number().default(10),
  
  // WhatsApp Cloud
  WHATSAPP_CLOUD_TOKEN: Joi.string().when('OTP_PROVIDER', {
    is: 'whatsapp_cloud',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  WHATSAPP_PHONE_NUMBER_ID: Joi.string().when('OTP_PROVIDER', {
    is: 'whatsapp_cloud',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  WHATSAPP_API_VERSION: Joi.string().default('v18.0'),
  
  // Baileys
  BAILEYS_SESSION_PATH: Joi.string().default('./sessions'),
  
  // Security
  HELMET_ENABLED: Joi.boolean().default(true),
  RATE_LIMIT_ENABLED: Joi.boolean().default(true),
  RATE_LIMIT_TTL: Joi.number().default(60),
  RATE_LIMIT_MAX: Joi.number().default(100),
  
  // Session & Cooldowns
  SESSION_EXPIRY_DAYS: Joi.number().default(14),
  REINVITE_COOLDOWN_DAYS: Joi.number().default(10),
  NAME_EDIT_COOLDOWN_MONTHS: Joi.number().default(3),

  //admin
  ADMIN_LIST: Joi.string(),
})
// Allow unknown environment variables (system variables, etc.)
.unknown(true);