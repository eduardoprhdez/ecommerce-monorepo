import { Transaction } from './transaction';

export interface TransactionManager {
  createTransaction(): Transaction;
}
