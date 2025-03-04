
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FilterIcon, XIcon } from 'lucide-react';
import { Transaction } from '@/utils/transactionUtils';
import { useToast } from '@/hooks/use-toast';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();
  
  // Load transactions from localStorage
  useEffect(() => {
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
        setTransactions([]);
      }
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);
  
  // Filter transactions when search/filters change
  useEffect(() => {
    let filtered = [...transactions];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        transaction => 
          transaction.description.toLowerCase().includes(query) ||
          transaction.category.toLowerCase().includes(query)
      );
    }
    
    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(
        transaction => transaction.type === typeFilter
      );
    }
    
    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(transaction => 
        transaction.date.getDate() === filterDate.getDate() &&
        transaction.date.getMonth() === filterDate.getMonth() &&
        transaction.date.getFullYear() === filterDate.getFullYear()
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, typeFilter, dateFilter]);
  
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
      const updatedTransactions = [transaction, ...transactions];
      setTransactions(updatedTransactions);
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
  
  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setDateFilter(null);
  };
  
  const hasActiveFilters = searchQuery || typeFilter !== 'all' || dateFilter;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-screen-lg mx-auto px-4 pt-6 pb-20">
        <header className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
          <p className="text-muted-foreground">Lihat semua transaksi anda</p>
        </header>
        
        <div className="space-y-4 animate-fade-up">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-focus rounded-xl"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-auto min-w-[150px] input-focus rounded-xl">
                <SelectValue placeholder="Semua tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua tipe</SelectItem>
                <SelectItem value="INCOME">Pemasukan</SelectItem>
                <SelectItem value="EXPENSE">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={dateFilter ? "default" : "outline"} 
                  className="rounded-xl flex gap-2 input-focus"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {dateFilter ? format(dateFilter, "dd/MM/yyyy") : "Tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateFilter || undefined}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="rounded-xl"
                size="icon"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="mt-4">
            {filteredTransactions.length > 0 ? (
              <TransactionList 
                transactions={filteredTransactions} 
                onDelete={handleDeleteTransaction}
                onEdit={handleEditTransaction}
              />
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                {hasActiveFilters ? (
                  <>
                    <FilterIcon className="w-12 h-12 mx-auto text-muted-foreground/50" />
                    <p className="mt-4">Tidak ada transaksi yang sesuai dengan filter anda</p>
                    <Button 
                      variant="outline" 
                      onClick={clearFilters}
                      className="mt-4 rounded-xl"
                    >
                      Hapus filter
                    </Button>
                  </>
                ) : (
                  <p>Belum ada transaksi</p>
                )}
              </div>
            )}
          </div>
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

export default Transactions;
