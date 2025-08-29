import {
  Utensils,
  Car,
  Clapperboard,
  Home,
  Zap,
  HeartPulse,
  User,
  ShoppingCart,
  MoreHorizontal,
} from 'lucide-react';
import type { Category, Expense, Budget, CategoryID, FinancialGoal } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Food',
    icon: Utensils,
    color: 'hsl(var(--chart-3))',
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: Car,
    color: 'hsl(221.2 83.2% 53.3%)',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: Clapperboard,
    color: 'hsl(var(--chart-2))',
  },
  { id: 'housing', name: 'Housing', icon: Home, color: 'hsl(47.9 95.8% 53.1%)' },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: Zap,
    color: 'hsl(var(--chart-5))',
  },
  {
    id: 'health',
    name: 'Health',
    icon: HeartPulse,
    color: 'hsl(0 72.2% 50.6%)',
  },
  {
    id: 'personal',
    name: 'Personal',
    icon: User,
    color: 'hsl(17.5 90.2% 50.8%)',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: ShoppingCart,
    color: 'hsl(204 100% 40%)',
  },
  {
    id: 'other',
    name: 'Other',
    icon: MoreHorizontal,
    color: 'hsl(215.4 16.3% 46.9%)',
  },
];

export const getCategoryById = (id: CategoryID): Category => {
  return (
    CATEGORIES.find((c) => c.id === id) ||
    CATEGORIES.find((c) => c.id === 'other')!
  );
};

// Helper to create dates relative to today for dynamic sample data
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const SAMPLE_EXPENSES: Expense[] = [
  {
    id: '1',
    amount: 12.5,
    category: 'food',
    date: daysAgo(1),
    description: 'Lunch at cafe',
    isRecurring: false,
  },
  {
    id: '2',
    amount: 35.0,
    category: 'transport',
    date: daysAgo(2),
    description: 'Monthly metro pass',
    isRecurring: true,
  },
  {
    id: '3',
    amount: 210.99,
    category: 'shopping',
    date: daysAgo(2),
    description: 'New running shoes',
    isRecurring: false,
  },
  {
    id: '4',
    amount: 1200.0,
    category: 'housing',
    date: daysAgo(3),
    description: 'Rent',
    isRecurring: true,
  },
  {
    id: '5',
    amount: 75.8,
    category: 'utilities',
    date: daysAgo(4),
    description: 'Electricity bill',
    isRecurring: true,
  },
  {
    id: '6',
    amount: 45.0,
    category: 'entertainment',
    date: daysAgo(5),
    description: 'Movie tickets',
    isRecurring: false,
  },
  {
    id: '7',
    amount: 63.25,
    category: 'food',
    date: daysAgo(5),
    description: 'Groceries for the week',
    isRecurring: false,
  },
];

export const SAMPLE_BUDGETS: Budget[] = [
  { category: 'food', amount: 400 },
  { category: 'transport', amount: 150 },
  { category: 'entertainment', amount: 100 },
  { category: 'housing', amount: 1200 },
  { category: 'utilities', amount: 150 },
  { category: 'health', amount: 100 },
  { category: 'personal', amount: 80 },
  { category: 'shopping', amount: 250 },
  { category: 'other', amount: 50 },
];

export const SAMPLE_GOALS: FinancialGoal[] = [
    { id: '1', name: 'Dream Vacation', targetAmount: 5000, currentAmount: 1250 },
    { id: '2', name: 'New Laptop', targetAmount: 2000, currentAmount: 1800 },
    { id: '3', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 4000 },
];
