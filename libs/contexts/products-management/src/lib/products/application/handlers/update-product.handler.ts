import {
  BaseError,
  DatabaseRecordNotFoundError,
  UnexpectedError,
} from '@ecommerce-monorepo/shared';
import { ProductRepository, ProductAggregate } from '../../domain';
import { SaveProductDTO } from '../../domain/dto/save-product.dto';
import { UpdateProductCommand } from '../commands/update-product.command';

export class UpdateProductCommandHandler {
  constructor(private productRepository: ProductRepository) {}

  async execute(updateProductCommand: UpdateProductCommand): Promise<void> {
    try {
      const productPrimitive = await this.productRepository.getProduct(
        updateProductCommand.id,
      );

      if (!productPrimitive)
        throw new DatabaseRecordNotFoundError(this.constructor.name, 'execute');

      const product = ProductAggregate.fromPrimitives(productPrimitive);

      const productPersistencyDTO: SaveProductDTO = {
        id: updateProductCommand.id,
        ...(updateProductCommand.name &&
          product.changeName(updateProductCommand.name)),
        ...(updateProductCommand.stock &&
          product.changeStock(updateProductCommand.stock)),
      };

      return await this.productRepository.saveProduct(productPersistencyDTO);
    } catch (err) {
      if (err instanceof BaseError) throw err;
      throw new UnexpectedError(
        this.constructor.name,
        'execute',
        JSON.stringify(updateProductCommand),
      );
    }
  }
}
