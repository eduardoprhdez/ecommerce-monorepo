import { BaseError, HttpStatusCode } from '@ecommerce-monorepo/shared';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    if (host.getType() !== 'http') return;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof BaseError
        ? exception.httpCode
        : HttpStatusCode.INTERNAL_SERVER_ERROR;

    if (!(exception instanceof BaseError)) console.log(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception instanceof BaseError
          ? exception.message
          : 'There was an unexpected internal error',
    });
  }
}
