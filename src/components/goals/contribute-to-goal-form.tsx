'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { FinancialGoal } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface ContributeToGoalFormProps {
  goal: FinancialGoal;
  onSuccess: (amount: number) => void;
}

export function ContributeToGoalForm({
  goal,
  onSuccess,
}: ContributeToGoalFormProps) {
  const remainingAmount = goal.targetAmount - goal.currentAmount;

  const formSchema = z.object({
    amount: z.coerce
      .number()
      .positive({ message: 'Amount must be positive.' })
      .max(remainingAmount, {
        message: `Amount cannot exceed the remaining balance of ${formatCurrency(remainingAmount)}.`,
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSuccess(values.amount);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contribution Amount</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add Contribution
        </Button>
      </form>
    </Form>
  );
}
