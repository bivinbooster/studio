import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { SAMPLE_EXPENSES, SAMPLE_BUDGETS, SAMPLE_GOALS } from '@/lib/constants';

export default function Home() {
  // In a real application, you would fetch this data from a database
  // for the currently logged-in user.
  const expenses = SAMPLE_EXPENSES;
  const budgets = SAMPLE_BUDGETS;
  const goals = SAMPLE_GOALS;

  return <DashboardPage initialExpenses={expenses} initialBudgets={budgets} initialGoals={goals} />;
}
