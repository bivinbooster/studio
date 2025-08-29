'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { getSpendingInsights } from '@/ai/flows/spending-insights-summary';
import type { Expense, Budget } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SpendingInsightsProps {
  expenses: Expense[];
  budgets: Budget[];
}

export function SpendingInsights({ expenses, budgets }: SpendingInsightsProps) {
  const [insight, setInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetInsights = async () => {
    setIsLoading(true);
    setError('');
    setInsight('');
    try {
      const spendingData = JSON.stringify(
        expenses.map((e) => ({
          category: e.category,
          amount: e.amount,
          date: e.date.toISOString(),
        }))
      );
      const budgetGoals = JSON.stringify(budgets);
      const result = await getSpendingInsights({ spendingData, budgetGoals });
      setInsight(result.summary);
    } catch (e) {
      console.error(e);
      setError('Failed to generate insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Insights</CardTitle>
        <CardDescription>
          Get personalized recommendations to improve your spending habits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={handleGetInsights}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Analyze My Spending
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {insight && (
            <div className="rounded-lg border bg-card p-4 text-sm text-card-foreground">
              <p>{insight}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
