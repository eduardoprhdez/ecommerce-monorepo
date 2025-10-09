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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
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
import { PlaceOrderDto } from './dto/place-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('orders')
@UseFilters(new HttpExceptionFilter())
@Controller({ path: 'orders', version: '1' })
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
  @ApiOperation({ summary: 'Place a new order' })
  @ApiBody({ type: PlaceOrderDto })
  @ApiResponse({ status: 201, description: 'Order placed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
  async placeOrder(@Body() placeOrderRequest: PlaceOrderDto): Promise<void> {
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
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Order found successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  getOrder(@Param('id') orderId: string): Promise<OrderPrimitive> {
    return this.getOrderCommandHandler.execute({ id: orderId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: [OrderResponseDto],
  })
  getOrders(): Promise<OrderPrimitive[]> {
    return this.getManyOrdersCommandHandler.execute();
  }
}
