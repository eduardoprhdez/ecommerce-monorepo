import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { NotificationPrimitive } from '../../domain';

@Entity('NotificationTypeormEntity')
export class NotificationTypeormEntity implements NotificationPrimitive {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  creationDate: string;
}
