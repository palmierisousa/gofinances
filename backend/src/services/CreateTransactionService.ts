import { getCustomRepository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && balance.total - value < 0) {
      throw new AppError("You don't enough money to complete that transaction");
    }

    let categoryObj = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryObj) {
      categoryObj = categoryRepository.create({ title: category });
      await categoryRepository.save(categoryObj);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: categoryObj,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
