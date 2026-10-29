import { getDashboardSummary } from '@/actions/dashboard';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const summaryRes = await getDashboardSummary();

  return <DashboardClient summary={summaryRes.data} />;
}
