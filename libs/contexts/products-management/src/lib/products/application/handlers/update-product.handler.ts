import { ProductRepository, ProductAggregate } from '../../domain';
import { SaveProductDTO } from '../../domain/dto/save-product.dto';
import { UpdateProductCommand } from '../commands/update-product.command';

export class UpdateProductCommandHandler {
  constructor(private productRepository: ProductRepository) {}

  async execute(updateProductCommand: UpdateProductCommand): Promise<void> {
    let product: ProductAggregate;
    try {
      product = ProductAggregate.fromPrimitives(
        await this.productRepository.getProduct(updateProductCommand.id),
      );
    } catch (err) {
      //TODO: Error más semántico
      throw new Error();
    }

    const productPersistencyDTO: SaveProductDTO = {
      id: updateProductCommand.id,
      ...(updateProductCommand.name &&
        product.changeName(updateProductCommand.name)),
      ...(updateProductCommand.stock &&
        product.changeStock(updateProductCommand.stock)),
    };

    try {
      return await this.productRepository.saveProduct(productPersistencyDTO);
    } catch (err) {
      //TODO: Error más semántico
      throw new Error();
    }
  }
}
