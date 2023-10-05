import { SagaCommand } from '../../definitions/commands/command';
import { Saga } from '../../definitions/sagas/saga';
import { Message } from '../../definitions/messages/message';

export class MessageImpl implements Message {
  private channel: string;
  private payload: SagaCommand;
  private headers: Record<string, string>;

  constructor(
    channel: string,
    payload: SagaCommand,
    headers: Record<string, string>,
  ) {
    this.channel = channel;
    this.payload = payload;
    this.headers = headers;
  }

  toString(): string {
    // Implementa la lógica para convertir el objeto a una cadena de texto en TypeScript.
    return 'Implementación de toString en TypeScript';
  }

  getPayload(): SagaCommand {
    return this.payload;
  }

  getChannel(): string {
    return this.channel;
  }

  getHeader(name: string): string | undefined {
    return this.headers[name];
  }

  getRequiredHeader(name: string): string {
    const value = this.getHeader(name);
    if (value === undefined) {
      throw new Error(`No such header: ${name} in this message`);
    }
    return value;
  }

  hasHeader(name: string): boolean {
    return this.headers[name] ? true : false;
  }

  getHeaders(): Record<string, string> {
    return this.headers;
  }

  setPayload(payload: SagaCommand): void {
    this.payload = payload;
  }

  setChannel(channel: string): void {
    this.channel = channel;
  }

  setHeaders(headers: Record<string, string>): void {
    this.headers = headers;
  }

  setHeader(name: string, value: string): void {
    if (!this.headers) {
      this.headers = {};
    }
    this.headers[name] = value;
  }

  removeHeader(key: string): void {
    delete this.headers[key];
  }
}
