import { getFuelLogs, getMaintenanceLogs, getTripExpenses } from '@/actions/vehicle';
import VehicleView from '@/components/vehicle/VehicleView';

export const dynamic = 'force-dynamic';

export default async function VehiclePage() {
  const [fuelRes, maintRes, tripRes] = await Promise.all([
    getFuelLogs(),
    getMaintenanceLogs(),
    getTripExpenses(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          🛵 Teman Harian Kendaraan
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Pantau konsumsi BBM, servis berkala, odometer, dan biaya operasional di jalan.
        </p>
      </div>

      <VehicleView
        initialFuelLogs={fuelRes.data || []}
        initialMaintenanceLogs={maintRes.data || []}
        initialTripExpenses={tripRes.data || []}
      />
    </div>
  );
}
