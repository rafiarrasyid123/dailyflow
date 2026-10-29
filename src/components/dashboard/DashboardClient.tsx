'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bike,
  Handshake,
  Fuel,
  Wrench,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  BadgeDollarSign,
  Package,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';
import { formatRupiah, formatDate, formatOdo, getDaysDiff } from '@/lib/format';
import AddFuelModal from '@/components/vehicle/AddFuelModal';
import AddMaintenanceModal from '@/components/vehicle/AddMaintenanceModal';
import AddLendBorrowModal from '@/components/lend-borrow/AddLendBorrowModal';

interface DashboardClientProps {
  summary: {
    vehicle: {
      currentOdometer: number;
      latestEfficiency: number | null;
      latestFuel: any;
      latestMaintenance: any;
      upcomingServiceDue: number | null;
    };
    lendBorrow: {
      totalMoneyLentOut: number;
      totalMoneyBorrowed: number;
      activeItemsLentOut: number;
      activeItemsBorrowed: number;
      totalActiveCount: number;
      activeList: any[];
    };
  };
}

export default function DashboardClient({ summary }: DashboardClientProps) {
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false);
  const [isLendModalOpen, setIsLendModalOpen] = useState(false);

  const hour = new Date().getHours();
  let greeting = 'Halo';
  if (hour >= 4 && hour < 11) greeting = 'Selamat Pagi';
  else if (hour >= 11 && hour < 15) greeting = 'Selamat Siang';
  else if (hour >= 15 && hour < 18) greeting = 'Selamat Sore';
  else greeting = 'Selamat Malam';

  const { vehicle, lendBorrow } = summary;

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner - Pastel Neo-Brutalism */}
      <div className="relative rounded-2xl bg-[#fef08a] border-[3px] border-black p-6 md:p-8 shadow-neo-lg overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border-2 border-black shadow-neo-sm text-xs font-black uppercase text-black mb-3">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
              <span>DailyFlow • Life Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">
              {greeting}! 👋
            </h1>
            <p className="text-sm font-medium text-slate-800 mt-1.5 max-w-xl leading-relaxed">
              Catatan kendaraan dan pinjam-meminjam harian Anda tersimpan rapi, aman, dan siap diakses kapan saja.
            </p>
          </div>

          {/* Quick Action Neo Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsFuelModalOpen(true)}
              className="neo-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fed7aa] text-black font-black text-xs uppercase tracking-wide hover:bg-[#fdba74]"
            >
              <Fuel className="w-4 h-4 stroke-[2.5]" />
              Catat BBM
            </button>
            <button
              onClick={() => setIsMaintModalOpen(true)}
              className="neo-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#bae6fd] text-black font-black text-xs uppercase tracking-wide hover:bg-[#7dd3fc]"
            >
              <Wrench className="w-4 h-4 stroke-[2.5]" />
              Catat Servis
            </button>
            <button
              onClick={() => setIsLendModalOpen(true)}
              className="neo-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e9d5ff] text-black font-black text-xs uppercase tracking-wide hover:bg-[#d8b4fe]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Catat Pinjaman
            </button>
          </div>
        </div>
      </div>

      {/* 2 Big Core Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Modul A: Kendaraan */}
        <div className="bg-white border-[3px] border-black rounded-2xl p-6 shadow-neo-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#bae6fd] border-2 border-black text-black shadow-neo-sm">
                  <Bike className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-black text-lg">Status Kendaraan</h3>
                  <p className="text-xs font-semibold text-slate-600">BBM, Odometer & Servis</p>
                </div>
              </div>
              <Link
                href="/vehicle"
                className="neo-btn text-xs font-black uppercase px-3 py-1.5 rounded-lg bg-[#fef08a] text-black flex items-center gap-1"
              >
                Detail <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-[#f8fafc] border-2 border-black rounded-xl p-3.5 shadow-neo-sm">
                <span className="text-[11px] font-bold text-slate-700 uppercase">Odometer Saat Ini</span>
                <div className="text-xl font-black text-black font-mono mt-1">
                  {formatOdo(vehicle.currentOdometer)}
                </div>
              </div>
              <div className="bg-[#bbf7d0] border-2 border-black rounded-xl p-3.5 shadow-neo-sm">
                <span className="text-[11px] font-bold text-slate-800 uppercase">Efisiensi Terakhir</span>
                <div className="text-xl font-black text-black font-mono mt-1">
                  {vehicle.latestEfficiency ? `${vehicle.latestEfficiency} km/L` : '-'}
                </div>
              </div>
            </div>

            {vehicle.latestMaintenance && (
              <div className="mt-4 p-3 rounded-xl bg-[#fed7aa] border-2 border-black shadow-neo-sm text-xs font-medium">
                <div className="flex justify-between text-black">
                  <span className="font-bold">Servis Terakhir:</span>
                  <span>{vehicle.latestMaintenance.serviceType}</span>
                </div>
                {vehicle.upcomingServiceDue && (
                  <div className="flex justify-between text-black mt-1">
                    <span className="font-bold">Target Servis:</span>
                    <span className="font-mono font-black">
                      {formatOdo(vehicle.upcomingServiceDue)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600">
              {vehicle.latestFuel ? `Pengisian: ${formatDate(vehicle.latestFuel.date)}` : 'Belum ada log BBM'}
            </span>
            <button
              onClick={() => setIsFuelModalOpen(true)}
              className="text-black font-black underline hover:text-amber-600"
            >
              + Catat Bensin
            </button>
          </div>
        </div>

        {/* Card Modul F: Pinjam-Meminjam */}
        <div className="bg-white border-[3px] border-black rounded-2xl p-6 shadow-neo-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#e9d5ff] border-2 border-black text-black shadow-neo-sm">
                  <Handshake className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-black text-lg">Pinjam-Meminjam</h3>
                  <p className="text-xs font-semibold text-slate-600">Uang & Barang Teman</p>
                </div>
              </div>
              <Link
                href="/lend-borrow"
                className="neo-btn text-xs font-black uppercase px-3 py-1.5 rounded-lg bg-[#bbf7d0] text-black flex items-center gap-1"
              >
                Detail <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-[#bbf7d0] border-2 border-black rounded-xl p-3.5 shadow-neo-sm">
                <span className="text-[11px] font-bold text-slate-800 uppercase">Piutang Kita</span>
                <div className="text-xl font-black text-black font-mono mt-1">
                  {formatRupiah(lendBorrow.totalMoneyLentOut)}
                </div>
              </div>
              <div className="bg-[#e9d5ff] border-2 border-black rounded-xl p-3.5 shadow-neo-sm">
                <span className="text-[11px] font-bold text-slate-800 uppercase">Barang di Orang</span>
                <div className="text-xl font-black text-black font-mono mt-1">
                  {lendBorrow.activeItemsLentOut} <span className="text-xs font-bold">item</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#fef08a] border-2 border-black shadow-neo-sm text-xs flex justify-between items-center">
              <span className="font-bold text-black uppercase">Transaksi Berjalan:</span>
              <span className="font-black text-black text-sm px-2 py-0.5 rounded bg-white border border-black">
                {lendBorrow.totalActiveCount} catatan
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600">Barang & uang terpantau aman</span>
            <button
              onClick={() => setIsLendModalOpen(true)}
              className="text-black font-black underline hover:text-indigo-600"
            >
              + Catat Pinjaman
            </button>
          </div>
        </div>
      </div>

      {/* Active Borrow Items Preview Section */}
      <div className="bg-white border-[3px] border-black rounded-2xl p-6 shadow-neo-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#fed7aa] border-2 border-black rounded-lg">
              <Package className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="font-black text-black text-base uppercase tracking-tight">Pinjaman Masih Aktif</h3>
          </div>
          <Link
            href="/lend-borrow"
            className="text-xs font-black underline text-black hover:text-slate-600"
          >
            Lihat Semua →
          </Link>
        </div>

        {lendBorrow.activeList.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-black/40 rounded-xl bg-[#faf5ee] text-xs font-bold text-slate-600">
            Tidak ada barang atau uang yang sedang dipinjam saat ini. Semua beres!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {lendBorrow.activeList.map((item) => {
              const isLent = item.lendType === 'LENT_OUT';
              const isMoney = item.itemType === 'MONEY';
              const due = item.dueDate ? getDaysDiff(item.dueDate) : null;

              return (
                <div
                  key={item.id}
                  className={`border-2 border-black rounded-xl p-4 shadow-neo-sm flex flex-col justify-between ${
                    isLent ? 'bg-[#f0fdf4]' : 'bg-[#fffbeb]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span
                        className={`font-black uppercase px-2 py-0.5 rounded border border-black ${
                          isLent ? 'bg-[#bbf7d0] text-black' : 'bg-[#fed7aa] text-black'
                        }`}
                      >
                        {isLent ? 'Dipinjamkan' : 'Kita Pinjam'}
                      </span>
                      {due && (
                        <span className="font-bold text-black text-[11px]">{due.label}</span>
                      )}
                    </div>

                    <h4 className="font-black text-black text-base">
                      {isMoney ? formatRupiah(item.amount) : item.itemName}
                    </h4>
                    <p className="text-xs font-semibold text-slate-700 mt-1">
                      Pihak: <span className="text-black font-black">{item.personName}</span>
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-black/20 text-[11px] font-semibold flex justify-between items-center">
                    <span className="text-slate-600">Mulai: {formatDate(item.startDate)}</span>
                    <Link href="/lend-borrow" className="font-bold underline text-black hover:text-indigo-600">
                      Kelola →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals for Quick Actions */}
      <AddFuelModal
        isOpen={isFuelModalOpen}
        onClose={() => setIsFuelModalOpen(false)}
        onSuccess={() => window.location.reload()}
        latestOdo={vehicle.currentOdometer}
      />

      <AddMaintenanceModal
        isOpen={isMaintModalOpen}
        onClose={() => setIsMaintModalOpen(false)}
        onSuccess={() => window.location.reload()}
        latestOdo={vehicle.currentOdometer}
      />

      <AddLendBorrowModal
        isOpen={isLendModalOpen}
        onClose={() => setIsLendModalOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
