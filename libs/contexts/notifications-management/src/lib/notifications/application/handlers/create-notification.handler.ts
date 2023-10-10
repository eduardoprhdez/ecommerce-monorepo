import {
  BaseError,
  TransactionManager,
  UnexpectedError,
} from '@ecommerce-monorepo/shared';
import {
  NotificationRepository,
  NotificationAggregate,
  NotificationEventRepository,
  NotificationCreatedEvent,
} from '../../domain';
import { CreateNotificationCommand } from '../commands/create-notification.command';

export class CreateNotificationCommandHandler {
  constructor(
    private notificationRepository: NotificationRepository,
    private notificationEventRepository: NotificationEventRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(
    createNotificationCommand: CreateNotificationCommand,
  ): Promise<void> {
    try {
      const notification = NotificationAggregate.fromPrimitives(
        createNotificationCommand,
      );

      const notificationCreatedEvent = new NotificationCreatedEvent(
        notification.id.value,
        notification.toPrimitives(),
      );

      const transaction = this.transactionManager.createTransaction();
      await transaction.start();

      try {
        await this.notificationRepository.saveNotification(
          notification.toPrimitives(),
        );
        await this.notificationEventRepository.saveNotificationEvent(
          notificationCreatedEvent,
        );
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
      } finally {
        await transaction.finish();
      }
    } catch (err) {
      if (err instanceof BaseError) throw err;
      throw new UnexpectedError(
        this.constructor.name,
        'execute',
        JSON.stringify(createNotificationCommand),
      );
    }
  }
}
