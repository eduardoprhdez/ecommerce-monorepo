import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('NotificationEventTypeormEntity')
export class NotificationEventTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  aggregateId: string;

  @Column({ type: 'varchar', length: 100 })
  eventType: string;

  @Column({ type: 'json' })
  eventData: Record<string, unknown>;
}
