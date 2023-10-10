import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { OrderItemTypeormEntity } from './order-item-typeorm.entity';
import { OrderPrimitive, OrderItemPrimitive } from '../../domain';
import { OrderStatePrimitive } from '../../domain/primitives/order-state.primitive';

@Entity('OrderTypeormEntity')
export class OrderTypeormEntity implements OrderPrimitive {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'enum', enum: OrderStatePrimitive })
  state: OrderStatePrimitive;

  @Column({ type: 'varchar', length: 100, nullable: true })
  rejectionReason: string;

  @OneToMany(() => OrderItemTypeormEntity, (orderItem) => orderItem.order, {
    cascade: true,
  })
  items: OrderItemPrimitive[];

  @CreateDateColumn()
  creationDate: string;
}
