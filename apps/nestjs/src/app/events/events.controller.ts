import { Controller, Inject, Get, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderEventRepository } from '@ecommerce-monorepo/orders-management';
import { ORDER_EVENT_REPOSITORY } from '../orders/constants/contants';
import { HttpExceptionFilter } from '../errors/http-exception-filter';
import { NOTIFICATION_EVENT_REPOSITORY } from '../notifications/constants/notifications.constants';
import { NotificationEventRepository } from '@ecommerce-monorepo/notifications-management';
import { DomainEvent } from '@ecommerce-monorepo/shared-kernel';

@ApiTags('events')
@UseFilters(new HttpExceptionFilter())
@Controller({ path: 'events', version: '1' })
export class EventsController {
  constructor(
    @Inject(ORDER_EVENT_REPOSITORY)
    private readonly orderEventRepository: OrderEventRepository,
    @Inject(NOTIFICATION_EVENT_REPOSITORY)
    private readonly notificationEventRepository: NotificationEventRepository,
  ) {}

  @Get('orders')
  @ApiOperation({ summary: 'Get all order events' })
  @ApiResponse({
    status: 200,
    description: 'Order events retrieved successfully',
  })
  getOrdersEvents(): Promise<DomainEvent[]> {
    return this.orderEventRepository.getOrderEvents();
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get all notification events' })
  @ApiResponse({
    status: 200,
    description: 'Notification events retrieved successfully',
  })
  getNotificationsEvents(): Promise<DomainEvent[]> {
    return this.notificationEventRepository.getNotificationEvents();
  }
}
