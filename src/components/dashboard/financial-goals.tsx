
'use client';
import type { FinancialGoal } from '@/lib/types';
import {
  Card,
  BareCardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { useCountUp } from '@/hooks/use-count-up';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ContributeToGoalForm } from '../goals/contribute-to-goal-form';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface FinancialGoalsProps {
  goals: FinancialGoal[];
  onContribute: (goalId: string, amount: number) => void;
  onDelete: (goalId: string) => void;
}

function GoalItem({
  goal,
  onContribute,
  onDelete,
}: {
  goal: FinancialGoal;
  onContribute: (goalId: string, amount: number) => void;
  onDelete: (goalId: string) => void;
}) {
  const animatedCurrentAmount = useCountUp(goal.currentAmount);
  const progress = (animatedCurrentAmount / goal.targetAmount) * 100;
  const [isContributeOpen, setContributeOpen] = useState(false);

  const isCompleted = goal.currentAmount >= goal.targetAmount;

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex justify-between items-end mb-1">
          <h3 className="font-medium">{goal.name}</h3>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatCurrency(animatedCurrentAmount)}
            </span>{' '}
            / {formatCurrency(goal.targetAmount)}
          </p>
        </div>
        <Progress value={progress} />
      </div>
      <div className="flex items-center gap-2">
        <Dialog open={isContributeOpen} onOpenChange={setContributeOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={isCompleted}>
              {isCompleted ? 'Completed' : 'Contribute'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contribute to "{goal.name}"</DialogTitle>
            </DialogHeader>
            <ContributeToGoalForm
              goal={goal}
              onSuccess={(amount) => {
                onContribute(goal.id, amount);
                setContributeOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                financial goal.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(goal.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export function FinancialGoals({
  goals,
  onContribute,
  onDelete,
}: FinancialGoalsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Goals</CardTitle>
        <CardDescription>
          Track your progress towards your savings goals.
        </CardDescription>
      </CardHeader>
      <BareCardContent>
        {goals.length > 0 ? (
          <div className="space-y-6">
            {goals.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onContribute={onContribute}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>You haven't set any financial goals yet.</p>
            <p className="text-sm">Click "Add Goal" to get started.</p>
          </div>
        )}
      </BareCardContent>
    </Card>
  );
}
