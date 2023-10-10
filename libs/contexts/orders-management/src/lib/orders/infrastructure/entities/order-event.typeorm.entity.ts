import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('OrderEventTypeormEntity')
export class OrderEventTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  aggregateId: string;

  @Column({ type: 'varchar', length: 100 })
  eventType: string;

  @Column({ type: 'json' })
  eventData: Record<string, unknown>;

  @CreateDateColumn()
  creationDate: string;
}
