import { CommandWithDestination } from '../commands/command-with-destination';
import { Message } from '../messages/message';
import { SagaActions } from './saga-actions';
import { SagaDefinition } from './saga-definition';
import { SagaExecutionState } from './saga-execution-state';
import { SagaExecutionStateData } from './saga-execution-state-data';
import { Step } from './saga-step';

export class SimpleSagaDefinition<Data> implements SagaDefinition<Data> {
  constructor(private readonly steps: Step<Data>[]) {}

  async start(sagaData: Data): Promise<SagaActions<Data>> {
    return await this.firstStepToExecute(sagaData);
  }

  private async firstStepToExecute(sagaData: Data): Promise<SagaActions<Data>> {
    return await this.nextStepToExecute(
      SagaExecutionState.startingState(),
      sagaData,
    );
  }

  private async nextStepToExecute(
    state: SagaExecutionState,
    sagaData: Data,
  ): Promise<SagaActions<Data>> {
    const compensating: boolean = state.isCompensating();
    const direction: number = compensating ? -1 : +1;

    let i = state.getCurrentlyExecuting() + direction;

    let step = this.steps[i];

    let conditionMet = false;

    while (i >= 0 && i < this.steps.length && !conditionMet) {
      if (compensating ? step.hasCompensation() : step.hasAction()) {
        conditionMet = true;
      } else {
        i = i + direction;
        step = this.steps[i];
      }
    }

    if (!conditionMet) return await this.makeEndStateSagaActions(state);

    return await this.executeAndMakeSagaActions(
      step,
      compensating,
      sagaData,
      state,
    );
  }

  async executeHandler(
    sagaData: Data,
    step: Step<Data>,
    compensating: boolean,
  ): Promise<CommandWithDestination | undefined> {
    return compensating
      ? await step.applyCompensation(sagaData)
      : await step.applyAction(sagaData);
  }

  async executeAndMakeSagaActions(
    step: Step<Data>,
    compensating: boolean,
    sagaData: Data,
    currentExecutionState: SagaExecutionState,
  ): Promise<SagaActions<Data>> {
    try {
      const newState = currentExecutionState.nextState(1);

      const possibleCommand = await this.executeHandler(
        sagaData,
        step,
        compensating,
      );

      return new SagaActions(
        possibleCommand,
        sagaData,
        JSON.stringify(newState),
        false,
        compensating,
        false,
        step.getIsLocalAction() ?? false,
      );
    } catch (err) {
      // TODO: Revisar el as Error
      if (step.getIsLocalAction())
        return new SagaActions(
          undefined,
          sagaData,
          JSON.stringify(currentExecutionState),
          false,
          compensating,
          true,
          true,
          err as Error,
        );

      throw new Error();
    }
  }

  async handleReply(
    sagaType: string,
    sagaId: string,
    currentState: string,
    sagaData: Data,
    message: Message,
  ): Promise<SagaActions<Data>> {
    const state: SagaExecutionState = decodeState(currentState);
    const currentStep: Step<Data> = this.steps[state.getCurrentlyExecuting()];
    const compensating: boolean = state.isCompensating();

    const replyHandler = currentStep.getReplyHandler(message, compensating);

    if (replyHandler)
      await this.invokeReplyHandler(message, sagaData, replyHandler);

    return await this.sagaActionsForNextStep(
      sagaType,
      sagaId,
      sagaData,
      message,
      state,
      currentStep,
      compensating,
    );
  }

  private async sagaActionsForNextStep(
    sagaType: string,
    sagaId: string,
    sagaData: Data,
    message: Message,
    state: SagaExecutionState,
    currentStep: Step<Data>,
    compensating: boolean,
  ): Promise<SagaActions<Data>> {
    if (currentStep.isSuccessfulReply(message)) {
      return await this.nextStepToExecute(state, sagaData);
      // This only is used if compensation with participant failed
    } else if (compensating) {
      return await this.handleFailedCompensatingTransaction(
        sagaType,
        sagaId,
        state,
        message,
      );
    } else {
      return await this.nextStepToExecute(state.startCompensating(), sagaData);
    }
  }

  async handleFailedCompensatingTransaction(
    sagaType: string,
    sagaId: string,
    state: SagaExecutionState,
    message: Message,
  ): Promise<SagaActions<Data>> {
    const sagaActions = new SagaActions<Data>(
      undefined,
      undefined,
      JSON.stringify(SagaExecutionState.makeFailedEndState()),
      true,
      state.isCompensating(),
      true,
    );

    return await new Promise((resolve) => resolve(sagaActions));
  }

  private async makeEndStateSagaActions(
    state: SagaExecutionState,
  ): Promise<SagaActions<Data>> {
    const sagaActions = new SagaActions<Data>(
      undefined,
      undefined,
      JSON.stringify(SagaExecutionState.makeFailedEndState()),
      true,
      state.isCompensating(),
      false,
    );

    return await new Promise((resolve) => resolve(sagaActions));
  }

  protected async invokeReplyHandler<T>(
    message: Message,
    data: Data,
    handler: (data: Data, reply: T) => Promise<void>,
  ): Promise<void> {
    const reply: T = message.getPayload() as T;

    // eslint-disable-next-line no-async-promise-executor
    return await new Promise<void>(async (resolve, reject) => {
      try {
        await handler(data, reply);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  // private toSagaActions(sap: SagaActionsProvider<Data>): SagaActions<Data> {
  //   return sap.toSagaActions(this.identity(), this.identity());
  // }

  // protected makeSagaActionsProvider(
  //   sagaActions: SagaActions<Data>,
  // ): SagaActionsProvider<Data> {
  //   return new SagaActionsProvider(sagaActions);
  // }

  // protected makeSagaActionsProvider(
  //   stepToExecute: StepToExecute<Data>,
  //   data: Data,
  //   state: SagaExecutionState,
  // ): SagaActionsProvider<Data> {
  //   return new SagaActionsProvider(() =>
  //     stepToExecute.executeStep(data, state),
  //   );
  // }

  // protected makeStepToExecute(
  //   skipped: number,
  //   compensating: boolean,
  //   step: SagaStep<Data>,
  // ): StepToExecute<Data> {
  //   return new StepToExecute(step, skipped, compensating);
  // }
}
function decodeState(currentState: string): SagaExecutionState {
  const stateJson: SagaExecutionStateData =
    JSON.parse(currentState).sagaExecutionStateData;

  return new SagaExecutionState(
    stateJson.currentlyExecuting,
    stateJson.compensating,
    stateJson.endState,
    stateJson.failed,
  );
}
