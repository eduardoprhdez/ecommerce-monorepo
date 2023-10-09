import { PubSub } from 'graphql-subscriptions';
import { NotificationObjectType } from './notifaction.object-type';
import { Resolver, Subscription } from '@nestjs/graphql';

export const pubSub = new PubSub();

@Resolver(() => NotificationObjectType)
export class NotificationResolver {
  @Subscription(() => NotificationObjectType, {
    resolve: (value) => value,
  })
  notificationAdded() {
    return pubSub.asyncIterator('notificationAdded');
  }
}
