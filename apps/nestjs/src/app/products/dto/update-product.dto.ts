import { ApiProperty } from '@nestjs/swagger';
import { UpdateProductCommand } from '@ecommerce-monorepo/products-management';

export class UpdateProductDto implements Omit<UpdateProductCommand, 'id'> {
  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro Max',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 1199.99,
    minimum: 0,
    required: false,
  })
  price?: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 25,
    minimum: 0,
    required: false,
  })
  stock?: number;
}