import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  NOTIFICATION_EVENT_REPOSITORY,
  NOTIFICATION_REPOSITORY,
} from './constants/notifications.constants';
import { EntityManager } from 'typeorm';
import { NotificationController } from './notifications.controller';
import { NotificationResolver } from './notifications.resolver';
import {
  CreateNotificationCommandHandler,
  GetManyNotificationsQueryHandler,
  GetNotificationQueryHandler,
  NotificationEventRepository,
  NotificationEventTypeormEntity,
  NotificationEventTypeormRepository,
  NotificationRepository,
  NotificationTypeormEntity,
  NotificationTypeormRepository,
} from '@ecommerce-monorepo/notifications-management';
import { TransactionManagerTypeorm } from '@ecommerce-monorepo/shared';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationTypeormEntity])],
  controllers: [NotificationController],
  providers: [
    TransactionManagerTypeorm,
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
      provide: NOTIFICATION_EVENT_REPOSITORY,
      useFactory(entityManager: EntityManager): NotificationEventRepository {
        return new NotificationEventTypeormRepository(
          NotificationEventTypeormEntity,
          entityManager,
        );
      },
      inject: [EntityManager],
    },
    {
      provide: CreateNotificationCommandHandler,
      useFactory(
        notificationRepository: NotificationRepository,
        notificationEventRepository: NotificationEventRepository,
        transaction: TransactionManagerTypeorm,
      ): CreateNotificationCommandHandler {
        return new CreateNotificationCommandHandler(
          notificationRepository,
          notificationEventRepository,
          transaction,
        );
      },
      inject: [
        NOTIFICATION_REPOSITORY,
        NOTIFICATION_EVENT_REPOSITORY,
        TransactionManagerTypeorm,
      ],
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
    {
      provide: GetManyNotificationsQueryHandler,
      useFactory(
        notificationRepository: NotificationRepository,
      ): GetManyNotificationsQueryHandler {
        return new GetManyNotificationsQueryHandler(notificationRepository);
      },
      inject: [NOTIFICATION_REPOSITORY],
    },
  ],
  exports: [NOTIFICATION_EVENT_REPOSITORY],
})
export class NotificationsModule {}
