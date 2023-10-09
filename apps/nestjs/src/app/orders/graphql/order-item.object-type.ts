import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { OrderItemPrimitive } from '@ecommerce-monorepo/orders-management';

@ObjectType()
export class OrderItemObjectType implements OrderItemPrimitive {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  quantity: number;
}
