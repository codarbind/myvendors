// src/message/services/third-party.service.ts
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';
import { MessageConfig } from './configs/message.config';
import { MessagePayload, ThirdPartyResponse } from './dtos/message.types';


@Injectable()
export class ThirdPartyService {
  private readonly logger = new Logger(ThirdPartyService.name);
  private readonly config: MessageConfig;
  private readonly client: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.config = {
      thirdPartyBaseUrl: this.configService.get<string>('THIRD_PARTY_BASE_URL', 'http://localhost:4040'),
      thirdPartyEndpoint: this.configService.get<string>('THIRD_PARTY_ENDPOINT', '/intserv/message'),
      timeout: this.configService.get<number>('THIRD_PARTY_TIMEOUT', 30000),
      maxRetries: this.configService.get<number>('THIRD_PARTY_MAX_RETRIES', 3),
      apiKey: this.configService.get<string>('THIRD_PARTY_API_KEY'),
    };

    this.client = axios.create({
      baseURL: this.config.thirdPartyBaseUrl,
      timeout: this.config.timeout,
      headers: {
        'User-Agent': 'NestJS-Message-Service/1.0',
      },
    });

    // Add request interceptor for auth if needed
    if (this.config.apiKey) {
      this.client.interceptors.request.use((config) => {
        config.headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        return config;
      });
    }
  }

  /**
   * Send message to third party service
   */
  async sendMessage(payload: MessagePayload): Promise<ThirdPartyResponse> {
    const { text, phoneNumber, media } = payload;
    
    try {
      // Create FormData
      const formData = new FormData();
      
      // Add text if provided
      if (text && text.trim()) {
        formData.append('text', text.trim());
      }
      
      // Add phone number
      formData.append('phoneNumber', phoneNumber);
      
      // Add media file if provided
      if (media) {
        formData.append('media', media.buffer, {
          filename: media.originalname,
          contentType: media.mimetype,
        });
      }
      
      // Prepare request config
      const requestConfig: AxiosRequestConfig = {
        headers: {
          ...formData.getHeaders(),
        },
      };
      
      this.logger.log(`Sending message to third party: ${phoneNumber}`);
      
      // Send with retry logic
      const response = await this.sendWithRetry(
        `${this.config.thirdPartyBaseUrl}/intserv/message`,
        formData,
        requestConfig,
      );
      
      return this.handleResponse(response);
      
    } catch (error) {
      this.logger.error(`Failed to send message to third party: ${error.message}`, error.stack);
      throw new HttpException(
        `Third party service error: ${error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Send request with retry logic
   */
  private async sendWithRetry(
    endpoint: string,
    formData: FormData,
    config: AxiosRequestConfig,
    retryCount = 0,
  ): Promise<any> {
    try {
        console.log({endpoint,config})
      const response = await this.client.post(endpoint, formData, config);
      console.log({rsdfd: response})
      return response;
    } catch (error) {
      if (retryCount < this.config.maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        this.logger.warn(`Retry ${retryCount + 1}/${this.config.maxRetries} after ${delay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.sendWithRetry(endpoint, formData, config, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Handle third party response
   */
  private handleResponse(response: any): ThirdPartyResponse {
    const { status, data } = response;
    
    if (status >= 200 && status < 300) {
      // Success response
      return {
        success: true,
        messageId: data.messageId || `msg_${Date.now()}`,
        timestamp: new Date(),
        ...data,
      };
    } else {
      // Error response
      return {
        success: false,
        error: data.error || `Third party returned status ${status}`,
        timestamp: new Date(),
        ...data,
      };
    }
  }

  /**
   * Get service health status
   */
  async checkHealth(): Promise<boolean> {
    try {
      await this.client.get('/health', { timeout: 5000 });
      return true;
    } catch (error) {
      this.logger.warn(`Third party health check failed: ${error.message}`);
      return false;
    }
  }
}