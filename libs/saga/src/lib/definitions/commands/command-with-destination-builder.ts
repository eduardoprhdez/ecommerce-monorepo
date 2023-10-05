import { SagaCommand } from './command';
import { CommandWithDestination } from './command-with-destination';

export class CommandWithDestinationBuilder<Command extends SagaCommand> {
  private command: Command;
  private destinationChannel: string;
  private extraHeaders: Record<string, string>;

  constructor(command: Command) {
    this.command = command;
  }

  static send<Command extends SagaCommand>(
    command: Command,
  ): CommandWithDestinationBuilder<Command> {
    return new CommandWithDestinationBuilder(command);
  }

  to(destinationChannel: string): CommandWithDestinationBuilder<Command> {
    this.destinationChannel = destinationChannel;
    return this;
  }

  withExtraHeaders(
    extraHeaders: Record<string, string>,
  ): CommandWithDestinationBuilder<Command> {
    this.extraHeaders = extraHeaders;
    return this;
  }

  build(): CommandWithDestination {
    return new CommandWithDestination(
      this.destinationChannel,
      this.command,
      this.extraHeaders,
    );
  }
}
