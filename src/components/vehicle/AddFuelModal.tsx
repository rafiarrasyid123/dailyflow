'use client';

import { useState } from 'react';
import { Fuel, X, AlertCircle, Loader2 } from 'lucide-react';
import { createFuelLog, updateFuelLog } from '@/actions/vehicle';

interface AddFuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editItem?: {
    id: string;
    date: Date | string;
    odometer: number;
    liters: number;
    priceTotal: number;
    fuelType?: string | null;
    notes?: string | null;
  } | null;
  latestOdo?: number;
}

export default function AddFuelModal({
  isOpen,
  onClose,
  onSuccess,
  editItem,
  latestOdo = 0,
}: AddFuelModalProps) {
  const [odometer, setOdometer] = useState<string>(
    editItem ? String(editItem.odometer) : latestOdo > 0 ? String(latestOdo) : ''
  );
  const [liters, setLiters] = useState<string>(
    editItem ? String(editItem.liters) : ''
  );
  const [priceTotal, setPriceTotal] = useState<string>(
    editItem ? String(editItem.priceTotal) : ''
  );
  const [fuelType, setFuelType] = useState<string>(
    editItem?.fuelType || 'Pertalite'
  );
  const [date, setDate] = useState<string>(
    editItem
      ? new Date(editItem.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState<string>(editItem?.notes || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const numOdo = parseFloat(odometer) || 0;
  const numLiters = parseFloat(liters) || 0;
  const numPrice = parseFloat(priceTotal) || 0;
  const pricePerLiter = numLiters > 0 && numPrice > 0 ? (numPrice / numLiters).toFixed(0) : null;
  const distance = latestOdo > 0 && numOdo > latestOdo ? numOdo - latestOdo : null;
  const estimatedKmL = distance && numLiters > 0 ? (distance / numLiters).toFixed(1) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!odometer || !liters || !priceTotal) {
      setErrorMsg('Mohon isi Odometer, Liter, dan Total Biaya');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const payload = {
      date,
      odometer: Number(odometer),
      liters: Number(liters),
      priceTotal: Number(priceTotal),
      fuelType,
      notes,
    };

    const res = editItem
      ? await updateFuelLog(editItem.id, payload)
      : await createFuelLog(payload);

    setLoading(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || 'Terjadi kesalahan saat menyimpan data');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border-[3px] border-black rounded-2xl shadow-neo-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-[#fef08a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border-2 border-black shadow-neo-sm text-black">
              <Fuel className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-black text-black text-base uppercase tracking-tight">
                {editItem ? 'Edit Catatan BBM' : 'Catat Pengisian BBM'}
              </h3>
              <p className="text-xs font-semibold text-slate-800">Simpan info bensin & odometer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="neo-btn p-1.5 rounded-lg bg-white text-black hover:bg-slate-100"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Form */}
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
                Tanggal Pengisian
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-semibold shadow-neo-sm focus:outline-none focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">
                Jenis BBM
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-semibold shadow-neo-sm focus:outline-none focus:bg-white"
              >
                <option value="Pertalite">Pertalite</option>
                <option value="Pertamax">Pertamax</option>
                <option value="Pertamax Turbo">Pertamax Turbo</option>
                <option value="Shell Super">Shell Super</option>
                <option value="Shell V-Power">Shell V-Power</option>
                <option value="Solar / Dex">Solar / Dex</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-black uppercase text-black">
                Odometer Saat Ini (KM)
              </label>
              {latestOdo > 0 && !editItem && (
                <span className="text-[11px] font-bold text-slate-600">
                  Terakhir: {latestOdo.toLocaleString('id-ID')} km
                </span>
              )}
            </div>
            <input
              type="number"
              step="any"
              placeholder="Contoh: 15420"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-mono font-bold shadow-neo-sm focus:outline-none focus:bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">
                Volume (Liter)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="cth: 3.5"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-mono font-bold shadow-neo-sm focus:outline-none focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">
                Total Biaya (Rp)
              </label>
              <input
                type="number"
                step="500"
                placeholder="cth: 35000"
                value={priceTotal}
                onChange={(e) => setPriceTotal(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-mono font-bold shadow-neo-sm focus:outline-none focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Real-time Indicator Box */}
          {(pricePerLiter || estimatedKmL) && (
            <div className="p-3 bg-[#bbf7d0] border-2 border-black rounded-xl text-xs space-y-1 font-bold shadow-neo-sm">
              {pricePerLiter && (
                <div className="flex justify-between text-black">
                  <span>Harga per liter:</span>
                  <span className="font-mono">Rp {parseInt(pricePerLiter).toLocaleString('id-ID')} /L</span>
                </div>
              )}
              {estimatedKmL && (
                <div className="flex justify-between text-black">
                  <span>Estimasi konsumsi trip:</span>
                  <span className="font-mono underline">~{estimatedKmL} km/L</span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              placeholder="cth: Isi di SPBU Dago, bensin full tank"
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
              className="neo-btn flex items-center gap-2 px-5 py-2 text-xs font-black uppercase text-black bg-[#fed7aa] hover:bg-[#fdba74] rounded-xl disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {editItem ? 'Simpan Perubahan' : 'Simpan BBM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
