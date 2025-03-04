
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, Wallet2Icon } from 'lucide-react';
import { 
  calculateTotalIncome, 
  calculateTotalExpense, 
  calculateBalance, 
  formatCurrency,
  Transaction
} from '@/utils/transactionUtils';

interface DashboardSummaryProps {
  transactions: Transaction[];
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ transactions }) => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpense = calculateTotalExpense(transactions);
  const balance = calculateBalance(transactions);

  return (
    <div className="w-full space-y-4 animate-fade-up">
      <div className="glass rounded-3xl p-6 shadow-sm border">
        <h2 className="text-sm font-medium text-muted-foreground mb-1">Saldo Saat Ini</h2>
        <div className="flex items-end justify-between">
          <h1 className="text-3xl font-bold">{formatCurrency(balance)}</h1>
          <Wallet2Icon className="w-6 h-6 text-primary mb-1" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-5 shadow-sm border card-hover">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-muted-foreground">Total Pemasukan</h2>
            <div className="bg-income/10 p-2 rounded-full">
              <ArrowUpIcon className="w-4 h-4 text-income" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-income">{formatCurrency(totalIncome)}</p>
        </div>

        <div className="glass rounded-3xl p-5 shadow-sm border card-hover">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-muted-foreground">Total Pengeluaran</h2>
            <div className="bg-expense/10 p-2 rounded-full">
              <ArrowDownIcon className="w-4 h-4 text-expense" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-expense">{formatCurrency(totalExpense)}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
