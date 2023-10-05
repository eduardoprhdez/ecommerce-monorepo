import { InvalidPositiveNumberError } from '../errors/invalid-positive-number.error';
import { NumberValueObject } from './number.value-object';

export abstract class PositiveNumberValueObject extends NumberValueObject {
  constructor(value: number) {
    super(value);
    this.ensureIsPositiveNumber(value);
  }

  ensureIsPositiveNumber(value: number) {
    if (value < 0)
      throw new InvalidPositiveNumberError(this.constructor.name, value);
  }
}
