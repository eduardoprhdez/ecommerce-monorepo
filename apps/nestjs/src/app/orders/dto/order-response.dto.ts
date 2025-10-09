import { ApiProperty } from '@nestjs/swagger';
import { OrderPrimitive, OrderItemPrimitive, OrderStatePrimitive } from '@ecommerce-monorepo/orders-management';

class OrderItemResponseDto implements OrderItemPrimitive {
  @ApiProperty({
    description: 'Order item unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
  })
  name: string;

  @ApiProperty({
    description: 'Product price at time of order',
    example: 999.99,
  })
  price: number;

  @ApiProperty({
    description: 'Quantity ordered',
    example: 2,
  })
  quantity: number;
}

export class OrderResponseDto implements OrderPrimitive {
  @ApiProperty({
    description: 'Order unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Order items',
    type: [OrderItemResponseDto],
  })
  items: OrderItemPrimitive[];

  @ApiProperty({
    description: 'Order state',
    enum: OrderStatePrimitive,
    example: OrderStatePrimitive.PENDING,
  })
  state: OrderStatePrimitive;

  @ApiProperty({
    description: 'Rejection reason if order was cancelled',
    example: 'Insufficient stock',
    required: false,
  })
  rejectionReason?: string;
}