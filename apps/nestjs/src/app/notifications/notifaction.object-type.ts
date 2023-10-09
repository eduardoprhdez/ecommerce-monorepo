import { Field, ID, ObjectType } from '@nestjs/graphql';
import { NotificationPrimitive } from '@ecommerce-monorepo/notifications-management';

@ObjectType()
export class NotificationObjectType implements NotificationPrimitive {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  message: string;
}
