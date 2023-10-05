import { SagaCommand } from '../commands/command';

export interface Message {
  getHeaders(): Record<string, string>;
  getPayload(): SagaCommand;

  getHeader(name: string): string | undefined;
  getRequiredHeader(name: string): string;

  hasHeader(name: string): boolean;

  setPayload(payload: SagaCommand): void;
  setHeaders(headers: Record<string, string>): void;
  setHeader(name: string, value: string): void;
  removeHeader(key: string): void;
}
