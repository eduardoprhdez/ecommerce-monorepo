import { CommandWithDestination } from '../commands/command-with-destination';

export interface SagaCommandProducer {
  sendCommands(
    sagaType: string,
    sagaId: string | null,
    commands: CommandWithDestination | undefined,
    sagaReplyChannel: string,
  ): string;
}
