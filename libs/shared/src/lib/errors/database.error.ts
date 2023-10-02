import { BaseError, HttpStatusCode } from './base.error';

export class DatabaseError extends BaseError {
  constructor(className: string, method: string, data: string) {
    super(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      `<${className}> had an internal error when performing the <${method}> and the following data <${data}>`,
    );
  }
}
