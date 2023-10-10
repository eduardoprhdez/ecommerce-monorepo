import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ProductTypeormRepository,
  ProductRepository,
  ProductTypeormEntity,
  CreateProductCommandHandler,
  UpdateProductCommandHandler,
  DeleteProductCommandHandler,
  ReduceProductsStockCommandHandler,
  GetProductQueryHandler,
  GetManyProductsQueryHandler,
} from '@ecommerce-monorepo/products-management';
import { EntityManager } from 'typeorm';
import { PRODUCT_REPOSITORY } from './constants/products.constants';
import { ProductController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_EVENT_EMITTER } from '../orders/constants/contants';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductTypeormRepository]),
    ClientsModule.register([
      {
        name: PRODUCT_EVENT_EMITTER,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'product',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'product-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useFactory(entityManager: EntityManager): ProductRepository {
        return new ProductTypeormRepository(
          ProductTypeormEntity,
          entityManager,
        );
      },
      inject: [EntityManager],
    },
    {
      provide: GetProductQueryHandler,
      useFactory(productRepository: ProductRepository): GetProductQueryHandler {
        return new GetProductQueryHandler(productRepository);
      },
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: GetManyProductsQueryHandler,
      useFactory(
        productRepository: ProductRepository,
      ): GetManyProductsQueryHandler {
        return new GetManyProductsQueryHandler(productRepository);
      },
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: CreateProductCommandHandler,
      useFactory(
        productRepository: ProductRepository,
      ): CreateProductCommandHandler {
        return new CreateProductCommandHandler(productRepository);
      },
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: UpdateProductCommandHandler,
      useFactory(
        productRepository: ProductRepository,
      ): UpdateProductCommandHandler {
        return new UpdateProductCommandHandler(productRepository);
      },
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: DeleteProductCommandHandler,
      useFactory(
        productRepository: ProductRepository,
      ): DeleteProductCommandHandler {
        return new DeleteProductCommandHandler(productRepository);
      },
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: ReduceProductsStockCommandHandler,
      useFactory(
        productRepository: ProductRepository,
      ): ReduceProductsStockCommandHandler {
        return new ReduceProductsStockCommandHandler(productRepository);
      },
      inject: [PRODUCT_REPOSITORY],
    },
  ],
})
export class ProductsModule {}
