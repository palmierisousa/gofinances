import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    let balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const transactions = await this.find();

    balance = transactions.reduce((previousBalance, transaction) => {
      const income =
        transaction.type === 'income'
          ? previousBalance.income + transaction.value
          : previousBalance.income;

      const outcome =
        transaction.type === 'outcome'
          ? previousBalance.outcome + transaction.value
          : previousBalance.outcome;

      return {
        income,
        outcome,
        total: income - outcome,
      };
    }, balance);

    return balance;
  }
}

export default TransactionsRepository;
