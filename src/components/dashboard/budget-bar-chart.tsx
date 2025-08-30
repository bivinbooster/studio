
'use client';
import { useMemo } from 'react';
import type { Expense, Budget } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface BudgetBarChartProps {
  expenses: Expense[];
  budgets: Budget[];
}

export function BudgetBarChart({ expenses, budgets }: BudgetBarChartProps) {
  const chartData = useMemo(() => {
    const categorySpending = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return CATEGORIES.map((category) => {
      const budgetAmount =
        budgets.find((b) => b.category === category.id)?.amount || 0;
      const spentAmount = categorySpending[category.id] || 0;
      return {
        category: category.name,
        spent: spentAmount,
        budget: budgetAmount,
      };
    }).filter((item) => item.budget > 0 || item.spent > 0);
  }, [expenses, budgets]);

  const chartConfig = {
    spent: {
      label: 'Spent',
      color: 'hsl(var(--primary))',
    },
    budget: {
      label: 'Budget',
      color: 'hsl(var(--accent))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending vs. Budget</CardTitle>
        <CardDescription>
          How your spending compares to your budget goals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickFormatter={(value) =>
                formatCurrency(Number(value)).replace('.00', '')
              }
            />
            <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => <span>{`${chartConfig[name as keyof typeof chartConfig].label}: ${formatCurrency(Number(value))}`}</span>} />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
            <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
          </BarChart>
        </ChartContainer>
         ) : (
          <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
            No budget or spending data to display.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
