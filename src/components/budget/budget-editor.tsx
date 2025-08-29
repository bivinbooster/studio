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
import { ScrollArea } from '@/components/ui/scroll-area';
import { CATEGORIES, getCategoryById } from '@/lib/constants';
import type { Budget } from '@/lib/types';

const formSchema = z.object({
  budgets: z.array(
    z.object({
      category: z.string(),
      amount: z.coerce.number().min(0, 'Budget must be non-negative.'),
    })
  ),
});

type BudgetFormValues = z.infer<typeof formSchema>;

interface BudgetEditorProps {
  currentBudgets: Budget[];
  onSave: (newBudgets: Budget[]) => void;
}

export function BudgetEditor({ currentBudgets, onSave }: BudgetEditorProps) {
  const defaultValues = CATEGORIES.map((category) => {
    const existingBudget = currentBudgets.find(
      (b) => b.category === category.id
    );
    return {
      category: category.id,
      amount: existingBudget ? existingBudget.amount : 0,
    };
  });

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budgets: defaultValues,
    },
  });

  const onSubmit = (values: BudgetFormValues) => {
    onSave(
      values.budgets.map((b) => ({
        ...b,
        category: b.category as Budget['category'],
      }))
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ScrollArea className="h-72">
          <div className="space-y-4 pr-4">
            {form.getValues('budgets').map((budget, index) => {
              const categoryInfo = getCategoryById(
                budget.category as Budget['category']
              );
              return (
                <FormField
                  key={budget.category}
                  control={form.control}
                  name={`budgets.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-2">
                          <categoryInfo.icon className="h-4 w-4" />
                          {categoryInfo.name}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="0"
                            className="w-32"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
        </ScrollArea>
        <Button type="submit" className="w-full">
          Save Budgets
        </Button>
      </form>
    </Form>
  );
}
