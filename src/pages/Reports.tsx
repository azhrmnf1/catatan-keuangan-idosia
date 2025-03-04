
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import TransactionForm from '@/components/TransactionForm';
import { 
  calculateTotalIncome, 
  calculateTotalExpense, 
  calculateBalance,
  formatCurrency,
  Transaction 
} from '@/utils/transactionUtils';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import Chart from '@/components/Chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';

const Reports = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [period, setPeriod] = useState('current-month');
  
  // Load transactions from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);
        const fixedTransactions = parsed.map((transaction: any) => ({
          ...transaction,
          date: new Date(transaction.date),
        }));
        setTransactions(fixedTransactions);
      } catch (error) {
        console.error('Error parsing saved transactions', error);
        setTransactions([]);
      }
    }
  }, []);
  
  const handleSaveTransaction = (transaction: Transaction) => {
    const updatedTransactions = [transaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };
  
  // Filter transactions based on selected period
  const getFilteredTransactions = () => {
    const now = new Date();
    
    switch (period) {
      case 'current-month': {
        const start = startOfMonth(now);
        const end = endOfMonth(now);
        return transactions.filter(transaction => 
          isWithinInterval(new Date(transaction.date), { start, end })
        );
      }
      case 'last-month': {
        const lastMonth = subMonths(now, 1);
        const start = startOfMonth(lastMonth);
        const end = endOfMonth(lastMonth);
        return transactions.filter(transaction => 
          isWithinInterval(new Date(transaction.date), { start, end })
        );
      }
      case 'last-3-months': {
        const threeMonthsAgo = subMonths(now, 3);
        return transactions.filter(transaction => 
          new Date(transaction.date) >= threeMonthsAgo
        );
      }
      case 'last-6-months': {
        const sixMonthsAgo = subMonths(now, 6);
        return transactions.filter(transaction => 
          new Date(transaction.date) >= sixMonthsAgo
        );
      }
      default:
        return transactions;
    }
  };
  
  const filteredTransactions = getFilteredTransactions();
  const totalIncome = calculateTotalIncome(filteredTransactions);
  const totalExpense = calculateTotalExpense(filteredTransactions);
  const balance = calculateBalance(filteredTransactions);
  
  // Generate monthly data for bar chart
  const getMonthlyData = () => {
    const now = new Date();
    const months = [];
    
    // Generate last 6 months data
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const monthTransactions = transactions.filter(transaction => 
        isWithinInterval(new Date(transaction.date), { start: monthStart, end: monthEnd })
      );
      
      const income = calculateTotalIncome(monthTransactions);
      const expense = calculateTotalExpense(monthTransactions);
      
      months.push({
        name: format(monthDate, 'MMM', { locale: id }),
        income,
        expense,
      });
    }
    
    return months;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-screen-lg mx-auto px-4 pt-6 pb-20">
        <header className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
          <p className="text-muted-foreground">Analisa keuangan anda</p>
        </header>
        
        <div className="space-y-6 animate-fade-up">
          <div className="flex justify-end">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px] input-focus rounded-xl">
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Bulan Ini</SelectItem>
                <SelectItem value="last-month">Bulan Lalu</SelectItem>
                <SelectItem value="last-3-months">3 Bulan Terakhir</SelectItem>
                <SelectItem value="last-6-months">6 Bulan Terakhir</SelectItem>
                <SelectItem value="all-time">Semua Waktu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass border shadow-sm rounded-xl card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Pemasukan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-income">{formatCurrency(totalIncome)}</p>
              </CardContent>
            </Card>
            
            <Card className="glass border shadow-sm rounded-xl card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Pengeluaran</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-expense">{formatCurrency(totalExpense)}</p>
              </CardContent>
            </Card>
            
            <Card className="glass border shadow-sm rounded-xl card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Saldo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="glass border shadow-sm rounded-xl overflow-hidden card-hover">
            <CardHeader>
              <CardTitle>Grafik Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getMonthlyData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => 
                        new Intl.NumberFormat('id-ID', {
                          notation: 'compact',
                          compactDisplay: 'short',
                        }).format(value)
                      } 
                    />
                    <Tooltip 
                      formatter={(value) => [
                        new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(Number(value)),
                        "",
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Pemasukan" radius={[4, 4, 0, 0]}>
                      {getMonthlyData().map((entry, index) => (
                        <Cell key={`cell-income-${index}`} fill="hsl(var(--income))" />
                      ))}
                    </Bar>
                    <Bar dataKey="expense" name="Pengeluaran" radius={[4, 4, 0, 0]}>
                      {getMonthlyData().map((entry, index) => (
                        <Cell key={`cell-expense-${index}`} fill="hsl(var(--expense))" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="expense" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
              <TabsTrigger value="income">Pemasukan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="expense">
              <Card className="glass border shadow-sm rounded-xl card-hover">
                <CardHeader>
                  <CardTitle>Distribusi Pengeluaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <Chart transactions={filteredTransactions} type="EXPENSE" />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="income">
              <Card className="glass border shadow-sm rounded-xl card-hover">
                <CardHeader>
                  <CardTitle>Distribusi Pemasukan</CardTitle>
                </CardHeader>
                <CardContent>
                  <Chart transactions={filteredTransactions} type="INCOME" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Navbar onOpenTransactionForm={() => setIsFormOpen(true)} />
      
      <TransactionForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveTransaction}
      />
    </div>
  );
};

export default Reports;
