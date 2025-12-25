import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    console.log(`[${new Date().toISOString()}] ${method} ${url}`);
    console.log(`Query: ${JSON.stringify(query)}`);
    console.log(`Params: ${JSON.stringify(params)}`);
    if (Object.keys(body||{}).length > 0) {
      console.log(`Body: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      tap(() => {
        console.log(`[${new Date().toISOString()}] ${method} ${url} - ${Date.now() - now}ms`);
      }),
    );
  }
}