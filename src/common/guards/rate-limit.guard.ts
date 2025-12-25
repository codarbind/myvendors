import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const limiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
});

@Injectable()
export class RateLimitGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const key = req.user?.phone || req.ip;

    await limiter.consume(key);
    return true;
  }
}
