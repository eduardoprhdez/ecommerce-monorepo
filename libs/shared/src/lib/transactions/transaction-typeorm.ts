import { DeepPartial, EntityTarget, QueryRunner } from 'typeorm';
import { Transaction } from './transaction';

export class TransactionTypeorm implements Transaction {
  queryRunner: QueryRunner;
  constructor(queryRunner: QueryRunner) {
    this.queryRunner = queryRunner;
  }

  async start(): Promise<void> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commit(): Promise<void> {
    await this.queryRunner.commitTransaction();
  }

  async rollback(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
  }

  async finish(): Promise<void> {
    await this.queryRunner.release();
  }

  async save<T>(
    entityTarget: EntityTarget<DeepPartial<T>>,
    entity: DeepPartial<T>,
  ): Promise<void>;
  async save<T>(entityTarget: EntityTarget<T>, entity: T): Promise<void> {
    await this.queryRunner.manager.save(entityTarget, entity);
  }
}
