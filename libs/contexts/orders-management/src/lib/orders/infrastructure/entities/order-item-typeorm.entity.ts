import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OrderItemPrimitive } from '../../domain';
import { OrderTypeormEntity } from './order-typeorm.entity';

@Entity('OrderItemTypeormEntity')
export class OrderItemTypeormEntity implements OrderItemPrimitive {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'integer' })
  quantity: number;

  @ManyToOne(() => OrderTypeormEntity, (order) => order.items, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  order?: OrderTypeormEntity;

  @CreateDateColumn()
  creationDate: string;
}
