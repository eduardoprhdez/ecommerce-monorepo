import { Repository } from 'typeorm';
import {
  NotificationRepository,
  NotificationPrimitive,
  SaveNotificationDTO,
} from '../../domain';
import { NotificationTypeormEntity } from '../entities/notification-typeorm.entity';
import { DatabaseError, TransactionTypeorm } from '@ecommerce-monorepo/shared';

export class NotificationTypeormRepository
  extends Repository<NotificationTypeormEntity>
  implements NotificationRepository
{
  async saveNotification(
    notification: SaveNotificationDTO,
    transaction: TransactionTypeorm,
  ): Promise<void> {
    try {
      transaction
        ? await transaction.queryRunner.manager.save(
            NotificationTypeormEntity,
            notification,
          )
        : await this.save(notification);
    } catch (error) {
      console.log(error);
      throw new DatabaseError(
        this.constructor.name,
        'saveNotification',
        JSON.stringify(notification),
      );
    }
  }

  async getNotification(
    notificationId: string,
  ): Promise<NotificationPrimitive | undefined> {
    try {
      const notification = await this.findOne({
        where: { id: notificationId },
      });

      return notification ?? undefined;
    } catch (error) {
      console.log(error);
      throw new DatabaseError(
        this.constructor.name,
        'getNotification',
        notificationId,
      );
    }
  }

  async getNotifications(): Promise<NotificationPrimitive[]> {
    try {
      const notifications = await this.find();

      return notifications;
    } catch (error) {
      console.log(error);
      throw new DatabaseError(this.constructor.name, 'getNotifications', '');
    }
  }
}
