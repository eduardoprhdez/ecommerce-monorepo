import { BaseError, HttpStatusCode } from './base.error';

export class UnexpectedError extends BaseError {
  constructor(className: string, method: string, data: string) {
    super(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      `<${className}> had an unexpetected internal error when performing the <${method}> and the following data <${data}>`,
    );
  }
}
