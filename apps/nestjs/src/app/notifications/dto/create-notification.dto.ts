import { ApiProperty } from '@nestjs/swagger';
import { CreateNotificationCommand } from '@ecommerce-monorepo/notifications-management';

export class CreateNotificationDto implements CreateNotificationCommand {
  @ApiProperty({
    description: 'Notification message',
    example: 'Your order has been placed successfully',
  })
  message: string;
}