import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        console.log('[AUDIT]', {
          user: req.user?.phone,
          path: req.originalUrl,
          method: req.method,
          time: new Date().toISOString(),
        });
      }),
    );
  }
}
