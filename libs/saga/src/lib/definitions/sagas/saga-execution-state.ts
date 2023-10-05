import { SagaExecutionStateData } from './saga-execution-state-data';

export class SagaExecutionState {
  private sagaExecutionStateData: SagaExecutionStateData;
  static startingState(): SagaExecutionState {
    return new SagaExecutionState(-1, false);
  }

  constructor(
    currentlyExecuting?: number,
    compensating?: boolean,
    endState = false,
    failed = false,
  ) {
    this.sagaExecutionStateData = {
      currentlyExecuting: currentlyExecuting ?? 0,
      compensating: compensating ?? false,
      endState,
      failed,
    };
  }

  toString(): string {
    return JSON.stringify(this);
  }

  getCurrentlyExecuting(): number {
    return this.sagaExecutionStateData.currentlyExecuting;
  }

  setCurrentlyExecuting(currentlyExecuting: number): void {
    this.sagaExecutionStateData.currentlyExecuting = currentlyExecuting;
  }

  isCompensating(): boolean {
    return this.sagaExecutionStateData.compensating;
  }

  setCompensating(compensating: boolean): void {
    this.sagaExecutionStateData.compensating = compensating;
  }

  startCompensating(): SagaExecutionState {
    return new SagaExecutionState(
      this.sagaExecutionStateData.currentlyExecuting,
      true,
    );
  }

  nextState(size: number): SagaExecutionState {
    return new SagaExecutionState(
      this.sagaExecutionStateData.compensating
        ? this.sagaExecutionStateData.currentlyExecuting - size
        : this.sagaExecutionStateData.currentlyExecuting + size,
      this.sagaExecutionStateData.compensating,
    );
  }

  isEndState(): boolean {
    return this.sagaExecutionStateData.endState;
  }

  setEndState(endState: boolean): void {
    this.sagaExecutionStateData.endState = endState;
  }

  setFailed(failed: boolean): void {
    this.sagaExecutionStateData.failed = failed;
  }

  isFailed(): boolean {
    return this.sagaExecutionStateData.failed;
  }

  static makeEndState(): SagaExecutionState {
    const x = new SagaExecutionState();
    x.setEndState(true);
    return x;
  }

  static makeFailedEndState(): SagaExecutionState {
    const x = new SagaExecutionState();
    x.setEndState(true);
    x.setFailed(true);
    return x;
  }
}
