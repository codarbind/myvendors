// src/message/config/message.config.ts
export interface MessageConfig {
  thirdPartyBaseUrl: string;
  thirdPartyEndpoint: string;
  timeout: number;
  maxRetries: number;
  apiKey?: string;
}

export const defaultMessageConfig: MessageConfig = {
  thirdPartyBaseUrl: process.env.THIRD_PARTY_BASE_URL || 'http://thirdparty-api.com',
  thirdPartyEndpoint: process.env.THIRD_PARTY_ENDPOINT || '/api/messages',
  timeout: parseInt(process.env.THIRD_PARTY_TIMEOUT || '30000', 10),
  maxRetries: parseInt(process.env.THIRD_PARTY_MAX_RETRIES || '3', 10),
  apiKey: process.env.THIRD_PARTY_API_KEY,
};