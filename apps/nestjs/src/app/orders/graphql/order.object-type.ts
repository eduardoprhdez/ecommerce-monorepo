import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OrderItemObjectType } from './order-item.object-type';
import {
  OrderItemPrimitive,
  OrderPrimitive,
  OrderStatePrimitive,
} from '@ecommerce-monorepo/orders-management';

@ObjectType()
export class OrderObjectType implements OrderPrimitive {
  @Field(() => ID)
  id: string;

  @Field(() => [OrderItemObjectType])
  items: OrderItemPrimitive[];

  @Field(() => OrderStatePrimitive)
  state: OrderStatePrimitive;
}
