import {
  Controller,
  Post,
  Inject,
  Body,
  Get,
  Param,
  UseFilters,
} from '@nestjs/common';
import {
  PlaceOrderCommand,
  GetOrderQueryHandler,
  OrderPrimitive,
  OrderStatePrimitive,
  PlaceOrderSagaData,
  OrderAggregate,
  GetManyOrdersQueryHandler,
} from '@ecommerce-monorepo/orders-management';
import { PLACE_ORDER_SAGA_MANAGER } from './constants/contants';
import { SagaManager } from '@ecommerce-monorepo/saga';
import { HttpExceptionFilter } from '../errors/http-exception-filter';

@UseFilters(new HttpExceptionFilter())
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(PLACE_ORDER_SAGA_MANAGER)
    private readonly placeOrderSagaManager: SagaManager<PlaceOrderSagaData>,
    @Inject(GetOrderQueryHandler)
    private readonly getOrderCommandHandler: GetOrderQueryHandler,
    @Inject(GetManyOrdersQueryHandler)
    private readonly getManyOrdersCommandHandler: GetManyOrdersQueryHandler,
  ) {}

  @Post()
  async placeOrder(
    @Body() placeOrderRequest: PlaceOrderCommand,
  ): Promise<void> {
    const order = OrderAggregate.fromPrimitives({
      items: placeOrderRequest.items,
      state: OrderStatePrimitive.PENDING,
    });

    await this.placeOrderSagaManager.create({
      id: order.id.value,
      items: order.items.map((item) => item.toPrimitives()),
    });
  }

  @Get(':id')
  getOrder(@Param('id') orderId: string): Promise<OrderPrimitive> {
    return this.getOrderCommandHandler.execute({ id: orderId });
  }

  @Get()
  getOrders(): Promise<OrderPrimitive[]> {
    return this.getManyOrdersCommandHandler.execute();
  }
}
