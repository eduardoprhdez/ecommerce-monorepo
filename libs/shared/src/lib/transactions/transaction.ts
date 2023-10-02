export interface Transaction {
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  finish(): Promise<void>;
}
