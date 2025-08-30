'use client';

import type { Expense, Budget, FinancialGoal } from '@/lib/types';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle, Settings, Target, LogOut } from 'lucide-react';
import { StatCard } from './stat-card';
import { SpendingPieChart } from './spending-pie-chart';
import { BudgetBarChart } from './budget-bar-chart';
import { RecentExpenses } from './recent-expenses';
import { SpendingInsights } from './spending-insights';
import { FinancialGoals } from './financial-goals';
import { AddExpenseForm } from '../expenses/add-expense-form';
import { AddGoalForm } from '../goals/add-goal-form';
import { BudgetEditor } from '../budget/budget-editor';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/ui/logo';
import { ContributeToGoalForm } from '../goals/contribute-to-goal-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardPageProps {
  initialExpenses: Expense[];
  initialBudgets: Budget[];
  initialGoals: FinancialGoal[];
}

// Helper functions to interact with localStorage
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    // Need to handle date revival for expenses
    if (item) {
      if (key === 'expenses') {
        const parsed = JSON.parse(item);
        return parsed.map((e: any) => ({ ...e, date: new Date(e.date) })) as T;
      }
      return JSON.parse(item);
    }
    return defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
};


export function DashboardPage({
  initialExpenses,
  initialBudgets,
  initialGoals,
}: DashboardPageProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  
  const [isClient, setIsClient] = useState(false);

  const [isAddExpenseOpen, setAddExpenseOpen] = useState(false);
  const [isBudgetEditorOpen, setBudgetEditorOpen] = useState(false);
  const [isAddGoalOpen, setAddGoalOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  // Effect to load data from localStorage on component mount
  useEffect(() => {
    setExpenses(getFromStorage('expenses', initialExpenses));
    setBudgets(getFromStorage('budgets', initialBudgets));
    setGoals(getFromStorage('goals', initialGoals));
    setIsClient(true);
  }, [initialExpenses, initialBudgets, initialGoals]);
  
  // Effects to save data to localStorage whenever it changes
  useEffect(() => {
    if (isClient) saveToStorage('expenses', expenses);
  }, [expenses, isClient]);

  useEffect(() => {
    if (isClient) saveToStorage('budgets', budgets);
  }, [budgets, isClient]);

  useEffect(() => {
    if (isClient) saveToStorage('goals', goals);
  }, [goals, isClient]);


  const { totalSpent, totalBudget, remainingBudget } = useMemo(() => {
    const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const budget = budgets.reduce((sum, b) => sum + b.amount, 0);
    return {
      totalSpent: spent,
      totalBudget: budget,
      remainingBudget: budget - spent,
    };
  }, [expenses, budgets]);

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expenseWithId = { ...newExpense, id: crypto.randomUUID() };
    setExpenses((prev) =>
      [...prev, expenseWithId].sort((a, b) => b.date.getTime() - a.date.getTime())
    );
    toast({
      title: 'Expense Added',
      description: `${newExpense.description} for $${newExpense.amount.toFixed(2)} has been logged.`,
    });
  };

  const addGoal = (newGoal: Omit<FinancialGoal, 'id' | 'currentAmount'>) => {
    const goalWithId = { ...newGoal, id: crypto.randomUUID(), currentAmount: 0 };
    setGoals((prev) => [...prev, goalWithId]);
    toast({
      title: 'Goal Added',
      description: `Your new goal "${newGoal.name}" has been set.`,
    });
  };

  const contributeToGoal = (goalId: string, amount: number) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          const newCurrentAmount = goal.currentAmount + amount;
          return {
            ...goal,
            currentAmount: Math.min(newCurrentAmount, goal.targetAmount), // Cap at target amount
          };
        }
        return goal;
      })
    );
    const goal = goals.find((g) => g.id === goalId);
    toast({
      title: 'Contribution Added',
      description: `You added ${amount.toFixed(2)} to your "${goal?.name}" goal.`,
    });
  };

  const updateBudgets = (updatedBudgets: Budget[]) => {
    setBudgets(updatedBudgets);
    toast({
      title: 'Budgets Updated',
      description: 'Your new budget goals have been saved.',
    });
  };

  const handleLogout = () => {
    // In a real app, you'd clear session/token here
    router.push('/login');
  };
  
  if (!isClient) {
    // You can return a loading spinner or a skeleton UI here
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <h1 className="text-xl font-bold text-foreground">FinTrack</h1>
        </Link>
        <div className="ml-auto flex items-center gap-2">
           <Dialog open={isAddGoalOpen} onOpenChange={setAddGoalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Target className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Financial Goal</DialogTitle>
              </DialogHeader>
              <AddGoalForm
                onSuccess={(newGoal) => {
                  addGoal(newGoal);
                  setAddGoalOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isBudgetEditorOpen} onOpenChange={setBudgetEditorOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Manage Budgets
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Budgets</DialogTitle>
              </DialogHeader>
              <BudgetEditor
                currentBudgets={budgets}
                onSave={(newBudgets) => {
                  updateBudgets(newBudgets);
                  setBudgetEditorOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isAddExpenseOpen} onOpenChange={setAddExpenseOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Expense</DialogTitle>
              </DialogHeader>
              <AddExpenseForm
                onSuccess={(newExpense) => {
                  addExpense(newExpense);
                  setAddExpenseOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Total Spent" value={totalSpent} type="currency" />
          <StatCard title="Total Budget" value={totalBudget} type="currency" />
          <StatCard
            title="Remaining"
            value={remainingBudget}
            type="currency"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <BudgetBarChart expenses={expenses} budgets={budgets} />
          </div>
          <div className="lg:col-span-3">
            <SpendingPieChart expenses={expenses} />
          </div>
        </div>
        <div className="grid gap-4">
           <FinancialGoals goals={goals} onContribute={contributeToGoal} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <RecentExpenses expenses={expenses} />
          </div>
          <div className="lg:col-span-3">
            <SpendingInsights expenses={expenses} budgets={budgets} />
          </div>
        </div>
      </main>
    </div>
  );
}
