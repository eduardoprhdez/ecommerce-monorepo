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
} from '@ecommerce-monorepo/notifications-management';
import {
  OrderPrimitive,
  OrderStatePrimitive,
} from '@ecommerce-monorepo/orders-management';
import axios from 'axios';
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

  @EventPattern('OrderTypeormEntity')
  async listenOrders(@Payload('data') data: OrderPrimitive) {
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

    axios.post<unknown, unknown, CreateNotificationCommand>(
      'http://localhost:3000/api/notifications',
      { message },
    );
  }

  @EventPattern('NotificationTypeormEntity')
  async listenNotifications(@Payload('data') data: NotificationPrimitive) {
    pubSub.publish('notificationAdded', data);
  }
}
