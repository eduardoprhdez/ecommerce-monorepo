import { SagaInstanceType } from './saga-instance-type';
import { SerializedSagaData } from './serialized-saga-data';
import { v4 as uuid } from 'uuid';

export class SagaInstance {
  private sagaType: string;
  private id: string;
  private lastRequestId: string | null;
  private serializedSagaData: SerializedSagaData;
  private stateName: string;
  private endState: boolean;
  private compensating: boolean;
  private failed: boolean;

  constructor(
    sagaType: string,
    sagaId: string | null,
    stateName: string,
    lastRequestId: string | null,
    serializedSagaData: SerializedSagaData,
    endState = false,
    compensating = false,
    failed = false,
  ) {
    this.sagaType = sagaType;
    this.id = sagaId ?? uuid();
    this.stateName = stateName;
    this.lastRequestId = lastRequestId;
    this.serializedSagaData = serializedSagaData;
    this.endState = endState;
    this.compensating = compensating;
    this.failed = failed;
  }

  toString(): string {
    return `SagaInstance{
      sagaType='${this.sagaType}',
      id='${this.id}',
      lastRequestId='${this.lastRequestId}',
      serializedSagaData=${this.serializedSagaData},
      stateName='${this.stateName}',
      endState=${this.endState},
      compensating=${this.compensating},
      failed=${this.failed}
    }`;
  }

  setSagaType(sagaType: string) {
    this.sagaType = sagaType;
  }

  getStateName(): string {
    return this.stateName;
  }

  setStateName(stateName: string) {
    this.stateName = stateName;
  }

  getSerializedSagaData(): SerializedSagaData {
    return this.serializedSagaData;
  }

  setSerializedSagaData(serializedSagaData: SerializedSagaData) {
    this.serializedSagaData = serializedSagaData;
  }

  setId(id: string) {
    this.id = id;
  }

  getSagaType(): string {
    return this.sagaType;
  }

  getId(): string | null {
    return this.id;
  }

  getLastRequestId(): string | null {
    return this.lastRequestId;
  }

  setLastRequestId(requestId: string | null) {
    this.lastRequestId = requestId;
  }

  setEndState(endState: boolean) {
    this.endState = endState;
  }

  isEndState(): boolean {
    return this.endState;
  }

  setCompensating(compensating: boolean) {
    this.compensating = compensating;
  }

  isCompensating(): boolean {
    return this.compensating;
  }

  setFailed(failed: boolean) {
    this.failed = failed;
  }

  isFailed(): boolean {
    return this.failed;
  }

  toPrimitives(): SagaInstanceType {
    return {
      id: this.id,
      compensating: this.compensating,
      endState: this.endState,
      failed: this.failed,
      sagaType: this.sagaType,
      serializedSagaData: {
        sagaDataJSON: this.serializedSagaData.getSagaDataJSON(),
      },
      stateName: this.stateName,
      lastRequestId: this.lastRequestId ?? undefined,
    };
  }
}
