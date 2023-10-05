export interface SerializedSagaDataType {
  sagaDataJSON: string;
}

export class SerializedSagaData {
  private readonly sagaDataJSON: string;

  constructor(sagaDataJSON: string) {
    this.sagaDataJSON = sagaDataJSON;
  }

  public getSagaDataJSON(): string {
    return this.sagaDataJSON;
  }
}
