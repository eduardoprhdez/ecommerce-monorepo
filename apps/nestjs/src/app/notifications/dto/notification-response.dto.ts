import { ApiProperty } from '@nestjs/swagger';
import { NotificationPrimitive } from '@ecommerce-monorepo/notifications-management';

export class NotificationResponseDto implements NotificationPrimitive {
  @ApiProperty({
    description: 'Notification unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'Your order has been placed successfully',
  })
  message: string;
}