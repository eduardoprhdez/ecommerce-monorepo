import { InvalidStringError } from '../errors/invalid-string.error';
import { ValueObject } from './value-object';

export abstract class StringValueObject extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureIsValidString(value);
  }

  private ensureIsValidString(string: string): void {
    if (typeof string !== 'string') {
      throw new InvalidStringError(this.constructor.name, string);
    }
  }
}
