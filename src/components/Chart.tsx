
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend,
  Tooltip 
} from 'recharts';
import { Transaction } from '@/utils/transactionUtils';

interface ChartProps {
  transactions: Transaction[];
  type: 'INCOME' | 'EXPENSE';
}

const COLORS = {
  INCOME: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#ecfdf5'],
  EXPENSE: ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2', '#fef2f2'],
};

const Chart: React.FC<ChartProps> = ({ transactions, type }) => {
  const filteredTransactions = transactions.filter(
    (transaction) => transaction.type === type
  );

  // Group by category
  const categoryData = filteredTransactions.reduce((acc: any, transaction) => {
    const existingCategory = acc.find((item: any) => item.name === transaction.category);
    
    if (existingCategory) {
      existingCategory.value += transaction.amount;
    } else {
      acc.push({
        name: transaction.category,
        value: transaction.amount,
      });
    }
    
    return acc;
  }, []);

  // Sort by value
  categoryData.sort((a: any, b: any) => b.value - a.value);

  if (categoryData.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        Tidak ada data {type === 'INCOME' ? 'pemasukan' : 'pengeluaran'}
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            animationDuration={750}
            animationBegin={100}
          >
            {categoryData.map((entry: any, index: number) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[type][index % COLORS[type].length]} 
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [
              new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value),
              "",
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
