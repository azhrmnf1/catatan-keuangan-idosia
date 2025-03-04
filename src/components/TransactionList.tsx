
import React from 'react';
import { 
  formatCurrency, 
  formatDate, 
  Transaction 
} from '@/utils/transactionUtils';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ShoppingBagIcon, 
  GiftIcon, 
  UtilityPoleIcon, 
  CarIcon, 
  HeartPulseIcon, 
  BookIcon, 
  CoffeeIcon, 
  BanknoteIcon, 
  TrophyIcon, 
  CoinsIcon 
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

const getCategoryIcon = (category: string, type: string) => {
  if (type === 'INCOME') {
    switch (category) {
      case 'Gaji':
        return <BanknoteIcon className="w-4 h-4" />;
      case 'Bonus':
        return <TrophyIcon className="w-4 h-4" />;
      case 'Hadiah':
        return <GiftIcon className="w-4 h-4" />;
      case 'Investasi':
        return <CoinsIcon className="w-4 h-4" />;
      default:
        return <ArrowUpIcon className="w-4 h-4" />;
    }
  } else {
    switch (category) {
      case 'Makanan':
        return <CoffeeIcon className="w-4 h-4" />;
      case 'Transportasi':
        return <CarIcon className="w-4 h-4" />;
      case 'Belanja':
        return <ShoppingBagIcon className="w-4 h-4" />;
      case 'Tagihan':
        return <UtilityPoleIcon className="w-4 h-4" />;
      case 'Kesehatan':
        return <HeartPulseIcon className="w-4 h-4" />;
      case 'Pendidikan':
        return <BookIcon className="w-4 h-4" />;
      default:
        return <ArrowDownIcon className="w-4 h-4" />;
    }
  }
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, limit }) => {
  const displayTransactions = limit 
    ? transactions.slice(0, limit) 
    : transactions;

  // Sort transactions by date (newest first)
  const sortedTransactions = [...displayTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="w-full animate-fade-up" style={{ animationDelay: "100ms" }}>
      <h2 className="text-xl font-semibold mb-4">Transaksi Terbaru</h2>
      
      <div className="space-y-3">
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-4 glass rounded-xl border card-hover"
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${
                  transaction.type === 'INCOME' 
                    ? 'bg-income/10 text-income' 
                    : 'bg-expense/10 text-expense'
                }`}>
                  {getCategoryIcon(transaction.category, transaction.type)}
                </div>
                
                <div>
                  <h3 className="font-medium">{transaction.description}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{transaction.category}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
              
              <span className={`font-semibold ${
                transaction.type === 'INCOME' 
                  ? 'text-income' 
                  : 'text-expense'
              }`}>
                {transaction.type === 'INCOME' ? '+ ' : '- '}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada transaksi
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
