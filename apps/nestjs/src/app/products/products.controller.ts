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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  CreateProductCommandHandler,
  UpdateProductCommandHandler,
  DeleteProductCommandHandler,
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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@ApiTags('products')
@Controller({ path: 'products', version: '1' })
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
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Product found successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  getProduct(@Param('id') productId: string): Promise<ProductPrimitive> {
    return this.getProductQueryHandler.execute({ id: productId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: [ProductResponseDto],
  })
  getProducts(): Promise<ProductPrimitive[]> {
    return this.getManyProductsQueryHandler.execute();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  createProduct(@Body() createProductRequest: CreateProductDto): Promise<void> {
    return this.createProductCommandHandler.execute(createProductRequest);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'string' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  updateProduct(
    @Param('id') productId: string,
    @Body() updateProductRequest: UpdateProductDto,
  ): Promise<void> {
    return this.updateProductCommandHandler.execute({
      ...updateProductRequest,
      id: productId,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
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
