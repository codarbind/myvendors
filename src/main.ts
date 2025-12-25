import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Create app with enhanced logging
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Get configuration service
  const configService = app.get(ConfigService);
  const appConfig = configService.get('app');

  // Global Prefix
  app.setGlobalPrefix(appConfig.apiPrefix);

  // Security Middleware
  if (appConfig.helmetEnabled) {
    app.use(helmet());
    logger.log('Helmet security middleware enabled');
  }

  // Compression
  app.use(compression());

  // CORS
  app.enableCors({
    origin: appConfig.corsOrigin,
    credentials: true,
  });

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('MyVendors API')
    .setDescription('MyVendors Backend API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Start server
  const port = appConfig.port;
  await app.listen(port);
  
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/docs`);
  logger.log(`Environment: ${appConfig.nodeEnv}`);
  
  // Log configuration summary
  logger.log('Configuration Summary:');
  logger.log(`- Database: ${configService.get('mongo').uri}`);
  logger.log(`- JWT Expiry: ${configService.get('jwt').expiresIn}`);
  logger.log(`- OTP Provider: ${configService.get('otp').provider}`);
  logger.log(`- Session Expiry: ${appConfig.sessionExpiryDays} days`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to bootstrap application:', error);
  process.exit(1);
});