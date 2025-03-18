
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GithubIcon, LinkedinIcon, MailIcon, UserIcon } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-screen-lg mx-auto px-4 pt-6 pb-20">
        <header className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Tentang Aplikasi</h1>
          <p className="text-muted-foreground">Informasi pembuat aplikasi</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up">
          <Card className="overflow-hidden rounded-xl">
            <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center">
              <UserIcon className="h-20 w-20 text-primary/60" />
            </div>
            <CardHeader>
              <CardTitle>Developer: Azhari M</CardTitle>
              <CardDescription>Full Stack Developer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Aplikasi Catatan Keuangan adalah aplikasi pengelolaan keuangan personal yang dirancang untuk membantu pengguna mencatat dan menganalisis pemasukan dan pengeluaran mereka dengan mudah.
              </p>
              <p className="text-muted-foreground mb-4">
                Dibangun menggunakan teknologi modern seperti React, TypeScript, dan Tailwind CSS untuk memberikan pengalaman pengguna yang responsif dan intuitif.
              </p>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="outline" size="icon" className="rounded-full">
                <GithubIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <LinkedinIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <MailIcon className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Fitur Aplikasi</CardTitle>
              <CardDescription>Kemampuan utama mencatat Keuangan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Pencatatan Transaksi</h3>
                <p className="text-sm text-muted-foreground">Catat pemasukan dan pengeluaran dengan detail kategori dan tanggal</p>
              </div>
              <div>
                <h3 className="font-medium">Visualisasi Data</h3>
                <p className="text-sm text-muted-foreground">Lihat grafik dan statistik untuk memahami pola keuangan Anda</p>
              </div>
              <div>
                <h3 className="font-medium">Penyimpanan Lokal</h3>
                <p className="text-sm text-muted-foreground">Data disimpan di perangkat untuk privasi yang lebih baik</p>
              </div>
              <div>
                <h3 className="font-medium">Antarmuka Responsif</h3>
                <p className="text-sm text-muted-foreground">Dapat digunakan dengan nyaman di ponsel maupun komputer</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full rounded-xl">
                <Link to="/">Kembali ke Beranda</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Navbar onOpenTransactionForm={() => {}} />
    </div>
  );
};

export default About;
