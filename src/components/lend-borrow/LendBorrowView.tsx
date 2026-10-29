'use client';

import { useState } from 'react';
import {
  Handshake,
  Plus,
  Package,
  BadgeDollarSign,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Calendar,
  User,
  RotateCcw,
} from 'lucide-react';
import { formatRupiah, formatDate, getDaysDiff } from '@/lib/format';
import { toggleReturnStatus, deleteLendBorrow } from '@/actions/lend-borrow';
import AddLendBorrowModal from './AddLendBorrowModal';

interface LendBorrowViewProps {
  initialRecords: any[];
}

export default function LendBorrowView({ initialRecords }: LendBorrowViewProps) {
  const [records, setRecords] = useState(initialRecords);
  const [filterTab, setFilterTab] = useState<'ALL_ACTIVE' | 'ITEMS' | 'MONEY' | 'RETURNED'>('ALL_ACTIVE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const activeRecords = records.filter((r) => r.status === 'ACTIVE');
  const returnedRecords = records.filter((r) => r.status === 'RETURNED');

  const totalPiutang = activeRecords
    .filter((r) => r.itemType === 'MONEY' && r.lendType === 'LENT_OUT')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const totalUtang = activeRecords
    .filter((r) => r.itemType === 'MONEY' && r.lendType === 'BORROWED')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const totalBarangLent = activeRecords.filter(
    (r) => r.itemType === 'ITEM' && r.lendType === 'LENT_OUT'
  ).length;

  const totalBarangBorrowed = activeRecords.filter(
    (r) => r.itemType === 'ITEM' && r.lendType === 'BORROWED'
  ).length;

  const displayList = records.filter((r) => {
    if (filterTab === 'RETURNED') return r.status === 'RETURNED';
    if (r.status !== 'ACTIVE') return false;
    if (filterTab === 'ITEMS') return r.itemType === 'ITEM';
    if (filterTab === 'MONEY') return r.itemType === 'MONEY';
    return true;
  });

  const handleToggleStatus = async (item: any) => {
    setLoadingId(item.id);
    const res = await toggleReturnStatus(item.id, item.status);
    if (res.success && res.data) {
      setRecords((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, ...res.data } : r))
      );
    }
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus catatan pinjaman ini?')) return;
    setLoadingId(id);
    const res = await deleteLendBorrow(id);
    if (res.success) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards - Pastel Neo-Brutalism */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#bbf7d0] border-[3px] border-black rounded-2xl p-4 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between text-black mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Piutang Kita</span>
            <BadgeDollarSign className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-black font-mono">
              {formatRupiah(totalPiutang)}
            </div>
            <p className="text-[11px] font-semibold text-slate-700 mt-1">Uang belum dibayar teman</p>
          </div>
        </div>

        <div className="bg-[#fecdd3] border-[3px] border-black rounded-2xl p-4 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between text-black mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Utang Kita</span>
            <BadgeDollarSign className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-black font-mono">
              {formatRupiah(totalUtang)}
            </div>
            <p className="text-[11px] font-semibold text-slate-700 mt-1">Harus kita bayar ke teman</p>
          </div>
        </div>

        <div className="bg-[#e9d5ff] border-[3px] border-black rounded-2xl p-4 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between text-black mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Barang di Orang</span>
            <Package className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-black font-mono">
              {totalBarangLent} <span className="text-xs font-bold">item</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-700 mt-1">Barang kita yang dipinjam</p>
          </div>
        </div>

        <div className="bg-[#fed7aa] border-[3px] border-black rounded-2xl p-4 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between text-black mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Barang Orang</span>
            <Package className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-black font-mono">
              {totalBarangBorrowed} <span className="text-xs font-bold">item</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-700 mt-1">Kita pinjam dari orang</p>
          </div>
        </div>
      </div>

      {/* Tabs & Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b-2 border-black/10 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <button
            onClick={() => setFilterTab('ALL_ACTIVE')}
            className={`neo-btn px-4 py-2 rounded-xl text-xs font-black uppercase whitespace-nowrap transition ${
              filterTab === 'ALL_ACTIVE'
                ? 'bg-[#e9d5ff] text-black shadow-neo'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Aktif Semua ({activeRecords.length})
          </button>
          <button
            onClick={() => setFilterTab('ITEMS')}
            className={`neo-btn px-4 py-2 rounded-xl text-xs font-black uppercase whitespace-nowrap transition ${
              filterTab === 'ITEMS'
                ? 'bg-[#bae6fd] text-black shadow-neo'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            📦 Barang ({totalBarangLent + totalBarangBorrowed})
          </button>
          <button
            onClick={() => setFilterTab('MONEY')}
            className={`neo-btn px-4 py-2 rounded-xl text-xs font-black uppercase whitespace-nowrap transition ${
              filterTab === 'MONEY'
                ? 'bg-[#bbf7d0] text-black shadow-neo'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            💵 Uang
          </button>
          <button
            onClick={() => setFilterTab('RETURNED')}
            className={`neo-btn px-4 py-2 rounded-xl text-xs font-black uppercase whitespace-nowrap transition ${
              filterTab === 'RETURNED'
                ? 'bg-[#fed7aa] text-black shadow-neo'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Selesai ({returnedRecords.length})
          </button>
        </div>

        <button
          onClick={() => {
            setEditItem(null);
            setIsModalOpen(true);
          }}
          className="neo-btn flex items-center justify-center gap-2 px-4 py-2 text-xs font-black uppercase text-black bg-[#e9d5ff] rounded-xl hover:bg-[#d8b4fe]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Catat Pinjaman Baru
        </button>
      </div>

      {/* List of Cards */}
      {displayList.length === 0 ? (
        <div className="text-center py-12 px-4 border-2 border-dashed border-black/40 rounded-2xl bg-white shadow-neo">
          <Handshake className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h4 className="text-sm font-black uppercase text-black">
            {filterTab === 'RETURNED'
              ? 'Belum ada riwayat transaksi yang selesai'
              : 'Tidak ada pinjaman yang aktif'}
          </h4>
          <p className="text-xs font-medium text-slate-600 mt-1 max-w-sm mx-auto">
            Semua barang dan utang-piutang terpantau rapi. Catat barang atau uang baru sekarang.
          </p>
          {filterTab !== 'RETURNED' && (
            <button
              onClick={() => {
                setEditItem(null);
                setIsModalOpen(true);
              }}
              className="neo-btn mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase text-black bg-[#e9d5ff] rounded-xl"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Catat Pinjaman
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayList.map((item) => {
            const isLentOut = item.lendType === 'LENT_OUT';
            const isMoney = item.itemType === 'MONEY';
            const isReturned = item.status === 'RETURNED';
            const dueInfo = item.dueDate && !isReturned ? getDaysDiff(item.dueDate) : null;

            return (
              <div
                key={item.id}
                className={`border-2 border-black rounded-2xl p-5 shadow-neo transition ${
                  isReturned
                    ? 'bg-slate-100 opacity-80'
                    : isLentOut
                    ? 'bg-white'
                    : 'bg-[#fdfaf5]'
                }`}
              >
                {/* Header row: Status badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_0px_#000] ${
                        isLentOut ? 'bg-[#bbf7d0] text-black' : 'bg-[#fed7aa] text-black'
                      }`}
                    >
                      {isLentOut ? 'Dipinjamkan ke Orang' : 'Kita Meminjam'}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#e9d5ff] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                      {isMoney ? '💵 Uang' : '📦 Barang'}
                    </span>
                  </div>

                  {dueInfo && (
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_0px_#000] ${
                        dueInfo.isOverdue
                          ? 'bg-[#fecdd3] text-black'
                          : 'bg-[#fef08a] text-black'
                      }`}
                    >
                      {dueInfo.label}
                    </span>
                  )}

                  {isReturned && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#bbf7d0] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                      ✓ Selesai
                    </span>
                  )}
                </div>

                {/* Main Content */}
                <div className="mt-3.5">
                  <h3 className="font-black text-black text-lg tracking-tight">
                    {isMoney ? formatRupiah(item.amount) : item.itemName}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mt-1">
                    <User className="w-3.5 h-3.5" />
                    <span>
                      {isLentOut ? 'Peminjam:' : 'Pemilik:'}{' '}
                      <strong className="text-black font-black">{item.personName}</strong>
                    </span>
                  </div>
                </div>

                {/* Dates Info */}
                <div className="mt-3 pt-2.5 border-t-2 border-black/10 flex items-center justify-between text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Dipinjam: {formatDate(item.startDate)}</span>
                  </div>
                  {item.dueDate && (
                    <div className="flex items-center gap-1 font-bold text-black">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Tenggat: {formatDate(item.dueDate)}</span>
                    </div>
                  )}
                </div>

                {item.notes && (
                  <p className="mt-2 text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-lg border border-black/20">
                    "{item.notes}"
                  </p>
                )}

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t-2 border-black/10 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleStatus(item)}
                    disabled={loadingId === item.id}
                    className={`neo-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase transition ${
                      isReturned
                        ? 'bg-white text-black'
                        : 'bg-[#bbf7d0] text-black hover:bg-[#86efac]'
                    }`}
                  >
                    {isReturned ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                        Batal Selesai
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        {isMoney ? 'Tandai Lunas' : 'Tandai Kembali'}
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditItem(item);
                        setIsModalOpen(true);
                      }}
                      className="neo-btn px-2.5 py-1 text-xs font-black uppercase bg-[#fef08a] text-black rounded-lg flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={loadingId === item.id}
                      className="neo-btn px-2.5 py-1 text-xs font-black uppercase bg-[#fecdd3] text-black rounded-lg flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddLendBorrowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => window.location.reload()}
        editItem={editItem}
      />
    </div>
  );
}
