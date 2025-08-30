
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
import { PlusCircle, Settings, Target, LogOut, Loader2, Save, Edit } from 'lucide-react';
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
  // Master state from the database
  const [masterExpenses, setMasterExpenses] = useState<Expense[]>([]);
  const [masterBudgets, setMasterBudgets] = useState<Budget[]>([]);
  const [masterGoals, setMasterGoals] = useState<FinancialGoal[]>([]);
  
  // Draft state for editing
  const [draftExpenses, setDraftExpenses] = useState<Expense[]>([]);
  const [draftBudgets, setDraftBudgets] = useState<Budget[]>([]);
  const [draftGoals, setDraftGoals] = useState<FinancialGoal[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isAddExpenseOpen, setAddExpenseOpen] = useState(false);
  const [isBudgetEditorOpen, setBudgetEditorOpen]   = useState(false);
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
        setMasterExpenses(userExpenses);
        setMasterBudgets(userBudgets);
        setMasterGoals(userGoals);
        // Initialize draft state from master state
        setDraftExpenses(userExpenses);
        setDraftBudgets(userBudgets);
        setDraftGoals(userGoals);
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

  const expenses = isEditMode ? draftExpenses : masterExpenses;
  const budgets = isEditMode ? draftBudgets : masterBudgets;
  const goals = isEditMode ? draftGoals : masterGoals;


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
    const tempId = `temp-${Date.now()}`;
    const expenseWithId = { ...newExpense, id: tempId };
    setDraftExpenses((prev) =>
      [...prev, expenseWithId].sort((a, b) => b.date.getTime() - a.date.getTime())
    );
  };

  const deleteExpense = (expenseId: string) => {
    setDraftExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  };


  const addGoal = (newGoal: Omit<FinancialGoal, 'id' | 'currentAmount'>) => {
    const tempId = `temp-${Date.now()}`;
    const goalWithId = { ...newGoal, id: tempId, currentAmount: 0 };
    setDraftGoals((prev) => [...prev, goalWithId]);
  };

  const contributeToGoal = (goalId: string, amount: number) => {
    setDraftGoals((prevGoals) =>
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
  };

  const deleteGoal = (goalId: string) => {
    setDraftGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const updateBudgets = (updatedBudgets: Budget[]) => {
    setDraftBudgets(updatedBudgets);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // NOTE: This is a simplified save logic. A real app would need to handle
      // creations, updates, and deletions more granularly.
      await Promise.all([
        dataService.saveExpenses(draftExpenses),
        dataService.saveBudgets(draftBudgets),
        dataService.saveGoals(draftGoals),
      ]);
      
      // Update master state with the saved draft state
      setMasterExpenses(draftExpenses);
      setMasterBudgets(draftBudgets);
      setMasterGoals(draftGoals);

      toast({
        title: 'Success!',
        description: 'Your changes have been saved to the database.',
      });
      setIsEditMode(false);
    } catch (error) {
       toast({
        title: 'Error Saving',
        description: 'Could not save your changes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }

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
           {isEditMode && (
             <>
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
            </>
           )}
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
           <FinancialGoals goals={goals} onContribute={contributeToGoal} onDelete={deleteGoal} isEditMode={isEditMode} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
          <div className="lg:col-span-1">
            <RecentExpenses expenses={expenses} onDelete={deleteExpense} isEditMode={isEditMode} />
          </div>
          <div className="lg:col-span-1">
            <SpendingInsights expenses={expenses} budgets={budgets} />
          </div>
        </div>
      </main>
      <footer className="sticky bottom-0 z-30 flex h-16 items-center justify-end gap-4 border-t border-white/10 bg-background/80 px-6 backdrop-blur-sm">
        {isEditMode ? (
            <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
              Save Changes
            </Button>
          ) : (
            <Button size="lg" onClick={() => setIsEditMode(true)}>
              <Edit className="mr-2" />
              Edit
            </Button>
        )}
      </footer>
    </div>
  );
}
