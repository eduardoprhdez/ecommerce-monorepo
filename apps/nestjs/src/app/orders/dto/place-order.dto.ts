import { OrderItemPrimitive, PlaceOrderCommand } from '@ecommerce-monorepo/orders-management';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto implements OrderItemPrimitive {
  @ApiProperty({
    description: 'Order item identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Bluetooth Headphones',
  })
  name: string;

  @ApiProperty({
    description: 'Product price',
    example: 99.99,
    minimum: 0,
  })
  price: number;

  @ApiProperty({
    description: 'Quantity to order',
    example: 2,
    minimum: 1,
  })
  quantity: number;
}

export class PlaceOrderDto implements PlaceOrderCommand {
  @ApiProperty({
    description: 'List of items to order',
    type: [OrderItemDto],
    example: [
      { 
        id: '123e4567-e89b-12d3-a456-426614174000', 
        name: 'Wireless Bluetooth Headphones',
        price: 99.99,
        quantity: 2
      },
      { 
        id: '456e7890-e89b-12d3-a456-426614174001', 
        name: 'USB-C Cable',
        price: 15.99,
        quantity: 1
      },
    ],
  })
  items: OrderItemPrimitive[];
}