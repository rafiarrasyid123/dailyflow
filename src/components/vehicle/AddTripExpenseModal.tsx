'use client';

import { useState } from 'react';
import { DollarSign, X, AlertCircle, Loader2 } from 'lucide-react';
import { createTripExpense } from '@/actions/vehicle';

interface AddTripExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EXPENSE_CATEGORIES = ['Parkir', 'Tol', 'Cuci Kendaraan', 'Tambal Ban / Tambah Angin', 'Aksesoris / Helm', 'Lainnya'];

export default function AddTripExpenseModal({
  isOpen,
  onClose,
  onSuccess,
}: AddTripExpenseModalProps) {
  const [category, setCategory] = useState<string>('Parkir');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setErrorMsg('Mohon isi nominal biaya dengan benar.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await createTripExpense({
      date,
      category,
      amount: Number(amount),
      notes,
    });

    setLoading(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || 'Gagal menyimpan biaya perjalanan');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border-[3px] border-black rounded-2xl shadow-neo-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-[#bbf7d0]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border-2 border-black shadow-neo-sm text-black">
              <DollarSign className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-black text-black text-base uppercase tracking-tight">Catat Biaya Jalan</h3>
              <p className="text-xs font-semibold text-slate-800">Parkir, tol, cuci, atau ban</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="neo-btn p-1.5 rounded-lg bg-white text-black hover:bg-slate-100"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 text-xs font-bold text-black bg-[#fecdd3] border-2 border-black rounded-xl shadow-neo-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-semibold shadow-neo-sm focus:outline-none focus:bg-white"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-semibold shadow-neo-sm focus:outline-none focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Nominal Biaya (Rp)
            </label>
            <input
              type="number"
              step="500"
              placeholder="cth: 3000 atau 15000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-mono font-bold shadow-neo-sm focus:outline-none focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Catatan / Lokasi (Opsional)
            </label>
            <input
              type="text"
              placeholder="cth: Parkir Stasiun / Mall"
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
              className="neo-btn flex items-center gap-2 px-5 py-2 text-xs font-black uppercase text-black bg-[#bbf7d0] hover:bg-[#86efac] rounded-xl disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Simpan Biaya
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
