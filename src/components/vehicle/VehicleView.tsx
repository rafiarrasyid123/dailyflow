'use client';

import { useState } from 'react';
import {
  Fuel,
  Wrench,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  Calendar,
  Gauge,
  TrendingUp,
} from 'lucide-react';
import { formatRupiah, formatDate, formatOdo } from '@/lib/format';
import { deleteFuelLog, deleteMaintenanceLog, deleteTripExpense } from '@/actions/vehicle';
import AddFuelModal from './AddFuelModal';
import AddMaintenanceModal from './AddMaintenanceModal';
import AddTripExpenseModal from './AddTripExpenseModal';

interface VehicleViewProps {
  initialFuelLogs: any[];
  initialMaintenanceLogs: any[];
  initialTripExpenses: any[];
}

export default function VehicleView({
  initialFuelLogs,
  initialMaintenanceLogs,
  initialTripExpenses,
}: VehicleViewProps) {
  const [activeTab, setActiveTab] = useState<'fuel' | 'maintenance' | 'trip'>('fuel');
  const [fuelLogs, setFuelLogs] = useState(initialFuelLogs);
  const [maintenanceLogs, setMaintenanceLogs] = useState(initialMaintenanceLogs);
  const [tripExpenses, setTripExpenses] = useState(initialTripExpenses);

  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [editFuelItem, setEditFuelItem] = useState<any>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const latestFuel = fuelLogs.length > 0 ? fuelLogs[0] : null;
  const currentOdometer = latestFuel?.odometer || maintenanceLogs[0]?.odometer || 0;

  const logsWithEfficiency = fuelLogs.map((log, index) => {
    const nextLogInList = fuelLogs[index + 1];
    let kmL: number | null = null;
    let distance: number | null = null;

    if (nextLogInList && log.odometer > nextLogInList.odometer) {
      distance = log.odometer - nextLogInList.odometer;
      if (log.liters > 0) {
        kmL = Number((distance / log.liters).toFixed(1));
      }
    }
    return { ...log, kmL, distance };
  });

  const totalFuelCost = fuelLogs.reduce((acc, curr) => acc + (curr.priceTotal || 0), 0);
  const totalMaintCost = maintenanceLogs.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const totalTripCost = tripExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const upcomingService = maintenanceLogs.find((m) => m.nextOdoDue && m.nextOdoDue >= currentOdometer);
  const isServiceDueSoon = upcomingService?.nextOdoDue
    ? upcomingService.nextOdoDue - currentOdometer <= 500
    : false;

  const handleDeleteFuel = async (id: string) => {
    if (!confirm('Yakin ingin menghapus catatan bensin ini?')) return;
    setDeletingId(id);
    const res = await deleteFuelLog(id);
    if (res.success) {
      setFuelLogs(fuelLogs.filter((f) => f.id !== id));
    }
    setDeletingId(null);
  };

  const handleDeleteMaintenance = async (id: string) => {
    if (!confirm('Yakin ingin menghapus catatan servis ini?')) return;
    setDeletingId(id);
    const res = await deleteMaintenanceLog(id);
    if (res.success) {
      setMaintenanceLogs(maintenanceLogs.filter((m) => m.id !== id));
    }
    setDeletingId(null);
  };

  const handleDeleteTrip = async (id: string) => {
    if (!confirm('Yakin ingin menghapus catatan biaya ini?')) return;
    setDeletingId(id);
    const res = await deleteTripExpense(id);
    if (res.success) {
      setTripExpenses(tripExpenses.filter((t) => t.id !== id));
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats - Pastel Neo-Brutalism */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#fef08a] border-[3px] border-black rounded-2xl p-4 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between text-black mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Odometer</span>
            <Gauge className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-black font-mono">
              {formatOdo(currentOdometer)}
            </div>
            <p className="text-[11px] font-semibold text-slate-700 mt-1">Pembacaan speedometer</p>
          </div>
        </div>

        <div className="bg-[#bbf7d0] border-[3px] border-black rounded-2xl p-4 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between text-black mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Konsumsi BBM</span>
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-black font-mono">
              {logsWithEfficiency[0]?.kmL ? `${logsWithEfficiency[0].kmL} km/L` : '-'}
            </div>
            <p className="text-[11px] font-semibold text-slate-700 mt-1">
              {logsWithEfficiency[0]?.distance
                ? `Jarak trip: ${logsWithEfficiency[0].distance} km`
                : 'Diperbarui otomatis'}
            </p>
          </div>
        </div>

        <div className="bg-[#fed7aa] border-[3px] border-black rounded-2xl p-4 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between text-black mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Total BBM</span>
            <Fuel className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-black font-mono">
              {formatRupiah(totalFuelCost)}
            </div>
            <p className="text-[11px] font-semibold text-slate-700 mt-1">{fuelLogs.length} kali pengisian</p>
          </div>
        </div>

        <div className="bg-[#bae6fd] border-[3px] border-black rounded-2xl p-4 shadow-neo flex flex-col justify-between">
          <div className="flex items-center justify-between text-black mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Total Servis</span>
            <Wrench className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-black font-mono">
              {formatRupiah(totalMaintCost + totalTripCost)}
            </div>
            <p className="text-[11px] font-semibold text-slate-700 mt-1">Servis + Parkir/Tol</p>
          </div>
        </div>
      </div>

      {/* Service Alert Banner if near target */}
      {upcomingService && upcomingService.nextOdoDue && (
        <div
          className={`flex items-start md:items-center justify-between gap-4 p-4 rounded-2xl border-[3px] border-black shadow-neo ${
            isServiceDueSoon ? 'bg-[#fecdd3]' : 'bg-[#e0e7ff]'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white border-2 border-black text-black shrink-0 mt-0.5 md:mt-0 shadow-neo-sm">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-black text-sm text-black uppercase tracking-tight">
                Pengingat Servis: {upcomingService.serviceType}
              </h4>
              <p className="text-xs font-medium text-slate-800 mt-0.5">
                Target di <span className="font-mono font-black">{formatOdo(upcomingService.nextOdoDue)}</span> (Sisa{' '}
                <span className="font-black underline">
                  {Math.max(0, upcomingService.nextOdoDue - currentOdometer)} km lagi
                </span>
                )
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMaintModalOpen(true)}
            className="neo-btn hidden md:inline-flex text-xs px-3.5 py-1.5 rounded-xl bg-white text-black font-black uppercase"
          >
            Servis Sekarang
          </button>
        </div>
      )}

      {/* Tabs and Action Button Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b-2 border-black/10 pb-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => setActiveTab('fuel')}
            className={`neo-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition ${
              activeTab === 'fuel'
                ? 'bg-[#fef08a] text-black shadow-neo'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Fuel className="w-4 h-4 stroke-[2.2]" />
            BBM ({fuelLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`neo-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition ${
              activeTab === 'maintenance'
                ? 'bg-[#bae6fd] text-black shadow-neo'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Wrench className="w-4 h-4 stroke-[2.2]" />
            Servis ({maintenanceLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('trip')}
            className={`neo-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition ${
              activeTab === 'trip'
                ? 'bg-[#bbf7d0] text-black shadow-neo'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <DollarSign className="w-4 h-4 stroke-[2.2]" />
            Parkir/Tol ({tripExpenses.length})
          </button>
        </div>

        {/* Action button corresponding to active tab */}
        <div>
          {activeTab === 'fuel' && (
            <button
              onClick={() => {
                setEditFuelItem(null);
                setIsFuelModalOpen(true);
              }}
              className="neo-btn flex items-center justify-center gap-2 px-4 py-2 text-xs font-black uppercase text-black bg-[#fed7aa] rounded-xl hover:bg-[#fdba74]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Catat Pengisian BBM
            </button>
          )}

          {activeTab === 'maintenance' && (
            <button
              onClick={() => setIsMaintModalOpen(true)}
              className="neo-btn flex items-center justify-center gap-2 px-4 py-2 text-xs font-black uppercase text-black bg-[#bae6fd] rounded-xl hover:bg-[#7dd3fc]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Catat Servis Baru
            </button>
          )}

          {activeTab === 'trip' && (
            <button
              onClick={() => setIsTripModalOpen(true)}
              className="neo-btn flex items-center justify-center gap-2 px-4 py-2 text-xs font-black uppercase text-black bg-[#bbf7d0] rounded-xl hover:bg-[#86efac]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Catat Biaya Jalan
            </button>
          )}
        </div>
      </div>

      {/* Content for TAB: FUEL */}
      {activeTab === 'fuel' && (
        <div className="space-y-3">
          {logsWithEfficiency.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-black/40 rounded-2xl bg-white shadow-neo">
              <Fuel className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="text-sm font-black uppercase text-black">Belum ada catatan pengisian BBM</h4>
              <p className="text-xs font-medium text-slate-600 mt-1 max-w-sm mx-auto">
                Catat setiap kali Anda mengisi bensin untuk melacak konsumsi BBM (km/liter) dan total pengeluaran.
              </p>
              <button
                onClick={() => {
                  setEditFuelItem(null);
                  setIsFuelModalOpen(true);
                }}
                className="neo-btn mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase text-black bg-[#fed7aa] rounded-xl"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Mulai Catat BBM
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {logsWithEfficiency.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-2 border-black rounded-2xl p-5 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-black text-lg font-mono">
                          {formatOdo(item.odometer)}
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#fef08a] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                          {item.fuelType || 'Pertalite'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-black font-mono">
                        {formatRupiah(item.priceTotal)}
                      </div>
                      <div className="text-xs font-bold text-slate-600 font-mono">{item.liters} Liter</div>
                    </div>
                  </div>

                  {(item.kmL || item.distance) && (
                    <div className="mt-3 pt-3 border-t-2 border-black/10 flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">
                        {item.distance ? `Trip: ${item.distance} km` : ''}
                      </span>
                      {item.kmL && (
                        <span className="font-black text-black bg-[#bbf7d0] border border-black px-2.5 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#000]">
                          ⚡ {item.kmL} km / L
                        </span>
                      )}
                    </div>
                  )}

                  {item.notes && (
                    <p className="mt-2 text-xs font-medium text-slate-700 bg-[#f8fafc] p-2 rounded-lg border border-black/20">
                      "{item.notes}"
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t-2 border-black/10 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditFuelItem(item);
                        setIsFuelModalOpen(true);
                      }}
                      className="neo-btn px-2.5 py-1 text-xs font-black uppercase bg-[#fef08a] text-black rounded-lg flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3 stroke-[2.5]" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteFuel(item.id)}
                      disabled={deletingId === item.id}
                      className="neo-btn px-2.5 py-1 text-xs font-black uppercase bg-[#fecdd3] text-black rounded-lg flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3 stroke-[2.5]" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content for TAB: MAINTENANCE */}
      {activeTab === 'maintenance' && (
        <div className="space-y-3">
          {maintenanceLogs.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-black/40 rounded-2xl bg-white shadow-neo">
              <Wrench className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="text-sm font-black uppercase text-black">Belum ada riwayat servis</h4>
              <p className="text-xs font-medium text-slate-600 mt-1 max-w-sm mx-auto">
                Catat servis berkala agar motor/mobil Anda selalu prima dan tidak lewat jadwal ganti oli.
              </p>
              <button
                onClick={() => setIsMaintModalOpen(true)}
                className="neo-btn mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase text-black bg-[#bae6fd] rounded-xl"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Catat Servis Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {maintenanceLogs.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-2 border-black rounded-2xl p-5 shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-black text-lg tracking-tight">{item.serviceType}</h4>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(item.date)}</span>
                        {item.workshop && (
                          <span className="text-slate-800 font-bold">• {item.workshop}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-black font-mono">
                        {formatRupiah(item.cost)}
                      </div>
                      <div className="text-xs font-bold text-slate-600 font-mono">
                        Odo: {formatOdo(item.odometer)}
                      </div>
                    </div>
                  </div>

                  {item.nextOdoDue && (
                    <div className="mt-3 pt-3 border-t-2 border-black/10 flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Target servis berikutnya:</span>
                      <span className="font-black font-mono text-black bg-[#fed7aa] border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                        {formatOdo(item.nextOdoDue)}
                      </span>
                    </div>
                  )}

                  {item.notes && (
                    <p className="mt-2 text-xs font-medium text-slate-700 bg-[#f8fafc] p-2 rounded-lg border border-black/20">
                      "{item.notes}"
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t-2 border-black/10 flex items-center justify-end">
                    <button
                      onClick={() => handleDeleteMaintenance(item.id)}
                      disabled={deletingId === item.id}
                      className="neo-btn px-2.5 py-1 text-xs font-black uppercase bg-[#fecdd3] text-black rounded-lg flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3 stroke-[2.5]" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content for TAB: TRIP EXPENSES */}
      {activeTab === 'trip' && (
        <div className="space-y-3">
          {tripExpenses.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-black/40 rounded-2xl bg-white shadow-neo">
              <DollarSign className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="text-sm font-black uppercase text-black">Belum ada catatan biaya jalan</h4>
              <p className="text-xs font-medium text-slate-600 mt-1 max-w-sm mx-auto">
                Catat pengeluaran harian seperti parkir harian, tiket tol, atau cuci kendaraan.
              </p>
              <button
                onClick={() => setIsTripModalOpen(true)}
                className="neo-btn mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase text-black bg-[#bbf7d0] rounded-xl"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Catat Parkir / Tol
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tripExpenses.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-2 border-black rounded-2xl p-4 shadow-neo flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#bbf7d0] border-2 border-black text-black shadow-neo-sm flex items-center justify-center font-black text-sm">
                      {item.category.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-black text-base">{item.category}</span>
                        <span className="text-[11px] font-bold text-slate-600">• {formatDate(item.date)}</span>
                      </div>
                      {item.notes && <p className="text-xs font-medium text-slate-600 mt-0.5">{item.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-black font-mono text-base">
                      {formatRupiah(item.amount)}
                    </span>
                    <button
                      onClick={() => handleDeleteTrip(item.id)}
                      disabled={deletingId === item.id}
                      className="neo-btn p-1.5 bg-[#fecdd3] text-black rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 stroke-[2.2]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddFuelModal
        isOpen={isFuelModalOpen}
        onClose={() => setIsFuelModalOpen(false)}
        onSuccess={() => window.location.reload()}
        editItem={editFuelItem}
        latestOdo={currentOdometer}
      />

      <AddMaintenanceModal
        isOpen={isMaintModalOpen}
        onClose={() => setIsMaintModalOpen(false)}
        onSuccess={() => window.location.reload()}
        latestOdo={currentOdometer}
      />

      <AddTripExpenseModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
