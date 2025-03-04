
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DashboardSummary from '@/components/DashboardSummary';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import Chart from '@/components/Chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDefaultTransactions, Transaction } from '@/utils/transactionUtils';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  useEffect(() => {
    // Load transactions from localStorage or use default
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);
        // Convert date strings back to Date objects
        const fixedTransactions = parsed.map((transaction: any) => ({
          ...transaction,
          date: new Date(transaction.date),
        }));
        setTransactions(fixedTransactions);
      } catch (error) {
        console.error('Error parsing saved transactions', error);
        setTransactions(getDefaultTransactions());
      }
    } else {
      setTransactions(getDefaultTransactions());
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleSaveTransaction = (transaction: Transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-screen-lg mx-auto px-4 pt-6 pb-20">
        <header className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Catatan Keuangan</h1>
          <p className="text-muted-foreground">Kelola keuangan anda dengan mudah</p>
        </header>

        <DashboardSummary transactions={transactions} />
        
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <Tabs defaultValue="transactions">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="transactions">Transaksi</TabsTrigger>
              <TabsTrigger value="statistics">Statistik</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions" className="space-y-4">
              <TransactionList transactions={transactions} limit={5} />
            </TabsContent>
            
            <TabsContent value="statistics" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Kategori Pemasukan</h3>
                <Chart transactions={transactions} type="INCOME" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Kategori Pengeluaran</h3>
                <Chart transactions={transactions} type="EXPENSE" />
              </div>
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

export default Index;
