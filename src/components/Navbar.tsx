
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { WalletIcon, BarChart2Icon, HistoryIcon, PlusIcon, HomeIcon, InfoIcon } from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    label: 'Beranda',
    href: '/',
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    label: 'Transaksi',
    href: '/transactions',
    icon: <HistoryIcon className="w-5 h-5" />,
  },
  {
    label: 'Laporan',
    href: '/reports',
    icon: <BarChart2Icon className="w-5 h-5" />,
  },
  {
    label: 'Tentang',
    href: '/about',
    icon: <InfoIcon className="w-5 h-5" />,
  },
];

interface NavbarProps {
  onOpenTransactionForm: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenTransactionForm }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border py-2 px-4 md:px-6 animate-fade-in">
      <div className="max-w-screen-lg mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <WalletIcon className="w-6 h-6 text-primary" />
          <span className="text-lg font-semibold hidden md:inline-block">Catatan Keuangan</span>
        </div>
        
        <div className="flex space-x-1 md:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200",
                "hover:bg-primary/10",
                window.location.pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>

        <button
          onClick={onOpenTransactionForm}
          className="p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-primary/25 hover:bg-primary/90 transition-all"
          aria-label="Tambah Transaksi"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
