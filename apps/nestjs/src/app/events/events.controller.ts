import { Controller, Inject, Get, UseFilters } from '@nestjs/common';
import { OrderEventRepository } from '@ecommerce-monorepo/orders-management';
import { ORDER_EVENT_REPOSITORY } from '../orders/constants/contants';
import { HttpExceptionFilter } from '../errors/http-exception-filter';
import { NOTIFICATION_EVENT_REPOSITORY } from '../notifications/constants/notifications.constants';
import { NotificationEventRepository } from '@ecommerce-monorepo/notifications-management';
import { DomainEvent } from '@ecommerce-monorepo/shared-kernel';

@UseFilters(new HttpExceptionFilter())
@Controller('events')
export class EventsController {
  constructor(
    @Inject(ORDER_EVENT_REPOSITORY)
    private readonly orderEventRepository: OrderEventRepository,
    @Inject(NOTIFICATION_EVENT_REPOSITORY)
    private readonly notificationEventRepository: NotificationEventRepository,
  ) {}

  @Get('orders')
  getOrdersEvents(): Promise<DomainEvent[]> {
    return this.orderEventRepository.getOrderEvents();
  }

  @Get('notifications')
  getNotificationsEvents(): Promise<DomainEvent[]> {
    return this.notificationEventRepository.getNotificationEvents();
  }
}
