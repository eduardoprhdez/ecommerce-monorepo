import { Check, Column, Entity, PrimaryColumn } from 'typeorm';
import { ProductPrimitive } from '../../domain';

@Entity('ProductTypeormEntity')
@Check('"price" > 0')
export class ProductTypeormEntity implements ProductPrimitive {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'integer' })
  stock: number;

  @Column({ type: 'float' })
  price: number;
}
