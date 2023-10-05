export interface SagaExecutionStateData {
  currentlyExecuting: number;
  compensating: boolean;
  endState: boolean;
  failed: boolean;
}
