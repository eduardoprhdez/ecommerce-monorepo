import { Class, TransactionManager } from '@ecommerce-monorepo/shared';
import { Logger } from '@nestjs/common';
import { Message } from '../../definitions/messages/message';
import { CommandProducer } from '../../definitions/commands/command-producer';
import { CommandReplyOutcomeEnum } from '../../definitions/commands/command-reply-outcomes';
import { MessageConsumer } from '../../definitions/messages/message-consumer';
import { ReplyMessageHeaders } from '../../definitions/messages/message-reply-headers';
import { Saga } from '../../definitions/sagas/saga';
import { SagaActions } from '../../definitions/sagas/saga-actions';
import { SagaCommandMessageHeaders } from '../../definitions/sagas/saga-command-headers';
import { SagaDefinition } from '../../definitions/sagas/saga-definition';
import { SagaInstance } from '../../definitions/sagas/saga-instance';
import { SagaInstanceRepository } from '../../definitions/sagas/saga-instance-repository';
import { SagaManager } from '../../definitions/sagas/saga-manager';
import { SagaReplyHeaders } from '../../definitions/sagas/saga-reply-headers';
import { SagaDataSerde } from '../../definitions/sagas/sagadataserde';
import { MessageImpl } from '../messages/message-impl';

export class SagaManagerImpl<Data> implements SagaManager<Data> {
  private dataClass: Class<Data>;
  private saga: Saga<Data>;
  private sagaInstanceRepository: SagaInstanceRepository;
  private transactionManager: TransactionManager;
  private commandProducer: CommandProducer;
  private messageConsumer: MessageConsumer;
  private logger: Logger;

  constructor(
    saga: Saga<Data>,
    sagaInstanceRepository: SagaInstanceRepository,
    commandProducer: CommandProducer,
    messageConsumer: MessageConsumer,
    transactionManager: TransactionManager,
    logger: Logger,
  ) {
    this.saga = saga;
    this.sagaInstanceRepository = sagaInstanceRepository;
    this.commandProducer = commandProducer;
    this.messageConsumer = messageConsumer;
    this.transactionManager = transactionManager;
    this.logger = logger;
  }

  setSagaInstanceRepository(sagaInstanceRepository: SagaInstanceRepository) {
    this.sagaInstanceRepository = sagaInstanceRepository;
  }

  setCommandProducer(commandProducer: CommandProducer) {
    this.commandProducer = commandProducer;
  }

  async create(sagaData: Data): Promise<SagaInstance> {
    const sagaInstance = new SagaInstance(
      this.getSagaType(),
      null,
      '????',
      null,
      SagaDataSerde.serializeSagaData(sagaData),
    );

    await this.sagaInstanceRepository.saveSaga(sagaInstance.toPrimitives());

    const sagaId = sagaInstance.getId();

    const actions = await this.getStateDefinition().start(sagaData);

    await this.processActions(
      this.saga.getSagaType(),
      sagaId,
      sagaInstance,
      sagaData,
      actions,
    );

    return sagaInstance;
  }

  private getStateDefinition(): SagaDefinition<Data> {
    const sm = this.saga.getSagaDefinition();

    if (sm == null) {
      throw new Error('state machine cannot be null');
    }

    return sm;
  }

  private getSagaType(): string {
    return this.saga.getSagaType();
  }

  private getDataClass(): Class<Data> {
    return this.dataClass;
  }

  subscribeToReplyChannel() {
    this.messageConsumer.subscribe(
      this.saga.getSagaType() + '-consumer',
      this.makeSagaReplyChannel(),
      this.handleMessage.bind(this),
    );
  }

  private makeSagaReplyChannel(): string {
    return this.getSagaType() + '-reply';
  }

  handleMessage(message: Message) {
    this.logger.debug(`handle message invoked ${message}`);
    if (message.hasHeader(SagaReplyHeaders.REPLY_SAGA_ID)) {
      this.handleReply(message);
    } else {
      this.logger.warn("Handle message doesn't know what to do with:", message);
    }
  }

  async handleReply(message: Message) {
    if (!this.isReplyForThisSagaType(message)) return;

    this.logger.debug('Handle reply: {}', message);

    const sagaId = message.getRequiredHeader(SagaReplyHeaders.REPLY_SAGA_ID);
    const sagaType = message.getRequiredHeader(
      SagaReplyHeaders.REPLY_SAGA_TYPE,
    );

    const sagaInstance = await this.sagaInstanceRepository.findSaga(
      sagaType,
      sagaId,
    );

    //TODO: TIPAR ERRORES
    if (!sagaInstance) throw new Error();

    const sagaData = SagaDataSerde.deserializeSagaData<Data>(
      sagaInstance.getSerializedSagaData(),
    );

    const currentState = sagaInstance.getStateName();

    this.logger.log(`Current state=${currentState}`);

    const actions = await this.getStateDefinition().handleReply(
      sagaType,
      sagaId,
      currentState,
      sagaData,
      message,
    );

    this.logger.log(`Handled reply. Sending commands ${actions.getCommand()}`);

    await this.processActions(
      sagaType,
      sagaId,
      sagaInstance,
      sagaData,
      actions,
    );
  }

  private async processActions(
    sagaType: string,
    sagaId: string | null,
    sagaInstance: SagaInstance,
    sagaData: Data,
    actions: SagaActions<Data>,
  ): Promise<void> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (actions.getLocalError()) {
        this.logger.error(actions.getLocalError());
        actions = await this.getStateDefinition().handleReply(
          sagaType,
          sagaId ?? undefined,
          actions.getUpdatedState()!,
          actions.getUpdatedSagaData()!,
          new MessageImpl(
            '',
            {},
            {
              [ReplyMessageHeaders.REPLY_OUTCOME]:
                CommandReplyOutcomeEnum.FALURE,
              [ReplyMessageHeaders.REPLY_TYPE]: sagaType,
            },
          ),
        );
      } else {
        const headers: Record<string, string> =
          actions.getCommand()?.getExtraHeaders() ?? {};
        const command = actions.getCommand();

        this.updateState(sagaInstance, actions);

        sagaInstance.setSerializedSagaData(
          SagaDataSerde.serializeSagaData(
            actions.getUpdatedSagaData() ?? sagaData,
          ),
        );

        const transaction = this.transactionManager.createTransaction();
        await transaction.start();

        try {
          if (command) {
            sagaId && (headers[SagaCommandMessageHeaders.SAGA_ID] = sagaId);
            sagaType &&
              (headers[SagaCommandMessageHeaders.SAGA_TYPE] = sagaType);
            const lastRequestId = await this.commandProducer.send(
              this.getSagaType(),
              command,
              this.makeSagaReplyChannel(),
              headers,
              transaction,
            );

            sagaInstance.setLastRequestId(lastRequestId);
          }
          await this.sagaInstanceRepository.updateSaga(
            sagaInstance.toPrimitives(),
            transaction,
          );

          await transaction.commit();
        } catch (error) {
          await transaction.rollback();
        } finally {
          await transaction.finish();
        }

        if (actions.isReplyExpected()) {
          this.logger.log('Breask look');
          break;
        } else {
          actions = await this.simulateSuccessfulReplyToLocalAction(
            sagaType,
            sagaId ?? undefined,
            actions,
          );
        }
      }
    }
  }

  private updateState(
    sagaInstance: SagaInstance,
    actions: SagaActions<Data>,
  ): void {
    const stateName = actions.getUpdatedState();

    if (!stateName) return;

    sagaInstance.setStateName(stateName);
    sagaInstance.setEndState(actions.isEndState());
    sagaInstance.setCompensating(actions.isCompensating());
    sagaInstance.setFailed(actions.isFailed());
  }

  private isReplyForThisSagaType(message: Message): boolean {
    const sagaType = message.getHeader(SagaReplyHeaders.REPLY_SAGA_TYPE);

    return sagaType === this.getSagaType();
  }

  simulateSuccessfulReplyToLocalAction(
    sagaType: string,
    sagaId: string | undefined,
    actions: SagaActions<Data>,
  ): Promise<SagaActions<Data>> {
    return this.getStateDefinition().handleReply(
      sagaType,
      sagaId,
      actions.getUpdatedState(),
      actions.getUpdatedSagaData()!,
      new MessageImpl(
        '',
        {},
        {
          [ReplyMessageHeaders.REPLY_OUTCOME]: CommandReplyOutcomeEnum.SUCCESS,
          [ReplyMessageHeaders.REPLY_TYPE]: CommandReplyOutcomeEnum.SUCCESS,
        },
      ),
    );
  }
}
