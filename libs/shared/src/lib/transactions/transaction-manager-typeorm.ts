import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Transaction } from './transaction';
import { TransactionManager } from './transaction-manager';
import { TransactionTypeorm } from './transaction-typeorm';

@Injectable()
export class TransactionManagerTypeorm implements TransactionManager {
  constructor(private datasource: DataSource) {}
  createTransaction(): Transaction {
    return new TransactionTypeorm(this.datasource.createQueryRunner());
  }
}
