import { Transaction } from '@ecommerce-monorepo/shared';
import { SagaInstance } from './saga-instance';
import { SagaInstanceType } from './saga-instance-type';

export interface SagaInstanceRepository {
  saveSaga(
    sagaInstance: SagaInstanceType,
    transaction?: Transaction,
  ): Promise<void>;
  findSaga(sagaType: string, sagaId: string): Promise<SagaInstance | undefined>;
  updateSaga(
    sagaInstance: SagaInstanceType,
    transaction?: Transaction,
  ): Promise<void>;
}
