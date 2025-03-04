
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
  return [
    {
      id: generateId(),
      amount: 5000000,
      description: 'Gaji Bulanan',
      category: 'Gaji',
      date: new Date(2023, 9, 1),
      type: 'INCOME',
    },
    {
      id: generateId(),
      amount: 1000000,
      description: 'Bonus Kinerja',
      category: 'Bonus',
      date: new Date(2023, 9, 5),
      type: 'INCOME',
    },
    {
      id: generateId(),
      amount: 500000,
      description: 'Makan di Restoran',
      category: 'Makanan',
      date: new Date(2023, 9, 10),
      type: 'EXPENSE',
    },
    {
      id: generateId(),
      amount: 300000,
      description: 'Bensin',
      category: 'Transportasi',
      date: new Date(2023, 9, 12),
      type: 'EXPENSE',
    },
    {
      id: generateId(),
      amount: 1500000,
      description: 'Bayar Sewa Apartemen',
      category: 'Tagihan',
      date: new Date(2023, 9, 15),
      type: 'EXPENSE',
    },
    {
      id: generateId(),
      amount: 750000,
      description: 'Proyek Freelance',
      category: 'Lainnya',
      date: new Date(2023, 9, 20),
      type: 'INCOME',
    },
  ];
};
