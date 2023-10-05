import { SagaDefinition } from './saga-definition';

export interface Saga<Data> {
  getSagaDefinition(): SagaDefinition<Data>;

  getSagaType(): string;

  // default void onStarting(String sagaId, Data data) {  }
  // default void onSagaCompletedSuccessfully(String sagaId, Data data) {  }
  // default void onSagaRolledBack(String sagaId, Data data) {  }
  // default void onSagaFailed(String sagaId, Data data) {};
}
