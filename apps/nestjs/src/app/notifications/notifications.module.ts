import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NOTIFICATION_REPOSITORY } from './constants/notifications.constants';
import { EntityManager } from 'typeorm';
import { NotificationController } from './notifications.controller';
import { NotificationResolver } from './notifications.resolver';
import {
  CreateNotificationCommandHandler,
  GetNotificationQueryHandler,
  NotificationRepository,
  NotificationTypeormEntity,
  NotificationTypeormRepository,
} from '@ecommerce-monorepo/notifications-management';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationTypeormEntity])],
  controllers: [NotificationController],
  providers: [
    NotificationResolver,
    {
      provide: NOTIFICATION_REPOSITORY,
      useFactory(entityManager: EntityManager): NotificationRepository {
        return new NotificationTypeormRepository(
          NotificationTypeormEntity,
          entityManager,
        );
      },
      inject: [EntityManager],
    },
    {
      provide: CreateNotificationCommandHandler,
      useFactory(
        notificationRepository: NotificationRepository,
      ): CreateNotificationCommandHandler {
        return new CreateNotificationCommandHandler(notificationRepository);
      },
      inject: [NOTIFICATION_REPOSITORY],
    },
    {
      provide: GetNotificationQueryHandler,
      useFactory(
        notificationRepository: NotificationRepository,
      ): GetNotificationQueryHandler {
        return new GetNotificationQueryHandler(notificationRepository);
      },
      inject: [NOTIFICATION_REPOSITORY],
    },
  ],
})
export class NotificationsModule {}
