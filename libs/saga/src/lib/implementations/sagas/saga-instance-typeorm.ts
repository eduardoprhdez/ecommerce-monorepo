import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { SagaInstanceType } from '../../definitions/sagas/saga-instance-type';
import { SerializedSagaDataType } from '../../definitions/sagas/serialized-saga-data';

@Entity('SagaInstanceTypeorm')
export class SagaInstanceTypeorm implements SagaInstanceType {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  sagaType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastRequestId?: string;

  @Column({ type: 'json' })
  serializedSagaData: SerializedSagaDataType;

  @Column({ type: 'text' })
  stateName: string;

  @Column({ type: 'boolean' })
  endState: boolean;

  @Column({ type: 'boolean' })
  compensating: boolean;

  @Column({ type: 'boolean' })
  failed: boolean;

  @CreateDateColumn()
  creationDate: string;
}
