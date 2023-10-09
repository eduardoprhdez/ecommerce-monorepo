import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { ProductTypeormEntity } from '@ecommerce-monorepo/products-management';
import {
  OrderItemTypeormEntity,
  OrderTypeormEntity,
} from '@ecommerce-monorepo/orders-management';
import {
  MessageTypeormEntity,
  SagaInstanceTypeorm,
} from '@ecommerce-monorepo/saga';
import { NotificationsModule } from './notifications/notifications.module';
import { GraphqlModule } from './graphql/graphql.module';
import { AppResolver } from './app.resolver';
import { NotificationTypeormEntity } from '@ecommerce-monorepo/notifications-management';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'ecommerce',
      entities: [
        ProductTypeormEntity,
        OrderTypeormEntity,
        OrderItemTypeormEntity,
        SagaInstanceTypeorm,
        MessageTypeormEntity,
        NotificationTypeormEntity,
      ],
      synchronize: true,
      // logging: true,
    }),
    GraphqlModule,
    ProductsModule,
    OrdersModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {
  constructor() {
    console.log(__dirname.replace('/apps/nestjs', ''));
  }
}
