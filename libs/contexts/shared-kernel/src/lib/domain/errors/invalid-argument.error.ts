import { BaseError, HttpStatusCode } from '@ecommerce-monorepo/shared';

export class InvalidArgumentError extends BaseError {
  constructor(className: string, fieldValue: unknown) {
    super(
      HttpStatusCode.BAD_REQUEST,
      `<${className}> doesn't allow the the value <${fieldValue}>}`,
    );
  }
}
