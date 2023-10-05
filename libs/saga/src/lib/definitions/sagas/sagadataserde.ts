import { SerializedSagaData } from './serialized-saga-data';

export class SagaDataSerde {
  static serializeSagaData<Data>(sagaData: Data): SerializedSagaData {
    return new SerializedSagaData(JSON.stringify(sagaData));
  }

  static deserializeSagaData<Data>(
    serializedSagaData: SerializedSagaData,
  ): Data {
    return JSON.parse(serializedSagaData.getSagaDataJSON());
  }
}
