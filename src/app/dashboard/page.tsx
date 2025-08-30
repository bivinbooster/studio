import { DashboardPage } from '@/components/dashboard/dashboard-page';

export default function Dashboard() {
  // In a real application, you would fetch this data from a database
  // for the currently logged-in user. For now, we will let the dashboard
  // component handle the fetching.
  return <DashboardPage />;
}
