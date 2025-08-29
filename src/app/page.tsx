import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { SAMPLE_EXPENSES, SAMPLE_BUDGETS } from '@/lib/constants';

export default function Home() {
  // In a real application, you would fetch this data from a database
  // for the currently logged-in user.
  const expenses = SAMPLE_EXPENSES;
  const budgets = SAMPLE_BUDGETS;

  return <DashboardPage initialExpenses={expenses} initialBudgets={budgets} />;
}
