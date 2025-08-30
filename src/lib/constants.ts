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
import type { Category, CategoryID } from './types';

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
