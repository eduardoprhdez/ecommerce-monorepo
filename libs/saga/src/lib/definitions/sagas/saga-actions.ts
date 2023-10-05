import { CommandWithDestination } from '../commands/command-with-destination';
import { SagaActionsData } from './saga-actions-data';

export class SagaActions<Data> {
  private sagaActionsData: SagaActionsData<Data>;

  constructor(
    command: CommandWithDestination | undefined,
    updatedSagaData: Data | undefined,
    updatedState: string | undefined,
    endState: boolean,
    compensating: boolean,
    failed: boolean,
    isLocal = false,
    localError?: Error,
  ) {
    this.sagaActionsData = {
      command,
      updatedSagaData,
      updatedState,
      endState,
      compensating,
      failed,
      isLocal,
      localError,
    };
  }

  getCommand(): CommandWithDestination | undefined {
    return this.sagaActionsData.command;
  }

  getUpdatedSagaData(): Data | undefined {
    return this.sagaActionsData.updatedSagaData;
  }

  getUpdatedState(): string | undefined {
    return this.sagaActionsData.updatedState;
  }

  getLocalError(): Error | undefined {
    return this.sagaActionsData.localError;
  }

  getIsLocal(): boolean {
    return this.sagaActionsData.isLocal;
  }

  isEndState(): boolean {
    return this.sagaActionsData.endState;
  }

  isCompensating(): boolean {
    return this.sagaActionsData.compensating;
  }

  isFailed(): boolean {
    return this.sagaActionsData.failed;
  }

  setLocalError(error: Error) {
    this.sagaActionsData.localError = error;
  }

  isReplyExpected(): boolean {
    return this.sagaActionsData.command
      ? true
      : false || !this.sagaActionsData.isLocal;
  }
}
