'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { LendType, ItemType, LendStatus } from '@prisma/client';

export async function getLendBorrows(filters?: {
  status?: LendStatus;
  lendType?: LendType;
  itemType?: ItemType;
}) {
  try {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.lendType) where.lendType = filters.lendType;
    if (filters?.itemType) where.itemType = filters.itemType;

    const list = await prisma.lendBorrow.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // ACTIVE first
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    return { success: true, data: list };
  } catch (error: any) {
    console.error('Error fetching lend/borrow records:', error);
    return {
      success: false,
      error: error.message || 'Gagal memuat catatan pinjaman',
      data: [],
    };
  }
}

export async function createLendBorrow(formData: {
  personName: string;
  lendType: LendType;
  itemType: ItemType;
  itemName?: string;
  amount?: number;
  startDate?: string;
  dueDate?: string;
  notes?: string;
}) {
  try {
    const record = await prisma.lendBorrow.create({
      data: {
        personName: formData.personName.trim(),
        lendType: formData.lendType,
        itemType: formData.itemType,
        itemName: formData.itemType === 'ITEM' ? formData.itemName?.trim() || 'Barang' : null,
        amount: formData.itemType === 'MONEY' ? Number(formData.amount) : null,
        startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        notes: formData.notes?.trim() || null,
        status: 'ACTIVE',
      },
    });

    revalidatePath('/');
    revalidatePath('/lend-borrow');
    return { success: true, data: record };
  } catch (error: any) {
    console.error('Error creating lend/borrow record:', error);
    return {
      success: false,
      error: error.message || 'Gagal menambahkan catatan pinjaman',
    };
  }
}

export async function toggleReturnStatus(id: string, currentStatus: LendStatus) {
  try {
    const newStatus: LendStatus = currentStatus === 'ACTIVE' ? 'RETURNED' : 'ACTIVE';
    const returnDate = newStatus === 'RETURNED' ? new Date() : null;

    const updated = await prisma.lendBorrow.update({
      where: { id },
      data: {
        status: newStatus,
        returnDate,
      },
    });

    revalidatePath('/');
    revalidatePath('/lend-borrow');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error toggling return status:', error);
    return {
      success: false,
      error: error.message || 'Gagal memperbarui status pengembalian',
    };
  }
}

export async function updateLendBorrow(
  id: string,
  formData: {
    personName: string;
    lendType: LendType;
    itemType: ItemType;
    itemName?: string;
    amount?: number;
    startDate?: string;
    dueDate?: string;
    notes?: string;
  }
) {
  try {
    const updated = await prisma.lendBorrow.update({
      where: { id },
      data: {
        personName: formData.personName.trim(),
        lendType: formData.lendType,
        itemType: formData.itemType,
        itemName: formData.itemType === 'ITEM' ? formData.itemName?.trim() || 'Barang' : null,
        amount: formData.itemType === 'MONEY' ? Number(formData.amount) : null,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        notes: formData.notes?.trim() || null,
      },
    });

    revalidatePath('/');
    revalidatePath('/lend-borrow');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating lend/borrow record:', error);
    return {
      success: false,
      error: error.message || 'Gagal memperbarui catatan pinjaman',
    };
  }
}

export async function deleteLendBorrow(id: string) {
  try {
    await prisma.lendBorrow.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/lend-borrow');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting lend/borrow record:', error);
    return {
      success: false,
      error: error.message || 'Gagal menghapus catatan pinjaman',
    };
  }
}

