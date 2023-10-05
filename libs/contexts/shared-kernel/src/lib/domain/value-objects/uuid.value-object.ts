import { validate } from 'uuid';
import { ValueObject } from './value-object';
import { InvalidArgumentError } from '../errors/invalid-argument.error';

export abstract class UuidValueObject extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureIsValidUuid(value);
  }

  private ensureIsValidUuid(id: string): void {
    if (!validate(id)) {
      throw new InvalidArgumentError(this.constructor.name, id);
    }
  }
}
