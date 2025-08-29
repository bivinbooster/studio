'use client';
import type { Expense } from '@/lib/types';
import { getCategoryById } from '@/lib/constants';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  const recentExpenses = expenses.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Your five most recent expenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => {
                const category = getCategoryById(expense.category);
                return (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div className="font-medium">{expense.description}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{category.name}</Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {format(expense.date, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No expenses logged yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
