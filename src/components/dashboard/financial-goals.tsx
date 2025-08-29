'use client';
import type { FinancialGoal } from '@/lib/types';
import {
  Card,
  CardContent,
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

interface FinancialGoalsProps {
  goals: FinancialGoal[];
  onContribute: (goalId: string, amount: number) => void;
}

function GoalItem({
  goal,
  onContribute,
}: {
  goal: FinancialGoal;
  onContribute: (goalId: string, amount: number) => void;
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
    </div>
  );
}

export function FinancialGoals({ goals, onContribute }: FinancialGoalsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Goals</CardTitle>
        <CardDescription>
          Track your progress towards your savings goals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {goals.length > 0 ? (
          <div className="space-y-6">
            {goals.map((goal) => (
              <GoalItem key={goal.id} goal={goal} onContribute={onContribute} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>You haven't set any financial goals yet.</p>
            <p className="text-sm">Click "Add Goal" to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
