import {
  EnumType,
  StringEnumValueObject,
} from '@ecommerce-monorepo/shared-kernel';
import { OrderStatePrimitive } from '../primitives/order-state.primitive';

export class OrderStateValueObject extends StringEnumValueObject {
  getEnum(): EnumType {
    return OrderStatePrimitive;
  }
}
