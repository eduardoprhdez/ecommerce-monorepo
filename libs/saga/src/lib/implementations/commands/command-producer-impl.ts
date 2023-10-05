import { TransactionTypeorm } from '@ecommerce-monorepo/shared';
import { CommandProducer } from '../../definitions/commands/command-producer';
import { MessageRepository } from '../../definitions/messages/message-repository';
import { v4 as uuid } from 'uuid';
import { CommandMessageHeaders } from '../../definitions/commands/command-message-headers';
import { CommandWithDestination } from '../../definitions/commands/command-with-destination';

export class CommandProducerImpl implements CommandProducer {
  private messageRepository: MessageRepository;

  constructor(messageRepository: MessageRepository) {
    this.messageRepository = messageRepository;
  }
  async send(
    channel: string,
    command: CommandWithDestination,
    replyTo: string,
    headers: Record<string, string>,
    transaction?: TransactionTypeorm,
  ): Promise<string> {
    const messageId = uuid();
    await this.messageRepository.saveMessage(
      {
        id: messageId,
        channel: command.getDestinationChannel(),
        payload: command.getCommand(),
        headers: {
          ...headers,
          [CommandMessageHeaders.REPLY_TO]: replyTo,
          [CommandMessageHeaders.DESTINATION]: channel,
        },
      },
      transaction,
    );

    return messageId;
  }
}
