import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtConfig } from 'src/config/types/config.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const jwtConfig = configService.get<JwtConfig>('jwt');
    
    if (!jwtConfig?.secret) {
      throw new Error(
        'JWT configuration is missing. Please check your environment variables.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
    
    this.logger.log('JWT Strategy initialized');
  }

  async validate(payload: any) {
    this.logger.debug(`Validating JWT payload for user: ${payload.sub}`);
    
    const user = await this.authService.validateUser(payload);
    if (!user) {
      this.logger.warn(`JWT validation failed for user ID: ${payload.sub}`);
      throw new UnauthorizedException('Invalid token or user not found');
    }
    
    this.logger.debug(`JWT validated successfully for user: ${user.phone}`);
    return user;
  }
}