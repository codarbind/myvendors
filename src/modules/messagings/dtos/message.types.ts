// src/message/types/message.types.ts
export interface MessagePayload {
  text?: string;
  phoneNumber: string;
  media?: Express.Multer.File;
}

export interface ThirdPartyResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp?: Date;
}

export interface SendMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: Date;
  thirdPartyResponse?: ThirdPartyResponse;
}