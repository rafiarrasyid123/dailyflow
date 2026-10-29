'use server';

import { prisma } from '@/lib/prisma';

export async function getDashboardSummary() {
  try {
    // 1. Vehicle Stats
    const latestFuel = await prisma.fuelLog.findFirst({
      orderBy: { date: 'desc' },
    });

    const previousFuel = latestFuel
      ? await prisma.fuelLog.findFirst({
          where: {
            date: { lt: latestFuel.date },
          },
          orderBy: { date: 'desc' },
        })
      : null;

    let latestEfficiency = null;
    if (latestFuel && previousFuel && latestFuel.odometer > previousFuel.odometer) {
      const distance = latestFuel.odometer - previousFuel.odometer;
      latestEfficiency = Number((distance / latestFuel.liters).toFixed(1));
    }

    const latestMaintenance = await prisma.maintenanceLog.findFirst({
      orderBy: { date: 'desc' },
    });

    // 2. Lend/Borrow Stats
    const activeRecords = await prisma.lendBorrow.findMany({
      where: { status: 'ACTIVE' },
    });

    let totalMoneyLentOut = 0;   // Piutang kita (orang pinjam ke kita)
    let totalMoneyBorrowed = 0;  // Utang kita (kita pinjam dari orang)
    let activeItemsLentOut = 0;  // Barang kita yang dipinjam
    let activeItemsBorrowed = 0; // Barang orang yang kita pinjam

    activeRecords.forEach((item) => {
      if (item.itemType === 'MONEY') {
        const val = item.amount || 0;
        if (item.lendType === 'LENT_OUT') {
          totalMoneyLentOut += val;
        } else {
          totalMoneyBorrowed += val;
        }
      } else {
        if (item.lendType === 'LENT_OUT') {
          activeItemsLentOut += 1;
        } else {
          activeItemsBorrowed += 1;
        }
      }
    });

    return {
      success: true,
      data: {
        vehicle: {
          currentOdometer: latestFuel?.odometer || latestMaintenance?.odometer || 0,
          latestEfficiency,
          latestFuel,
          latestMaintenance,
          upcomingServiceDue: latestMaintenance?.nextOdoDue || null,
        },
        lendBorrow: {
          totalMoneyLentOut,
          totalMoneyBorrowed,
          activeItemsLentOut,
          activeItemsBorrowed,
          totalActiveCount: activeRecords.length,
          activeList: activeRecords.slice(0, 5), // 5 teratas
        },
      },
    };
  } catch (error: any) {
    console.error('Error fetching dashboard summary:', error);
    return {
      success: false,
      error: error.message || 'Gagal memuat ringkasan dashboard',
      data: {
        vehicle: {
          currentOdometer: 0,
          latestEfficiency: null,
          latestFuel: null,
          latestMaintenance: null,
          upcomingServiceDue: null,
        },
        lendBorrow: {
          totalMoneyLentOut: 0,
          totalMoneyBorrowed: 0,
          activeItemsLentOut: 0,
          activeItemsBorrowed: 0,
          totalActiveCount: 0,
          activeList: [],
        },
      },
    };
  }
}

