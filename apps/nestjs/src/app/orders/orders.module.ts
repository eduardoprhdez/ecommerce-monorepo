import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  OrderTypeormEntity,
  OrderRepository,
  OrderTypeormRepository,
  PlaceOrderCommandHandler,
  CancelOrderCommandHandler,
  GetOrderQueryHandler,
  OrderStatePrimitive,
  PlaceOrderSaga,
  ProductServiceProxy,
  PlaceOrderSagaData,
  ApproveOrderCommandHandler,
  GetManyOrdersQueryHandler,
  OrderEventTypeormRepository,
  OrderEventTypeormEntity,
  OrderEventRepository,
} from '@ecommerce-monorepo/orders-management';
import { EntityManager } from 'typeorm';
import {
  MESSAGE_REPOSITORY,
  ORDER_EVENT_REPOSITORY,
  ORDER_REPOSITORY,
  PLACE_ORDER_SAGA_MANAGER,
  SAGA_KAFKA_CONSUMER,
  SAGA_REPOSITORY,
} from './constants/contants';
import { OrdersController } from './orders.controller';
import { registerEnumType } from '@nestjs/graphql';
import {
  CommandProducerImpl,
  MessageConsumerImpl,
  MessageRepository,
  MessageTypeormEntity,
  MessageTypeormRepository,
  SagaInstanceRepository,
  SagaInstanceTypeorm,
  SagaInstanceTypeormRepository,
  SagaManagerImpl,
} from '@ecommerce-monorepo/saga';
import { Consumer, Kafka } from 'kafkajs';
import {
  TransactionManager,
  TransactionManagerTypeorm,
} from '@ecommerce-monorepo/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderTypeormEntity,
      SagaInstanceTypeorm,
      MessageTypeormEntity,
      OrderEventTypeormEntity,
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    TransactionManagerTypeorm,
    {
      provide: ORDER_REPOSITORY,
      useFactory(entityManager: EntityManager): OrderRepository {
        return new OrderTypeormRepository(OrderTypeormEntity, entityManager);
      },
      inject: [EntityManager],
    },
    {
      provide: ORDER_EVENT_REPOSITORY,
      useFactory(entityManager: EntityManager): OrderEventRepository {
        return new OrderEventTypeormRepository(
          OrderEventTypeormEntity,
          entityManager,
        );
      },
      inject: [EntityManager],
    },
    {
      provide: PlaceOrderCommandHandler,
      useFactory(
        orderRepository: OrderRepository,
        orderEventRepository: OrderEventRepository,
        transactionManager: TransactionManagerTypeorm,
      ): PlaceOrderCommandHandler {
        return new PlaceOrderCommandHandler(
          orderRepository,
          orderEventRepository,
          transactionManager,
        );
      },
      inject: [
        ORDER_REPOSITORY,
        ORDER_EVENT_REPOSITORY,
        TransactionManagerTypeorm,
      ],
    },
    {
      provide: CancelOrderCommandHandler,
      useFactory(
        orderRepository: OrderRepository,
        orderEventRepository: OrderEventRepository,
        transactionManager: TransactionManagerTypeorm,
      ): CancelOrderCommandHandler {
        return new CancelOrderCommandHandler(
          orderRepository,
          orderEventRepository,
          transactionManager,
        );
      },
      inject: [
        ORDER_REPOSITORY,
        ORDER_EVENT_REPOSITORY,
        TransactionManagerTypeorm,
      ],
    },
    {
      provide: ApproveOrderCommandHandler,
      useFactory(
        orderRepository: OrderRepository,
        orderEventRepository: OrderEventRepository,
        transactionManager: TransactionManagerTypeorm,
      ): ApproveOrderCommandHandler {
        return new ApproveOrderCommandHandler(
          orderRepository,
          orderEventRepository,
          transactionManager,
        );
      },
      inject: [
        ORDER_REPOSITORY,
        ORDER_EVENT_REPOSITORY,
        TransactionManagerTypeorm,
      ],
    },
    {
      provide: GetOrderQueryHandler,
      useFactory(orderRepository: OrderRepository): GetOrderQueryHandler {
        return new GetOrderQueryHandler(orderRepository);
      },
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: GetManyOrdersQueryHandler,
      useFactory(orderRepository: OrderRepository): GetManyOrdersQueryHandler {
        return new GetManyOrdersQueryHandler(orderRepository);
      },
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: MESSAGE_REPOSITORY,
      useFactory(entityManager: EntityManager): MessageRepository {
        return new MessageTypeormRepository(
          MessageTypeormEntity,
          entityManager,
        );
      },
      inject: [EntityManager],
    },
    {
      provide: SAGA_REPOSITORY,
      useFactory(entityManager: EntityManager): SagaInstanceRepository {
        return new SagaInstanceTypeormRepository(
          SagaInstanceTypeorm,
          entityManager,
        );
      },
      inject: [EntityManager],
    },
    {
      provide: SAGA_KAFKA_CONSUMER,
      useFactory(): Consumer {
        const kafka = new Kafka({
          clientId: 'saga-kafka',
          brokers: ['localhost:9092'],
        });

        return kafka.consumer({ groupId: 'saga-kafka-consumer' });
      },
      inject: [],
    },
    {
      provide: PLACE_ORDER_SAGA_MANAGER,
      useFactory(
        placeOrderCommandHandler: PlaceOrderCommandHandler,
        cancelOrderCommandHandler: CancelOrderCommandHandler,
        approveOrderCommandHandler: ApproveOrderCommandHandler,
        sagaRepository: SagaInstanceRepository,
        messageRepository: MessageRepository,
        sagaKafkaConsumer: Consumer,
        transactionManager: TransactionManager,
      ): SagaManagerImpl<PlaceOrderSagaData> {
        const productService = new ProductServiceProxy();
        const placeOrderSaga = new PlaceOrderSaga(
          placeOrderCommandHandler,
          approveOrderCommandHandler,
          cancelOrderCommandHandler,
          productService,
        );
        const commandProducer = new CommandProducerImpl(messageRepository);
        const logger = new Logger('PlaceOrderSaga');
        const messageConsumer = new MessageConsumerImpl(
          sagaKafkaConsumer,
          logger,
        );
        const sagaManager = new SagaManagerImpl(
          placeOrderSaga,
          sagaRepository,
          commandProducer,
          messageConsumer,
          transactionManager,
          logger,
        );
        sagaManager.subscribeToReplyChannel();
        return sagaManager;
      },
      inject: [
        PlaceOrderCommandHandler,
        CancelOrderCommandHandler,
        ApproveOrderCommandHandler,
        SAGA_REPOSITORY,
        MESSAGE_REPOSITORY,
        SAGA_KAFKA_CONSUMER,
        TransactionManagerTypeorm,
      ],
    },
  ],
})
export class OrdersModule {
  constructor() {
    registerEnumType(OrderStatePrimitive, {
      name: 'OrderStatePrimitive',
    });
  }
}
