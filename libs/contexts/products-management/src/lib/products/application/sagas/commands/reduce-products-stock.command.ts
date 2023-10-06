import { SagaCommand } from '@ecommerce-monorepo/saga';

export interface ReduceProductStockData {
  id: string;
  price: number;
  quantity: number;
}

export interface ReduceProductsStockCommand extends SagaCommand {
  products: ReduceProductStockData[];
}
