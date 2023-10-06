import {
  CommandReplyOutcomeEnum,
  MessageType,
  ReplyMessageHeaders,
} from '@ecommerce-monorepo/saga';
import {
  ProductAggregate,
  ProductPrimitive,
  ProductRepository,
} from '../../../domain';
import { UnexpectedErrorWhileValidating } from '../replies/unexpected-error.reply';
import { ProductsValidated } from '../replies/product-validated.reply';
import {
  ReduceProductStockData,
  ReduceProductsStockCommand,
} from '../commands/reduce-products-stock.command';
import { SaveProductDTO } from '../../../domain/dto/save-product.dto';
import { Class } from '@ecommerce-monorepo/shared';
import { ProductInsufficientStock } from '../replies/product-insufficient-stock.reply';
import { ProductNotAvailable } from '../replies/product-not-available.reply';
import { ProductOutdatedPrice } from '../replies/product-outdated-price.reply';

export class ReduceProductsStockCommandHandler {
  constructor(private productRepository: ProductRepository) {}

  async execute(
    reduceProductsStockCommand: ReduceProductsStockCommand,
  ): Promise<Omit<MessageType, 'channel'>> {
    try {
      const productsPrimitives: ProductPrimitive[] = (
        await Promise.all(
          reduceProductsStockCommand.products.map((product) =>
            this.productRepository.getProduct(product.id),
          ),
        )
      ).filter((product) => product !== undefined) as ProductPrimitive[];

      if (this.hasDuplicates(productsPrimitives)) {
        throw new Error();
      }

      if (
        productsPrimitives.length !== reduceProductsStockCommand.products.length
      )
        return this.buildResponse(ProductNotAvailable, false);

      const productsAggregates = productsPrimitives.map((productPrimitive) =>
        ProductAggregate.fromPrimitives(productPrimitive),
      );

      if (
        productsAggregates.find(
          (product, index) =>
            product.price.value !==
            reduceProductsStockCommand.products[index].price,
        )
      )
        return this.buildResponse(ProductOutdatedPrice, false);

      let saveProductsDto: SaveProductDTO[];
      try {
        saveProductsDto = this.reduceProductsStock(
          productsAggregates,
          reduceProductsStockCommand.products,
        );
      } catch (err) {
        return this.buildResponse(ProductInsufficientStock, false);
      }

      await Promise.all(
        saveProductsDto.map((product) =>
          this.productRepository.saveProduct(product),
        ),
      );

      return this.buildResponse(ProductsValidated, true);
    } catch (err) {
      return this.buildResponse(UnexpectedErrorWhileValidating, false);
    }
  }

  hasDuplicates(products: ProductPrimitive[]): boolean {
    const productsSet = new Set(products.map((product) => product.id));

    if (productsSet.size < products.length) return true;

    return false;
  }

  reduceProductsStock(
    products: ProductAggregate[],
    productsData: ReduceProductStockData[],
  ): SaveProductDTO[] {
    if (products.length !== productsData.length) throw new Error();

    return products.map((product, index) =>
      product.reduceStock(productsData[index].quantity),
    );
  }

  private buildResponse(
    replyTypeClass: Class<unknown>,
    isSuccessfull: boolean,
  ) {
    return {
      payload: {},
      headers: {
        [ReplyMessageHeaders.REPLY_OUTCOME]: isSuccessfull
          ? CommandReplyOutcomeEnum.SUCCESS
          : CommandReplyOutcomeEnum.FALURE,
        [ReplyMessageHeaders.REPLY_TYPE]: replyTypeClass.name,
      },
    };
  }
}
