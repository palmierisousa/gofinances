import fs from 'fs';
import csvParser from 'csv-parse';
import path from 'path';
import { getCustomRepository, getRepository, In } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    const fullPath = path.resolve(__dirname, '..', '..', 'tmp', filename);

    const readStream = fs.createReadStream(fullPath);

    const parsers = csvParser({
      from_line: 2,
    });

    const parsedCSV = readStream.pipe(parsers);

    const csvTransactions: CSVTransaction[] = [];
    const csvCategories: string[] = [];

    parsedCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      csvCategories.push(category);

      csvTransactions.push({ title, type, value: Number(value), category });
    });

    await new Promise(resolve => parsedCSV.on('end', resolve));

    const existentCategories = await categoriesRepository.find({
      title: In(csvCategories),
    });

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitles = csvCategories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({ title })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = transactionRepository.create(
      csvTransactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: Number(transaction.value),
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionRepository.save(createdTransactions);

    await fs.promises.unlink(fullPath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
