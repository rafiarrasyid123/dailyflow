'use client';

import { useState } from 'react';
import { Wrench, X, AlertCircle, Loader2 } from 'lucide-react';
import { createMaintenanceLog } from '@/actions/vehicle';

interface AddMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  latestOdo?: number;
}

const SERVICE_PRESETS = [
  { name: 'Ganti Oli Mesin', odoPlus: 2000 },
  { name: 'Ganti Oli Gardan', odoPlus: 6000 },
  { name: 'Servis CVT / Rantai', odoPlus: 8000 },
  { name: 'Ganti Kampas Rem', odoPlus: 10000 },
  { name: 'Ganti Ban Luar', odoPlus: 15000 },
  { name: 'Ganti Aki / Busi', odoPlus: 10000 },
];

export default function AddMaintenanceModal({
  isOpen,
  onClose,
  onSuccess,
  latestOdo = 0,
}: AddMaintenanceModalProps) {
  const [serviceType, setServiceType] = useState<string>('Ganti Oli Mesin');
  const [odometer, setOdometer] = useState<string>(latestOdo > 0 ? String(latestOdo) : '');
  const [nextOdoDue, setNextOdoDue] = useState<string>(
    latestOdo > 0 ? String(latestOdo + 2000) : ''
  );
  const [cost, setCost] = useState<string>('');
  const [workshop, setWorkshop] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePresetSelect = (preset: { name: string; odoPlus: number }) => {
    setServiceType(preset.name);
    const curr = parseFloat(odometer) || latestOdo || 0;
    if (curr > 0) {
      setNextOdoDue(String(curr + preset.odoPlus));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType || !odometer || !cost) {
      setErrorMsg('Mohon lengkapi jenis servis, odometer, dan total biaya.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await createMaintenanceLog({
      date,
      serviceType,
      odometer: Number(odometer),
      nextOdoDue: nextOdoDue ? Number(nextOdoDue) : undefined,
      cost: Number(cost),
      workshop,
      notes,
    });

    setLoading(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || 'Gagal menyimpan catatan servis');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border-[3px] border-black rounded-2xl shadow-neo-lg overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-[#bae6fd]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border-2 border-black shadow-neo-sm text-black">
              <Wrench className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-black text-black text-base uppercase tracking-tight">Catat Servis / Oli</h3>
              <p className="text-xs font-semibold text-slate-800">Pengingat perawatan berkala</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="neo-btn p-1.5 rounded-lg bg-white text-black hover:bg-slate-100"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 text-xs font-bold text-black bg-[#fecdd3] border-2 border-black rounded-xl shadow-neo-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1.5">
              Pilihan Servis Cepat:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SERVICE_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => handlePresetSelect(p)}
                  className={`neo-btn text-[11px] font-black uppercase px-2.5 py-1 rounded-lg transition ${
                    serviceType === p.name
                      ? 'bg-[#bae6fd] text-black shadow-neo-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">
                Tanggal Servis
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
                Jenis Servis
              </label>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                placeholder="cth: Ganti Oli + Filter"
                className="w-full px-3 py-2 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-semibold shadow-neo-sm focus:outline-none focus:bg-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">
                Odometer Servis (KM)
              </label>
              <input
                type="number"
                placeholder="15400"
                value={odometer}
                onChange={(e) => {
                  setOdometer(e.target.value);
                  const curr = parseFloat(e.target.value) || 0;
                  if (curr > 0 && !nextOdoDue) {
                    setNextOdoDue(String(curr + 2500));
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-mono font-bold shadow-neo-sm focus:outline-none focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">
                Servis Berikutnya (KM)
              </label>
              <input
                type="number"
                placeholder="18000"
                value={nextOdoDue}
                onChange={(e) => setNextOdoDue(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-mono font-bold shadow-neo-sm focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">
                Total Biaya (Rp)
              </label>
              <input
                type="number"
                step="1000"
                placeholder="cth: 75000"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-mono font-bold shadow-neo-sm focus:outline-none focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">
                Nama Bengkel
              </label>
              <input
                type="text"
                placeholder="cth: AHASS / Bengkel Jaya"
                value={workshop}
                onChange={(e) => setWorkshop(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#faf8f5] border-2 border-black rounded-xl text-black font-semibold shadow-neo-sm focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Catatan / Merek Oli
            </label>
            <input
              type="text"
              placeholder="cth: Shell Advance AX7 10W-40"
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
              className="neo-btn flex items-center gap-2 px-5 py-2 text-xs font-black uppercase text-black bg-[#bae6fd] hover:bg-[#7dd3fc] rounded-xl disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Simpan Servis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
