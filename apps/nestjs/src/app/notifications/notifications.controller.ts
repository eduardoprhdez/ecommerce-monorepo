import {
  Controller,
  Post,
  Inject,
  Body,
  Param,
  Get,
  UseFilters,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  CreateNotificationCommandHandler,
  CreateNotificationCommand,
  GetNotificationQueryHandler,
  NotificationPrimitive,
  GetManyNotificationsQueryHandler,
  NotificationCreatedEvent,
} from '@ecommerce-monorepo/notifications-management';
import {
  OrderApprovedEvent,
  OrderCancelledEvent,
  OrderPlacedEvent,
  OrderPrimitive,
  OrderStatePrimitive,
} from '@ecommerce-monorepo/orders-management';
import { pubSub } from './notifications.resolver';
import { HttpExceptionFilter } from '../errors/http-exception-filter';

@Controller('notifications')
@UseFilters(new HttpExceptionFilter())
export class NotificationController {
  constructor(
    @Inject(CreateNotificationCommandHandler)
    private readonly createNotificationCommandHandler: CreateNotificationCommandHandler,
    @Inject(GetNotificationQueryHandler)
    private readonly getNotificationQueryHandler: GetNotificationQueryHandler,
    @Inject(GetManyNotificationsQueryHandler)
    private readonly getManyNotificationsQueryHandler: GetManyNotificationsQueryHandler,
  ) {}

  @Post()
  createNotification(
    @Body() createNotificationRequest: CreateNotificationCommand,
  ): Promise<void> {
    return this.createNotificationCommandHandler.execute(
      createNotificationRequest,
    );
  }

  @Get(':id')
  getNotification(
    @Param('id') notificationId: string,
  ): Promise<NotificationPrimitive> {
    return this.getNotificationQueryHandler.execute({
      id: notificationId,
    });
  }

  @Get()
  getNotifications(): Promise<NotificationPrimitive[]> {
    return this.getManyNotificationsQueryHandler.execute();
  }

  @EventPattern('OrderPlaced')
  async listenOrderplaced(@Payload('data') data: OrderPlacedEvent) {
    await this.buildNotification(JSON.parse(data.eventData));
  }

  @EventPattern('OrderApproved')
  async listenOrderApproved(@Payload('data') data: OrderApprovedEvent) {
    await this.buildNotification(JSON.parse(data.eventData));
  }

  @EventPattern('OrderCancelled')
  async listenOrderCancelled(@Payload('data') data: OrderCancelledEvent) {
    await this.buildNotification(JSON.parse(data.eventData));
  }

  async buildNotification(data: OrderPrimitive) {
    let typeString: string;

    switch (data.state) {
      case OrderStatePrimitive.PENDING:
        typeString = 'placed';
        break;
      case OrderStatePrimitive.APPROVED:
        typeString = 'approved';
        break;
      case OrderStatePrimitive.CANCELLED:
        typeString = 'cancelled';
        break;
      default:
        return;
    }

    let message = `An order with id ${data.id} has been ${typeString}`;

    if (data.rejectionReason)
      message = message + ` because of the reason "${data.rejectionReason}"`;

    this.createNotification({ message });
  }

  @EventPattern('NotificationCreated')
  async listenNotifications(@Payload('data') data: NotificationCreatedEvent) {
    pubSub.publish('notificationAdded', JSON.parse(data.eventData));
  }
}
