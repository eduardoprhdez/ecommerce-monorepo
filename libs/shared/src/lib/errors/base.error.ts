export enum HttpStatusCode {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class BaseError extends Error {
  public override readonly name: string;
  public readonly httpCode: HttpStatusCode;

  constructor(httpCode: HttpStatusCode, description?: string) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.httpCode = httpCode;

    Error.captureStackTrace(this);
  }
}
