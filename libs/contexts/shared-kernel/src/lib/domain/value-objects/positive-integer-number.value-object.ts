import { InvalidPositiveIntegerNumberError } from '../errors/invalid-positive-integer-number.error';
import { PositiveNumberValueObject } from './positive-number.value-object';

export abstract class PositiveIntegerNumberValueObject extends PositiveNumberValueObject {
  constructor(value: number) {
    super(value);
    this.esureIsInteger(value);
  }

  esureIsInteger(value: number) {
    if (!Number.isInteger(value))
      throw new InvalidPositiveIntegerNumberError(this.constructor.name, value);
  }
}
