import { ApiProperty } from '@nestjs/swagger';
import { ProductPrimitive } from '@ecommerce-monorepo/products-management';

export class ProductResponseDto implements ProductPrimitive {
  @ApiProperty({
    description: 'Product unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
  })
  name: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 999.99,
  })
  price: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 50,
  })
  stock: number;
}