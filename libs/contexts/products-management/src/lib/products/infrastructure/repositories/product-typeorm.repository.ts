import { Repository } from 'typeorm';
import { ProductRepository, ProductPrimitive } from '../../domain';
import { ProductTypeormEntity } from '../entities/product-typeorm.entity';
import { SaveProductDTO } from '../../domain/dto/save-product.dto';
import { DatabaseError } from '@ecommerce-monorepo/shared';

export class ProductTypeormRepository
  extends Repository<ProductTypeormEntity>
  implements ProductRepository
{
  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.delete(productId);
    } catch (error) {
      console.log(error);
      throw new DatabaseError(
        this.constructor.name,
        'deleteProduct',
        productId,
      );
    }
  }
  async saveProduct(product: SaveProductDTO): Promise<void> {
    try {
      await this.save(product);
    } catch (error) {
      console.log(error);
      throw new DatabaseError(
        this.constructor.name,
        'saveProduct',
        JSON.stringify(product),
      );
    }
  }

  async getProduct(productId: string): Promise<ProductPrimitive | undefined> {
    try {
      const product = await this.findOne({
        where: { id: productId },
      });

      return product ?? undefined;
    } catch (error) {
      console.error(error);
      throw new DatabaseError(this.constructor.name, 'getProduct', productId);
    }
  }
}
