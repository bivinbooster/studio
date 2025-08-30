'use client';
import { useMemo } from 'react';
import type { Expense } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import {
  Card,
  BareCardContent,
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
import { PieChart, Pie, Cell } from 'recharts';

interface SpendingPieChartProps {
  expenses: Expense[];
}

export function SpendingPieChart({ expenses }: SpendingPieChartProps) {
  const chartData = useMemo(() => {
    const categorySpending = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return CATEGORIES.map((category) => ({
      name: category.name,
      value: categorySpending[category.id] || 0,
      fill: category.color,
    })).filter((item) => item.value > 0);
  }, [expenses]);

  const chartConfig = Object.fromEntries(
    CATEGORIES.map((cat) => [cat.name, { label: cat.name }])
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>
          A look at where your money is going this month.
        </CardDescription>
      </CardHeader>
      <BareCardContent className="flex justify-center">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full max-w-[300px]">
            <PieChart
              style={{
                filter: 'drop-shadow(0px 10px 8px rgba(0, 0, 0, 0.4))',
              }}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                stroke="hsl(var(--card))"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
            No spending data to display.
          </div>
        )}
      </BareCardContent>
    </Card>
  );
}
