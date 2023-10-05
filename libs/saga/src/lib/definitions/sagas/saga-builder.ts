import { Step } from './saga-step';
import { SagaDefinition } from './saga-definition';
import { SimpleSagaDefinition } from './simple-saga-definition';
import { CommandWithDestination } from '../commands/command-with-destination';

export class SagaBuilder<Data> {
  private currentStep: Step<Data>;
  private steps: Step<Data>[] = [];
  private currentInvocationFirst: boolean;

  public step() {
    this.currentStep = new Step<Data>();
    this.steps.push(this.currentStep);
    return this;
  }

  public invokeParticipant(
    method: (params: Data) => Promise<CommandWithDestination>,
  ): this {
    if (this.currentStep.getAction() === undefined)
      this.currentStep.setActionDefinedFirst(true);
    this.currentStep.setAction(method);
    this.currentStep.setIsLocalAction(false);
    return this;
  }

  public invokeLocal(method: (params: Data) => Promise<undefined>): this {
    if (this.currentStep.getAction() === undefined)
      this.currentStep.setActionDefinedFirst(true);
    this.currentStep.setAction(method);
    this.currentStep.setIsLocalAction(true);
    return this;
  }

  public withCompensation(method: (params: Data) => Promise<undefined>): this {
    if (this.currentStep.getAction() === undefined)
      this.currentStep.setActionDefinedFirst(false);
    this.currentStep.setCompensation(method);
    return this;
  }

  public onReply<T>(
    replyClass: string,
    method: (data: Data, reply: T) => Promise<undefined>,
  ): this {
    //TODO: error si no está definido?
    if (this.currentStep.getActionDefinedFirst() === true)
      this.currentStep.addActionReplyHandler(replyClass, method);
    else this.currentStep.addCompensationReplyHandler(replyClass, method);

    return this;
  }

  public build(): SagaDefinition<Data> {
    return new SimpleSagaDefinition<Data>(this.steps);
  }
}
