
import { format } from 'date-fns';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: TransactionType;
}

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return format(date, 'dd MMMM yyyy');
};

export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((transaction) => transaction.type === 'INCOME')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateTotalExpense = (transactions: Transaction[]): number => {
  return transactions
    .filter((transaction) => transaction.type === 'EXPENSE')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateBalance = (transactions: Transaction[]): number => {
  return calculateTotalIncome(transactions) - calculateTotalExpense(transactions);
};

export const categories = {
  INCOME: [
    'Gaji',
    'Bonus',
    'Hadiah',
    'Investasi',
    'Penjualan',
    'Lainnya',
  ],
  EXPENSE: [
    'Makanan',
    'Transportasi',
    'Hiburan',
    'Belanja',
    'Tagihan',
    'Kesehatan',
    'Pendidikan',
    'Lainnya',
  ],
};

export const getDefaultTransactions = (): Transaction[] => {
  return []; // Return empty array instead of dummy data
};

