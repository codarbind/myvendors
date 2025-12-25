import { registerAs } from '@nestjs/config';

export default registerAs('otp', () => ({
  provider: process.env.OTP_PROVIDER || 'mock',
  expirationMinutes: parseInt(process.env.OTP_EXPIRATION_MINUTES || '10', 10),
  
  // WhatsApp Cloud Config
  whatsappCloud: {
    token: process.env.WHATSAPP_CLOUD_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v18.0',
  },
  
  // Baileys Config
  baileys: {
    sessionPath: process.env.BAILEYS_SESSION_PATH || './sessions',
  },
}));