
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DashboardSummary from '@/components/DashboardSummary';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import Chart from '@/components/Chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDefaultTransactions, Transaction } from '@/utils/transactionUtils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();
  
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
    if (editTransaction) {
      // Update existing transaction
      const updatedTransactions = transactions.map(t => 
        t.id === transaction.id ? transaction : t
      );
      setTransactions(updatedTransactions);
      setEditTransaction(null);
    } else {
      // Add new transaction
      setTransactions([transaction, ...transactions]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    toast({
      title: "Transaksi dihapus",
      description: "Transaksi berhasil dihapus",
    });
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditTransaction(null);
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
              <TransactionList 
                transactions={transactions} 
                limit={5} 
                onDelete={handleDeleteTransaction}
                onEdit={handleEditTransaction}
              />
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

      <Navbar onOpenTransactionForm={() => {
        setEditTransaction(null);
        setIsFormOpen(true);
      }} />
      
      <TransactionForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        onSave={handleSaveTransaction}
        editTransaction={editTransaction}
      />
    </div>
  );
};

export default Index;
