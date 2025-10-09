import { ApiProperty } from '@nestjs/swagger';
import { CreateProductCommand } from '@ecommerce-monorepo/products-management';

export class CreateProductDto implements CreateProductCommand {
  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
  })
  name: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 999.99,
    minimum: 0,
  })
  price: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 50,
    minimum: 0,
  })
  stock: number;
}