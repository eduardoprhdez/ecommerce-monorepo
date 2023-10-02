import { BaseError, HttpStatusCode } from './base.error';

export class DatabaseRecordNotFoundError extends BaseError {
  constructor(className: string, recordId: string) {
    super(
      HttpStatusCode.NOT_FOUND,
      `<${className}> was unable to find the record with id <${recordId}>`,
    );
  }
}
