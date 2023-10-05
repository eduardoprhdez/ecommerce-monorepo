import { SagaCommand } from './command';

export class CommandWithDestination {
  private destinationChannel: string;
  private command: SagaCommand;
  private extraHeaders: Record<string, string>;

  constructor(
    destinationChannel: string,
    command: SagaCommand,
    extraHeaders: Record<string, string>,
  ) {
    this.destinationChannel = destinationChannel;
    this.command = command;
    this.extraHeaders = extraHeaders;
  }

  getDestinationChannel(): string {
    return this.destinationChannel;
  }

  getCommand(): SagaCommand {
    return this.command;
  }

  getExtraHeaders(): Record<string, string> {
    return this.extraHeaders;
  }
}
