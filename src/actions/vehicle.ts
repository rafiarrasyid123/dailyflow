'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

// ================= FUEL LOGS =================

export async function getFuelLogs() {
  try {
    const logs = await prisma.fuelLog.findMany({
      orderBy: { date: 'desc' },
    });
    return { success: true, data: logs };
  } catch (error: any) {
    console.error('Error fetching fuel logs:', error);
    return {
      success: false,
      error: error.message || 'Gagal memuat riwayat BBM',
      data: [],
    };
  }
}

export async function createFuelLog(formData: {
  date: string;
  odometer: number;
  liters: number;
  priceTotal: number;
  fuelType?: string;
  notes?: string;
}) {
  try {
    const newLog = await prisma.fuelLog.create({
      data: {
        date: new Date(formData.date),
        odometer: Number(formData.odometer),
        liters: Number(formData.liters),
        priceTotal: Number(formData.priceTotal),
        fuelType: formData.fuelType || 'Pertalite',
        notes: formData.notes || null,
      },
    });
    revalidatePath('/');
    revalidatePath('/vehicle');
    return { success: true, data: newLog };
  } catch (error: any) {
    console.error('Error creating fuel log:', error);
    return {
      success: false,
      error: error.message || 'Gagal menyimpan catatan BBM. Periksa koneksi database.',
    };
  }
}

export async function updateFuelLog(
  id: string,
  formData: {
    date: string;
    odometer: number;
    liters: number;
    priceTotal: number;
    fuelType?: string;
    notes?: string;
  }
) {
  try {
    const updated = await prisma.fuelLog.update({
      where: { id },
      data: {
        date: new Date(formData.date),
        odometer: Number(formData.odometer),
        liters: Number(formData.liters),
        priceTotal: Number(formData.priceTotal),
        fuelType: formData.fuelType || 'Pertalite',
        notes: formData.notes || null,
      },
    });
    revalidatePath('/');
    revalidatePath('/vehicle');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating fuel log:', error);
    return { success: false, error: error.message || 'Gagal memperbarui catatan BBM' };
  }
}

export async function deleteFuelLog(id: string) {
  try {
    await prisma.fuelLog.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/vehicle');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting fuel log:', error);
    return { success: false, error: error.message || 'Gagal menghapus catatan BBM' };
  }
}

// ================= MAINTENANCE LOGS =================

export async function getMaintenanceLogs() {
  try {
    const logs = await prisma.maintenanceLog.findMany({
      orderBy: { date: 'desc' },
    });
    return { success: true, data: logs };
  } catch (error: any) {
    console.error('Error fetching maintenance logs:', error);
    return {
      success: false,
      error: error.message || 'Gagal memuat riwayat servis',
      data: [],
    };
  }
}

export async function createMaintenanceLog(formData: {
  date: string;
  serviceType: string;
  odometer: number;
  nextOdoDue?: number;
  cost: number;
  workshop?: string;
  notes?: string;
}) {
  try {
    const newLog = await prisma.maintenanceLog.create({
      data: {
        date: new Date(formData.date),
        serviceType: formData.serviceType,
        odometer: Number(formData.odometer),
        nextOdoDue: formData.nextOdoDue ? Number(formData.nextOdoDue) : null,
        cost: Number(formData.cost),
        workshop: formData.workshop || null,
        notes: formData.notes || null,
      },
    });
    revalidatePath('/');
    revalidatePath('/vehicle');
    return { success: true, data: newLog };
  } catch (error: any) {
    console.error('Error creating maintenance log:', error);
    return { success: false, error: error.message || 'Gagal menyimpan catatan servis' };
  }
}

export async function deleteMaintenanceLog(id: string) {
  try {
    await prisma.maintenanceLog.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/vehicle');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting maintenance log:', error);
    return { success: false, error: error.message || 'Gagal menghapus catatan servis' };
  }
}

// ================= TRIP EXPENSES =================

export async function getTripExpenses() {
  try {
    const expenses = await prisma.tripExpense.findMany({
      orderBy: { date: 'desc' },
    });
    return { success: true, data: expenses };
  } catch (error: any) {
    console.error('Error fetching trip expenses:', error);
    return {
      success: false,
      error: error.message || 'Gagal memuat biaya jalan',
      data: [],
    };
  }
}

export async function createTripExpense(formData: {
  date: string;
  category: string;
  amount: number;
  notes?: string;
}) {
  try {
    const newExpense = await prisma.tripExpense.create({
      data: {
        date: new Date(formData.date),
        category: formData.category,
        amount: Number(formData.amount),
        notes: formData.notes || null,
      },
    });
    revalidatePath('/');
    revalidatePath('/vehicle');
    return { success: true, data: newExpense };
  } catch (error: any) {
    console.error('Error creating trip expense:', error);
    return { success: false, error: error.message || 'Gagal menyimpan biaya perjalanan' };
  }
}

export async function deleteTripExpense(id: string) {
  try {
    await prisma.tripExpense.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/vehicle');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting trip expense:', error);
    return { success: false, error: error.message || 'Gagal menghapus biaya perjalanan' };
  }
}

