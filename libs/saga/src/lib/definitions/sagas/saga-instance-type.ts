import { SerializedSagaDataType } from './serialized-saga-data';

export interface SagaInstanceType {
  id: string;
  sagaType: string;
  lastRequestId?: string;
  serializedSagaData: SerializedSagaDataType;
  stateName: string;
  endState: boolean;
  compensating: boolean;
  failed: boolean;
}
