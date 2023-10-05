import { SagaInstance } from './saga-instance';

export interface SagaManager<Data> {
  create(sagaData: Data): Promise<SagaInstance>;

  subscribeToReplyChannel(): void;
}
