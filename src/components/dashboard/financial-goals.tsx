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

interface FinancialGoalsProps {
  goals: FinancialGoal[];
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
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id}>
                  <div className="flex justify-between items-end mb-1">
                    <h3 className="font-medium">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {formatCurrency(goal.currentAmount)}
                      </span>{' '}
                      / {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  <Progress value={progress} />
                </div>
              );
            })}
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
