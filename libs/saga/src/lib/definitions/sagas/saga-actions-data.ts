import { CommandWithDestination } from '../commands/command-with-destination';

export interface SagaActionsData<Data> {
  command?: CommandWithDestination;
  updatedSagaData?: Data;
  updatedState?: string;
  endState: boolean;
  compensating: boolean;
  failed: boolean;
  isLocal: boolean;
  localError?: Error;
}
