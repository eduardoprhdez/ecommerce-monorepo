import {
  CommandWithDestination,
  CommandWithDestinationBuilder,
} from '@ecommerce-monorepo/saga';
import { OrderItemPrimitive } from '../../domain';
import { ReduceProductsStockCommand } from '@ecommerce-monorepo/products-management';

export class ProductServiceProxy {
  reduceItemsStock(
    orderId: string,
    items: OrderItemPrimitive[],
  ): CommandWithDestination {
    return CommandWithDestinationBuilder.send<ReduceProductsStockCommand>({
      products: items.map((item) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
      })),
    })
      .to('product.reduce_products_stock')
      .build();
  }
}
