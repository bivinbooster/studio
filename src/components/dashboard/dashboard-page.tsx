'use client';

import type { Expense, Budget } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle, Settings } from 'lucide-react';
import { StatCard } from './stat-card';
import { SpendingPieChart } from './spending-pie-chart';
import { BudgetBarChart } from './budget-bar-chart';
import { RecentExpenses } from './recent-expenses';
import { SpendingInsights } from './spending-insights';
import { AddExpenseForm } from '../expenses/add-expense-form';
import { BudgetEditor } from '../budget/budget-editor';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/ui/logo';

interface DashboardPageProps {
  initialExpenses: Expense[];
  initialBudgets: Budget[];
}

export function DashboardPage({
  initialExpenses,
  initialBudgets,
}: DashboardPageProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [isAddExpenseOpen, setAddExpenseOpen] = useState(false);
  const [isBudgetEditorOpen, setBudgetEditorOpen] = useState(false);
  const { toast } = useToast();

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

  const updateBudgets = (updatedBudgets: Budget[]) => {
    setBudgets(updatedBudgets);
    toast({
      title: 'Budgets Updated',
      description: 'Your new budget goals have been saved.',
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="text-xl font-bold text-foreground">FinTrack</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
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
