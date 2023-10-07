import { Entity, PrimaryColumn, Column } from 'typeorm';
import { NotificationPrimitive } from '../../domain';

@Entity('NotificationTypeormEntity')
export class NotificationTypeormEntity implements NotificationPrimitive {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'text' })
  message: string;
}
