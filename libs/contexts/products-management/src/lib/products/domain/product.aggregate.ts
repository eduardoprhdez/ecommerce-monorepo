import { AggregateRoot } from '@ecommerce-monorepo/shared-kernel';
import { ProductPrimitive } from './primitives/product.primitive';
import { ProductIdValueObject } from './value-objects/product-id.value-object';
import { ProductNameValueObject } from './value-objects/product-name.value-object';
import { ProductStockValueObject } from './value-objects/product-stock.value-object';
import { SaveProductDTO } from './dto/save-product.dto';
import { v4 as uuid } from 'uuid';
import { ProductPriceValueObject } from './value-objects/product-price.value-object';

export class ProductAggregate extends AggregateRoot {
  id: ProductIdValueObject;
  name: ProductNameValueObject;
  stock: ProductStockValueObject;
  price: ProductPriceValueObject;

  constructor(
    id: ProductIdValueObject,
    name: ProductNameValueObject,
    stock: ProductStockValueObject,
    price: ProductPriceValueObject,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.stock = stock;
    this.price = price;
  }

  changeStock(orderStock: number): SaveProductDTO {
    this.stock = new ProductStockValueObject(orderStock);

    return this.toPersistencyDTO(false, true, true);
  }

  reduceStock(amountToReduce: number): SaveProductDTO {
    if (this.stock.value < amountToReduce) throw new Error();

    this.stock = new ProductStockValueObject(this.stock.value - amountToReduce);

    return this.toPersistencyDTO(false, true, false);
  }

  changeName(orderName: string): SaveProductDTO {
    this.name = new ProductNameValueObject(orderName);

    return this.toPersistencyDTO(true, false, false);
  }

  changePrice(orderPrice: number): SaveProductDTO {
    this.price = new ProductPriceValueObject(orderPrice);

    return this.toPersistencyDTO(false, false, true);
  }

  removeProduct(productId: ProductPrimitive['id']): SaveProductDTO {
    this.id = new ProductIdValueObject(productId);

    return this.toPersistencyDTO(false, false, false);
  }

  private toPersistencyDTO(
    name: boolean,
    stock: boolean,
    price: boolean,
  ): SaveProductDTO {
    return {
      id: this.id.value,
      ...(name && { state: this.name.value }),
      ...(stock && { stock: this.stock.value }),
      ...(price && { stock: this.price.value }),
    };
  }

  toPrimitives(): ProductPrimitive {
    return {
      id: this.id.value,
      name: this.name.value,
      stock: this.stock.value,
      price: this.price.value,
    };
  }

  static fromPrimitives(
    product: Omit<ProductPrimitive, 'id'> &
      Partial<Pick<ProductPrimitive, 'id'>>,
  ): ProductAggregate {
    const id = new ProductIdValueObject(product.id ?? uuid());
    const name = new ProductNameValueObject(product.name);
    const stock = new ProductStockValueObject(product.stock);
    const price = new ProductPriceValueObject(product.price);

    return new ProductAggregate(id, name, stock, price);
  }
}
