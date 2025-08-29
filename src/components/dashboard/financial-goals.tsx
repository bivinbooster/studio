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

interface FinancialGoalsProps {
  goals: FinancialGoal[];
}

function GoalItem({ goal }: { goal: FinancialGoal }) {
  const animatedCurrentAmount = useCountUp(goal.currentAmount);
  const progress = (animatedCurrentAmount / goal.targetAmount) * 100;

  return (
    <div>
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
  );
}

export function FinancialGoals({ goals }: FinancialGoalsProps) {
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
              <GoalItem key={goal.id} goal={goal} />
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
