import { Consumer } from 'kafkajs';
import { Logger } from '@nestjs/common';
import { MessageImpl } from './message-impl';
import { MessageConsumer } from '../../definitions/messages/message-consumer';
import { MessageHandler } from '../../definitions/messages/message-handler';

export class MessageConsumerImpl implements MessageConsumer {
  kafkaConsumer: Consumer;
  logger: Logger;

  constructor(kafkaConsumer: Consumer, logger: Logger) {
    this.kafkaConsumer = kafkaConsumer;
    this.logger = logger;
  }

  async subscribe(
    subscriberId: string,
    channel: string,
    handler: MessageHandler,
  ): Promise<void> {
    await this.kafkaConsumer.subscribe({
      topic: channel,
    });

    await this.kafkaConsumer.run({
      eachMessage: async ({ topic, message }) => {
        this.logger.log(`Message recieved in topic <${topic}> : `, {
          key: message.key?.toString(),
          value: message.value?.toString(),
          headers: message.headers,
        });

        // TODO: MEANINGFUL ERROR
        if (!message.value) throw new Error();

        const parsedMessage = JSON.parse(message.value.toString());
        const payload = parsedMessage.payload;
        const headers = parsedMessage.headers;

        const messageInstance = new MessageImpl(topic, payload, headers);

        this.logger.log(parsedMessage, payload, headers, messageInstance);

        handler(messageInstance);
      },
    });
  }

  getId(): string {
    throw new Error('Method not implemented.');
  }
}
