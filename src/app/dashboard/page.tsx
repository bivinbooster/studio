import { DashboardPage } from '@/components/dashboard/dashboard-page';

export default function Dashboard() {
  // In a real application, you would fetch this data from a database
  // for the currently logged-in user. For a new user, these would be empty.
  const expenses = [];
  const budgets = [];
  const goals = [];

  return <DashboardPage initialExpenses={expenses} initialBudgets={budgets} initialGoals={goals} />;
}
