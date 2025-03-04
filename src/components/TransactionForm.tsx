
import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, XIcon } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { TransactionType, categories, generateId } from '@/utils/transactionUtils';
import { useToast } from '@/hooks/use-toast';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: any) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const amountInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && amountInputRef.current) {
      setTimeout(() => {
        amountInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setType('EXPENSE');
      setAmount('');
      setDescription('');
      setCategory('');
      setDate(new Date());
    }
  }, [isOpen]);

  // Set default category when type changes
  useEffect(() => {
    if (type === 'INCOME') {
      setCategory(categories.INCOME[0]);
    } else {
      setCategory(categories.EXPENSE[0]);
    }
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      toast({
        title: "Input tidak lengkap",
        description: "Mohon isi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    const parsedAmount = parseInt(amount.replace(/\D/g, ''), 10);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Jumlah tidak valid",
        description: "Mohon masukkan jumlah yang valid",
        variant: "destructive",
      });
      return;
    }

    const newTransaction = {
      id: generateId(),
      amount: parsedAmount,
      description,
      category,
      date,
      type,
    };

    onSave(newTransaction);
    toast({
      title: `${type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'} berhasil ditambahkan`,
      description: `${description}: ${new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(parsedAmount)}`,
    });
    onClose();
  };

  const formatAmountInput = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format with thousand separators
    if (digits) {
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseInt(digits, 10));
      
      setAmount(formatted);
    } else {
      setAmount('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Tambah Transaksi
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={type === 'INCOME' ? "default" : "outline"}
              className={`rounded-xl py-6 ${type === 'INCOME' ? 'bg-income hover:bg-income/90' : ''}`}
              onClick={() => setType('INCOME')}
            >
              Pemasukan
            </Button>
            <Button
              type="button"
              variant={type === 'EXPENSE' ? "default" : "outline"}
              className={`rounded-xl py-6 ${type === 'EXPENSE' ? 'bg-expense hover:bg-expense/90' : ''}`}
              onClick={() => setType('EXPENSE')}
            >
              Pengeluaran
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah</Label>
            <Input
              id="amount"
              ref={amountInputRef}
              value={amount}
              onChange={(e) => formatAmountInput(e.target.value)}
              placeholder="Rp 0"
              className="text-xl font-medium input-focus py-6 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Makan Siang"
              className="input-focus rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="input-focus rounded-xl">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {type === 'INCOME' 
                  ? categories.INCOME.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))
                  : categories.EXPENSE.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))
                }
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal input-focus rounded-xl"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "dd MMMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
              className="rounded-xl"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              className={`rounded-xl ${type === 'INCOME' ? 'bg-income hover:bg-income/90' : 'bg-expense hover:bg-expense/90'}`}
            >
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
