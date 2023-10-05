import { Repository } from 'typeorm';
import { SagaInstance } from '../../definitions/sagas/saga-instance';
import { SagaInstanceTypeorm } from './saga-instance-typeorm';
import { SagaInstanceRepository } from '../../definitions/sagas/saga-instance-repository';
import { SagaInstanceType } from '../../definitions/sagas/saga-instance-type';
import { SerializedSagaData } from '../../definitions/sagas/serialized-saga-data';
import { TransactionTypeorm } from '@ecommerce-monorepo/shared';

export class SagaInstanceTypeormRepository
  extends Repository<SagaInstanceTypeorm>
  implements SagaInstanceRepository
{
  async saveSaga(
    sagaInstance: SagaInstanceType,
    transaction?: TransactionTypeorm,
  ): Promise<void> {
    transaction
      ? transaction.queryRunner.manager.save(SagaInstanceTypeorm, sagaInstance)
      : this.save(sagaInstance);
  }

  async updateSaga(
    sagaInstance: SagaInstanceType,
    transaction?: TransactionTypeorm,
  ): Promise<void> {
    const { id, ...sagaInstanceNoId } = sagaInstance;
    transaction
      ? transaction.queryRunner.manager.update(
          SagaInstanceTypeorm,
          id,
          sagaInstanceNoId,
        )
      : this.update(id, sagaInstanceNoId);
  }

  async findSaga(sagaType: string, sagaId: string): Promise<SagaInstance> {
    const saga = await this.findOne({
      where: { id: sagaId },
    });

    //TODO: proper error
    if (!saga) throw new Error();

    return new SagaInstance(
      saga.sagaType,
      saga.id,
      saga.stateName,
      saga.lastRequestId ?? null,
      new SerializedSagaData(saga.serializedSagaData.sagaDataJSON),
      saga.endState,
      saga.compensating,
      saga.failed,
    );
  }
}
