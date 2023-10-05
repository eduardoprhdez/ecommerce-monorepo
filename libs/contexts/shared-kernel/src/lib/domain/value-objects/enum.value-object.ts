import { InvalidEnumValueError } from '../errors/invalid-enum-value.error';
import { StringValueObject } from './string.value-object';
import { EnumType } from './value-object';

export abstract class StringEnumValueObject extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsValidEnumValue(value);
  }

  private ensureIsValidEnumValue(value: string): void {
    if (!(value in this.getEnum())) {
      throw new InvalidEnumValueError(this.constructor.name, value);
    }
  }

  abstract getEnum(): EnumType;
}
