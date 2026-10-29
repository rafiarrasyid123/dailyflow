import { getLendBorrows } from '@/actions/lend-borrow';
import LendBorrowView from '@/components/lend-borrow/LendBorrowView';

export const dynamic = 'force-dynamic';

export default async function LendBorrowPage() {
  const res = await getLendBorrows();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          🤝 Catatan Pinjam-Meminjam
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Pantau barang atau uang yang sedang dipinjamkan ke teman atau yang kita pinjam, lengkap dengan tanggal jatuh tempo.
        </p>
      </div>

      <LendBorrowView initialRecords={res.data || []} />
    </div>
  );
}
