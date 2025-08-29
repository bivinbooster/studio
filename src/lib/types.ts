import type { LucideIcon } from 'lucide-react';

export type CategoryID =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'housing'
  | 'utilities'
  | 'health'
  | 'personal'
  | 'shopping'
  | 'other';

export interface Category {
  id: CategoryID;
  name: string;
  icon: LucideIcon;
  color: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: CategoryID;
  date: Date;
  description: string;
  isRecurring: boolean;
}

export interface Budget {
  category: CategoryID;
  amount: number;
}
