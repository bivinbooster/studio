
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
import { PlusCircle, Settings, Target, LogOut, Loader2 } from 'lucide-react';
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
import * as dataService from '@/lib/data-service';

export function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const [isAddExpenseOpen, setAddExpenseOpen] = useState(false);
  const [isBudgetEditorOpen, setBudgetEditorOpen] = useState(false);
  const [isAddGoalOpen, setAddGoalOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  // Effect to load data from Firestore on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userExpenses, userBudgets, userGoals] = await Promise.all([
          dataService.getExpenses(),
          dataService.getBudgets(),
          dataService.getGoals(),
        ]);
        setExpenses(userExpenses);
        setBudgets(userBudgets);
        setGoals(userGoals);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load your data. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    setIsClient(true);
  }, [toast]);


  const { totalSpent, totalBudget, remainingBudget } = useMemo(() => {
    const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const budget = budgets.reduce((sum, b) => sum + b.amount, 0);
    return {
      totalSpent: spent,
      totalBudget: budget,
      remainingBudget: budget - spent,
    };
  }, [expenses, budgets]);

  const addExpense = async (newExpense: Omit<Expense, 'id'>) => {
    try {
      const savedExpense = await dataService.addExpense(newExpense);
      setExpenses((prev) =>
        [...prev, savedExpense].sort((a, b) => b.date.getTime() - a.date.getTime())
      );
      toast({
        title: 'Expense Added',
        description: `${savedExpense.description} for $${savedExpense.amount.toFixed(2)} has been logged.`,
      });
    } catch (error) {
       toast({
        title: 'Error',
        description: 'Could not save expense. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      await dataService.deleteExpense(expenseId);
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
      toast({
        title: 'Expense Deleted',
        description: 'The expense has been successfully removed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not delete expense. Please try again.',
        variant: 'destructive',
      });
    }
  };


  const addGoal = async (newGoal: Omit<FinancialGoal, 'id' | 'currentAmount'>) => {
     try {
      const savedGoal = await dataService.addGoal(newGoal);
      setGoals((prev) => [...prev, savedGoal]);
      toast({
        title: 'Goal Added',
        description: `Your new goal "${savedGoal.name}" has been set.`,
      });
    } catch (error) {
       toast({
        title: 'Error',
        description: 'Could not save goal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const contributeToGoal = async (goalId: string, amount: number) => {
    try {
      await dataService.contributeToGoal(goalId, amount);
      setGoals((prevGoals) =>
        prevGoals.map((goal) => {
          if (goal.id === goalId) {
            const newCurrentAmount = goal.currentAmount + amount;
            return {
              ...goal,
              currentAmount: Math.min(newCurrentAmount, goal.targetAmount),
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
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not add contribution. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      await dataService.deleteGoal(goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      toast({
        title: 'Goal Deleted',
        description: 'The financial goal has been successfully removed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not delete goal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateBudgets = async (updatedBudgets: Budget[]) => {
    try {
      await dataService.saveBudgets(updatedBudgets);
      setBudgets(updatedBudgets);
      toast({
        title: 'Budgets Updated',
        description: 'Your new budget goals have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not update budgets. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    // In a real app, you'd clear session/token here
    router.push('/login');
  };
  
  if (!isClient || isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-transparent">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your financial data...</p>
      </div>
    );
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
           <FinancialGoals goals={goals} onContribute={contributeToGoal} onDelete={deleteGoal} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
          <div className="lg:col-span-7">
            <RecentExpenses expenses={expenses} onDelete={deleteExpense} />
          </div>
          <div className="lg:col-span-7">
            <SpendingInsights expenses={expenses} budgets={budgets} />
          </div>
        </div>
      </main>
    </div>
  );
}
