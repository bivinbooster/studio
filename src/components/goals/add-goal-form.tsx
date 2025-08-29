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

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Goal name must be at least 2 characters.',
  }),
  targetAmount: z.coerce
    .number()
    .positive({ message: 'Target amount must be positive.' }),
});

interface AddGoalFormProps {
  onSuccess: (goal: Omit<FinancialGoal, 'id' | 'currentAmount'>) => void;
}

export function AddGoalForm({ onSuccess }: AddGoalFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      targetAmount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSuccess(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., European Vacation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Amount</FormLabel>
              <FormControl>
                <Input type="number" step="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Save Goal
        </Button>
      </form>
    </Form>
  );
}
