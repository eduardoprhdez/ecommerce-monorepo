import {
  CommandWithDestination,
  Saga,
  SagaBuilder,
  SagaDefinition,
} from '@ecommerce-monorepo/saga';
import { CancelOrderCommandHandler } from '../handlers/cancel-order.handler';
import { PlaceOrderCommandHandler } from '../handlers/place-order.handler';

import { PlaceOrderSagaData } from './place-order-saga-data';
import { ApproveOrderCommandHandler } from '../handlers/approve-order.handler';
import { RejectionReason } from './common/rejection-reason.common';
import { ProductServiceProxy } from './product-service-proxy';
import {
  ProductInsufficientStock,
  ProductNotAvailable,
  ProductOutdatedPrice,
} from '@ecommerce-monorepo/products-management';

export class PlaceOrderSaga implements Saga<PlaceOrderSagaData> {
  private sagaDefinition: SagaDefinition<PlaceOrderSagaData>;
  private placeOrderCommmandHandler: PlaceOrderCommandHandler;
  private approveOrderCommandHandler: ApproveOrderCommandHandler;
  private cancelOrderCommmandHandler: CancelOrderCommandHandler;
  private productService: ProductServiceProxy;

  constructor(
    placeOrderCommmandHandler: PlaceOrderCommandHandler,
    approveOrderCommandHandler: ApproveOrderCommandHandler,
    cancelOrderCommmandHandler: CancelOrderCommandHandler,
    productService: ProductServiceProxy,
  ) {
    const sagaBuilder = new SagaBuilder<PlaceOrderSagaData>();
    this.placeOrderCommmandHandler = placeOrderCommmandHandler;
    this.approveOrderCommandHandler = approveOrderCommandHandler;
    this.cancelOrderCommmandHandler = cancelOrderCommmandHandler;
    this.productService = productService;

    this.sagaDefinition = sagaBuilder
      .step()
      .invokeLocal(this.placeOrder.bind(this))
      .withCompensation(this.cancelOrder.bind(this))
      .step()
      .invokeParticipant(this.reduceItemsStock.bind(this))
      .onReply(
        ProductNotAvailable.name,
        this.handleOrderItemNotAvailable.bind(this),
      )
      .onReply(
        ProductInsufficientStock.name,
        this.handleOrderItemInsufficientStock.bind(this),
      )
      .onReply(
        ProductOutdatedPrice.name,
        this.handleOrderItemOutdatedPrice.bind(this),
      )
      .step()
      .invokeLocal(this.approveOrder.bind(this))
      .build();
  }

  async handleOrderItemNotAvailable(
    data: PlaceOrderSagaData,
  ): Promise<undefined> {
    data.rejectionReason = RejectionReason.ITEM_NOT_AVAILABLE;
  }

  async handleOrderItemInsufficientStock(
    data: PlaceOrderSagaData,
  ): Promise<undefined> {
    data.rejectionReason = RejectionReason.INSUFFICIENT_ITEM_STOCK;
  }

  async handleOrderItemOutdatedPrice(
    data: PlaceOrderSagaData,
  ): Promise<undefined> {
    data.rejectionReason = RejectionReason.OUTDATED_ITEM_PRICE;
  }

  getSagaDefinition(): SagaDefinition<PlaceOrderSagaData> {
    return this.sagaDefinition;
  }

  getSagaType(): string {
    return PlaceOrderSaga.name;
  }

  async cancelOrder(data: PlaceOrderSagaData): Promise<undefined> {
    await this.cancelOrderCommmandHandler.execute(data);
  }

  async approveOrder(data: PlaceOrderSagaData): Promise<undefined> {
    await this.approveOrderCommandHandler.execute(data);
  }

  async placeOrder(data: PlaceOrderSagaData): Promise<undefined> {
    await this.placeOrderCommmandHandler.execute(data);
  }

  private reduceItemsStock(
    data: PlaceOrderSagaData,
  ): Promise<CommandWithDestination> {
    return new Promise((resolve) =>
      resolve(this.productService.reduceItemsStock(data.id, data.items)),
    );
  }
}
