'use client';

import { useState } from 'react';
import { Handshake, X, AlertCircle, Loader2 } from 'lucide-react';
import { createLendBorrow, updateLendBorrow } from '@/actions/lend-borrow';
import { LendType, ItemType } from '@prisma/client';

interface AddLendBorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editItem?: any | null;
}

export default function AddLendBorrowModal({
  isOpen,
  onClose,
  onSuccess,
  editItem,
}: AddLendBorrowModalProps) {
  const [personName, setPersonName] = useState<string>(editItem?.personName || '');
  const [lendType, setLendType] = useState<LendType>(editItem?.lendType || 'LENT_OUT');
  const [itemType, setItemType] = useState<ItemType>(editItem?.itemType || 'ITEM');
  const [itemName, setItemName] = useState<string>(editItem?.itemName || '');
  const [amount, setAmount] = useState<string>(editItem?.amount ? String(editItem.amount) : '');
  const [startDate, setStartDate] = useState<string>(
    editItem?.startDate
      ? new Date(editItem.startDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [dueDate, setDueDate] = useState<string>(
    editItem?.dueDate ? new Date(editItem.dueDate).toISOString().slice(0, 10) : ''
  );
  const [notes, setNotes] = useState<string>(editItem?.notes || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) {
      setErrorMsg('Mohon isi nama orang / teman.');
      return;
    }
    if (itemType === 'ITEM' && !itemName.trim()) {
      setErrorMsg('Mohon sebutkan nama barang yang dipinjam.');
      return;
    }
    if (itemType === 'MONEY' && (!amount || Number(amount) <= 0)) {
      setErrorMsg('Mohon isi nominal uang dengan benar.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const payload = {
      personName,
      lendType,
      itemType,
      itemName: itemType === 'ITEM' ? itemName : undefined,
      amount: itemType === 'MONEY' ? Number(amount) : undefined,
      startDate,
      dueDate: dueDate || undefined,
      notes,
    };

    const res = editItem
      ? await updateLendBorrow(editItem.id, payload)
      : await createLendBorrow(payload);

    setLoading(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || 'Gagal menyimpan catatan');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border-[3px] border-black rounded-2xl shadow-neo-lg overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-[#e9d5ff]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border-2 border-black shadow-neo-sm text-black">
              <Handshake className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-black text-black text-base uppercase tracking-tight">
                {editItem ? 'Edit Pinjaman' : 'Catat Pinjam-Meminjam'}
              </h3>
              <p className="text-xs font-semibold text-slate-800">Barang & uang agar tidak lupa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="neo-btn p-1.5 rounded-lg bg-white text-black hover:bg-slate-100"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 text-xs font-bold text-black bg-[#fecdd3] border-2 border-black rounded-xl shadow-neo-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Type Selector (Dipinjamkan vs Meminjam) */}
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1.5">
              Status Transaksi:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLendType('LENT_OUT')}
                className={`neo-btn py-2 px-3 text-xs font-black uppercase rounded-xl text-center transition ${
                  lendType === 'LENT_OUT'
                    ? 'bg-[#bbf7d0] text-black shadow-neo-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Dipinjamkan
                <span className="block text-[10px] font-semibold text-slate-700 lowercase">
                  (ke orang lain)
                </span>
              </button>
              <button
                type="button"
                onClick={() => setLendType('BORROWED')}
                className={`neo-btn py-2 px-3 text-xs font-black uppercase rounded-xl text-center transition ${
                  lendType === 'BORROWED'
                    ? 'bg-[#fed7aa] text-black shadow-neo-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Kita Meminjam
                <span className="block text-[10px] font-semibold text-slate-700 lowercase">
                  (dari orang lain)
                </span>
              </button>
            </div>
          </div>

          {/* Item Category Switch (Barang vs Uang) */}
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1.5">
              Bentuk yang Dipinjam:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setItemType('ITEM')}
                className={`neo-btn py-1.5 text-xs font-black uppercase rounded-xl transition ${
                  itemType === 'ITEM'
                    ? 'bg-[#bae6fd] text-black shadow-neo-sm'
                    : 'bg-white text-slate-700'
                }`}
              >
                📦 Barang
              </button>
              <button
                type="button"
                onClick={() => setItemType('MONEY')}
                className={`neo-btn py-1.5 text-xs font-black uppercase rounded-xl transition ${
                  itemType === 'MONEY'
                    ? 'bg-[#bbf7d0] text-black shadow-neo-sm'
                    : 'bg-white text-slate-700'
                }`}
              >
                💵 Uang Tunai
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              {lendType === 'LENT_OUT' ? 'Nama Peminjam (Teman)' : 'Dipinjam Dari Siapa'}
            </label>
            <input
              type="text"
              placeholder="cth: Budi, Andre, atau Rian"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-semibold shadow-neo-sm focus:outline-none focus:bg-white"
              required
            />
          </div>

          {itemType === 'ITEM' ? (
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">
                Nama Barang
              </label>
              <input
                type="text"
                placeholder="cth: Helm Bogo, Charger iPhone, Obeng Set"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-semibold shadow-neo-sm focus:outline-none focus:bg-white"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">
                Nominal Uang (Rp)
              </label>
              <input
                type="number"
                step="1000"
                placeholder="cth: 100000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-mono font-bold shadow-neo-sm focus:outline-none focus:bg-white"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">
                Tanggal Pinjam
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-semibold shadow-neo-sm focus:outline-none focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">
                Janji Kembali
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-semibold shadow-neo-sm focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Catatan / Kondisi Barang (Opsional)
            </label>
            <input
              type="text"
              placeholder="cth: Dipinjam buat mudik, kondisi mulus"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-medium shadow-neo-sm focus:outline-none focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t-2 border-black/10">
            <button
              type="button"
              onClick={onClose}
              className="neo-btn px-4 py-2 text-xs font-black uppercase text-black bg-white rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="neo-btn flex items-center gap-2 px-5 py-2 text-xs font-black uppercase text-black bg-[#e9d5ff] hover:bg-[#d8b4fe] rounded-xl disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {editItem ? 'Simpan Perubahan' : 'Catat Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
