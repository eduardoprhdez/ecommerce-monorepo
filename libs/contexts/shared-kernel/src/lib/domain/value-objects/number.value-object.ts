import { InvalidNumberError } from '../errors/invalid-number.error';
import { ValueObject } from './value-object';

export abstract class NumberValueObject extends ValueObject<number> {
  constructor(value: number) {
    super(value);
    this.ensureIsNumber(value);
  }

  private ensureIsNumber(value: number) {
    if (typeof value !== 'number')
      throw new InvalidNumberError(this.constructor.name, value);
  }
}
