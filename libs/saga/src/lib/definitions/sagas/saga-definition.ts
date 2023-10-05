import { Message } from '../messages/message';
import { SagaActions } from './saga-actions';

export interface SagaDefinition<Data> {
  start(sagaData: Data): Promise<SagaActions<Data>>;

  handleReply(
    sagaType: string,
    sagaId: string | undefined,
    currentState: string | undefined,
    sagaData: Data,
    message: Message,
  ): Promise<SagaActions<Data>>;
}
