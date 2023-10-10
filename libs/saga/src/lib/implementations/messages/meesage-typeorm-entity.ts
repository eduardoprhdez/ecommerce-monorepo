import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { MessageEntity } from '../../definitions/messages/message-entity';
import { SagaCommand } from '../../definitions/commands/command';

@Entity('MessageTypeormEntity')
export class MessageTypeormEntity implements MessageEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  channel: string;

  @Column({ type: 'json' })
  payload: SagaCommand;

  @Column({ type: 'json' })
  headers: Record<string, string>;

  @CreateDateColumn()
  creationDate: string;
}
