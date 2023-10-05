import { CommandReplyOutcomeEnum } from '../commands/command-reply-outcomes';
import { CommandWithDestination } from '../commands/command-with-destination';
import { Message } from '../messages/message';
import { ReplyMessageHeaders } from '../messages/message-reply-headers';

export class Step<Data> {
  private action?: (
    params: Data,
  ) => Promise<CommandWithDestination | undefined>;
  private compensation?: (params: Data) => Promise<undefined>;
  private actionDefinedFirst: boolean;
  private isLocalAction?: boolean;
  private actionReplyHandlers: Record<
    string,
    (sagaData: Data, reply: any) => Promise<undefined>
  >;
  private compensationReplyHandlers: Record<
    string,
    (sagaData: Data, reply: any) => Promise<undefined>
  >;

  constructor() {
    this.actionReplyHandlers = {};
    this.compensationReplyHandlers = {};
  }

  setAction(
    method: (params: Data) => Promise<CommandWithDestination | undefined>,
  ): undefined {
    this.action = method;
  }

  setIsLocalAction(isLocalAction: boolean): undefined {
    this.isLocalAction = isLocalAction;
  }

  setCompensation(method: (params: Data) => Promise<undefined>): undefined {
    this.compensation = method;
  }

  setActionDefinedFirst(actionDefinedFirst: boolean): undefined {
    this.actionDefinedFirst = actionDefinedFirst;
  }

  addActionReplyHandler<T>(
    replyClass: string,
    handler: (sagaData: Data, reply: T) => Promise<undefined>,
  ) {
    this.actionReplyHandlers[replyClass] = handler;
  }

  addCompensationReplyHandler<T>(
    replyClass: string,
    handler: (sagaData: Data, reply: T) => Promise<undefined>,
  ) {
    this.compensationReplyHandlers[replyClass] = handler;
  }

  hasAction(): boolean {
    return this.action ? true : false;
  }

  hasCompensation(): boolean {
    return this.compensation ? true : false;
  }

  getAction():
    | ((params: Data) => Promise<CommandWithDestination | undefined>)
    | undefined {
    return this.action;
  }

  getActionDefinedFirst(): boolean {
    return this.actionDefinedFirst;
  }

  getCompensation(): ((params: Data) => Promise<undefined>) | undefined {
    return this.compensation;
  }

  getIsLocalAction(): boolean | undefined {
    return this.isLocalAction;
  }

  getReplyHandler(
    message: Message,
    compensating: boolean,
  ): (sagaData: Data, reply: object) => Promise<undefined> {
    const replyType = message.getRequiredHeader(ReplyMessageHeaders.REPLY_TYPE);

    //TODO: tipar error (maybe error en parser de message) ESTO EN EL ORIGINAL SE USA PORQUE ES UN ARRAY
    // if (!replyType) throw new Error();

    const handler = compensating
      ? this.compensationReplyHandlers[replyType]
      : this.actionReplyHandlers[replyType];

    return handler;
  }

  async applyAction(params: Data): Promise<CommandWithDestination | undefined> {
    if (!this.action) throw new Error();
    return await this.action(params);
  }

  async applyCompensation(params: Data): Promise<undefined> {
    // TODO: tipar error
    if (!this.compensation) throw new Error();

    return await this.compensation(params);
  }

  isSuccessfulReply(message: Message): boolean {
    if (
      message.getRequiredHeader(ReplyMessageHeaders.REPLY_OUTCOME) ===
      CommandReplyOutcomeEnum.SUCCESS
    )
      return true;
    if (
      message.getRequiredHeader(ReplyMessageHeaders.REPLY_OUTCOME) ===
      CommandReplyOutcomeEnum.FALURE
    )
      return false;

    //TODO tipar error
    throw new Error();
  }
}
