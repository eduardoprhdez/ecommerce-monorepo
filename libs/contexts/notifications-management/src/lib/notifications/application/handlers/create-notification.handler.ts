import { NotificationRepository, NotificationAggregate } from '../../domain';
import { CreateNotificationCommand } from '../commands/create-notification.command';

export class CreateNotificationCommandHandler {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(
    createNotificationCommand: CreateNotificationCommand,
  ): Promise<void> {
    const notification = NotificationAggregate.fromPrimitives({
      ...createNotificationCommand,
    });

    try {
      return this.notificationRepository.saveNotification(
        notification.toPrimitives(),
      );
    } catch (err) {
      //TODO: Meaningful error
      throw new Error();
    }
  }
}
