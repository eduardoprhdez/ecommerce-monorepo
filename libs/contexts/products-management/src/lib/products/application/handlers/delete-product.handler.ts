import { ProductRepository, ProductAggregate } from '../../domain';
import { DeleteProductCommand } from '../commands/delete-product.command';

export class DeleteProductCommandHandler {
  constructor(private productRepository: ProductRepository) {}

  async execute(deleteProductCommand: DeleteProductCommand): Promise<void> {
    let productAggregate: ProductAggregate;

    try {
      productAggregate = ProductAggregate.fromPrimitives(
        await this.productRepository.getProduct(deleteProductCommand.id),
      );
    } catch (err) {
      //TODO: Error más semántico
      throw new Error();
    }

    try {
      return await this.productRepository.deleteProduct(
        productAggregate.toPrimitives().id,
      );
    } catch (err) {
      //TODO: Error más semántico
      throw new Error();
    }
  }
}
