
import React from 'react';
import { 
  formatCurrency, 
  formatDate, 
  Transaction 
} from '@/utils/transactionUtils';
import { ArrowUpIcon, ArrowDownIcon, MoreVerticalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
  onDelete?: (id: string) => void;
  onEdit?: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  limit, 
  onDelete,
  onEdit
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const displayTransactions = limit 
    ? transactions.slice(0, limit) 
    : transactions;
    
  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete && onDelete) {
      onDelete(transactionToDelete);
    }
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  if (displayTransactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Belum ada transaksi</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {displayTransactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="flex items-center justify-between p-3 rounded-xl border glass group relative"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${transaction.type === 'INCOME' ? 'bg-income/10' : 'bg-expense/10'}`}>
                {transaction.type === 'INCOME' ? (
                  <ArrowUpIcon className="w-4 h-4 text-income" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-expense" />
                )}
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{transaction.category}</p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <p className={`font-semibold ${transaction.type === 'INCOME' ? 'text-income' : 'text-expense'}`}>
                {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
              
              {(onDelete || onEdit) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                    >
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(transaction)}>
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem 
                        className="text-red-500"
                        onClick={() => handleDeleteClick(transaction.id)}
                      >
                        Hapus
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {limit && transactions.length > limit && (
        <div className="mt-4 text-center">
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/transactions">Lihat Semua Transaksi</Link>
          </Button>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah anda yakin ingin menghapus transaksi ini? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 rounded-xl"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionList;
