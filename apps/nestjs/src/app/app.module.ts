import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { ProductTypeormEntity } from '@ecommerce-monorepo/products-management';
import {
  OrderEventTypeormEntity,
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
import {
  NotificationEventTypeormEntity,
  NotificationTypeormEntity,
} from '@ecommerce-monorepo/notifications-management';
import { EventsController } from './events/events.controller';

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
        OrderEventTypeormEntity,
        OrderItemTypeormEntity,
        SagaInstanceTypeorm,
        MessageTypeormEntity,
        NotificationTypeormEntity,
        NotificationEventTypeormEntity,
      ],
      synchronize: true,
      // logging: true,
    }),
    GraphqlModule,
    ProductsModule,
    OrdersModule,
    NotificationsModule,
  ],
  controllers: [AppController, EventsController],
  providers: [AppService, AppResolver],
})
export class AppModule {
  constructor() {
    console.log(__dirname.replace('/apps/nestjs', ''));
  }
}
