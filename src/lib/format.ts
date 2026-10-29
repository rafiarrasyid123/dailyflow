export function formatRupiah(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatOdo(km: number | null | undefined): string {
  if (km === null || km === undefined || isNaN(km)) return '0 km';
  return new Intl.NumberFormat('id-ID').format(km) + ' km';
}

export function getDaysDiff(targetDate: Date | string): {
  days: number;
  label: string;
  isOverdue: boolean;
} {
  const target = new Date(targetDate);
  const today = new Date();
  // Reset jam
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      days: Math.abs(diffDays),
      label: `Lewat ${Math.abs(diffDays)} hari`,
      isOverdue: true,
    };
  } else if (diffDays === 0) {
    return {
      days: 0,
      label: 'Hari ini!',
      isOverdue: false,
    };
  } else {
    return {
      days: diffDays,
      label: `${diffDays} hari lagi`,
      isOverdue: false,
    };
  }
}

