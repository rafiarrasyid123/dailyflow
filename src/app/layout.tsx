import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'DailyFlow - Personal Daily Assistant',
  description: 'DailyFlow: Aplikasi pembantu kebutuhan harian: Vehicle Tracker & Catatan Pinjam-Meminjam dengan gaya Pastel Neo-Brutalism.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} font-sans`}>
      <body className="min-h-full flex flex-col bg-[#fbf8f3] text-slate-900 pb-24 md:pb-12 selection:bg-yellow-300 selection:text-black">
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
