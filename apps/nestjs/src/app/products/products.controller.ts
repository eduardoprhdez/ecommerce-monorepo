import {
  Controller,
  Post,
  Inject,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  Get,
} from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import {
  CreateProductCommandHandler,
  UpdateProductCommandHandler,
  DeleteProductCommandHandler,
  CreateProductCommand,
  UpdateProductCommand,
  ReduceProductsStockCommandHandler,
  ReduceProductsStockCommand,
  GetProductQueryHandler,
  ProductPrimitive,
  GetManyProductsQueryHandler,
} from '@ecommerce-monorepo/products-management';
import {
  CommandMessageHeaders,
  MessageType,
  SagaCommand,
  SagaCommandMessageHeaders,
  SagaReplyHeaders,
} from '@ecommerce-monorepo/saga';
import { PRODUCT_EVENT_EMITTER } from '../orders/constants/contants';
import { HttpExceptionFilter } from '../errors/http-exception-filter';

@Controller('products')
@UseFilters(new HttpExceptionFilter())
export class ProductController {
  constructor(
    @Inject(GetProductQueryHandler)
    private readonly getProductQueryHandler: GetProductQueryHandler,
    @Inject(GetManyProductsQueryHandler)
    private readonly getManyProductsQueryHandler: GetManyProductsQueryHandler,
    @Inject(CreateProductCommandHandler)
    private readonly createProductCommandHandler: CreateProductCommandHandler,
    @Inject(UpdateProductCommandHandler)
    private readonly updateProductCommandHandler: UpdateProductCommandHandler,
    @Inject(DeleteProductCommandHandler)
    private readonly deleteProductCommandHandler: DeleteProductCommandHandler,
    @Inject(ReduceProductsStockCommandHandler)
    private readonly reduceProductsStockCommandHandler: ReduceProductsStockCommandHandler,
    @Inject(PRODUCT_EVENT_EMITTER)
    private readonly productEventEmitter: ClientKafka,
  ) {}

  @Get(':id')
  getProduct(@Param('id') productId: string): Promise<ProductPrimitive> {
    return this.getProductQueryHandler.execute({ id: productId });
  }

  @Get()
  getProducts(): Promise<ProductPrimitive[]> {
    return this.getManyProductsQueryHandler.execute();
  }

  @Post()
  createProduct(
    @Body() createProductRequest: CreateProductCommand,
  ): Promise<void> {
    return this.createProductCommandHandler.execute(createProductRequest);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') productId: string,
    @Body() updateProductRequest: Omit<UpdateProductCommand, 'id'>,
  ): Promise<void> {
    return this.updateProductCommandHandler.execute({
      ...updateProductRequest,
      id: productId,
    });
  }

  @Delete(':id')
  deleteProduct(@Param('id') productId: string): Promise<void> {
    return this.deleteProductCommandHandler.execute({ id: productId });
  }

  @EventPattern('product.reduce_products_stock')
  async validateItems(
    @Payload('data') data: { payload: string; headers: string },
  ) {
    const headers: Record<string, string> = JSON.parse(data.headers);
    const payload: SagaCommand = JSON.parse(data.payload);
    const messageResult = await this.reduceProductsStockCommandHandler.execute(
      payload as ReduceProductsStockCommand,
    );

    messageResult.headers[SagaReplyHeaders.REPLY_SAGA_ID] =
      headers[SagaCommandMessageHeaders.SAGA_ID];
    messageResult.headers[SagaReplyHeaders.REPLY_SAGA_TYPE] =
      headers[SagaCommandMessageHeaders.SAGA_TYPE];

    this.productEventEmitter.emit<MessageType>(
      headers[CommandMessageHeaders.REPLY_TO],
      messageResult,
    );
  }
}
