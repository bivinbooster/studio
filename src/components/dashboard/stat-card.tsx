'use client';
import { Card, CardHeader, CardTitle, BareCardContent } from '@/components/ui/card';
import { useCountUp } from '@/hooks/use-count-up';

interface StatCardProps {
  title: string;
  value: number;
  type?: 'currency' | 'number';
}

export function StatCard({ title, value, type = 'number' }: StatCardProps) {
  const animatedValue = useCountUp(value);

  const formatValue = (val: number) => {
    if (type === 'currency') {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(val);
      // For negative values, formatCurrency puts the '-' sign before the '$'. 
      // e.g., -$100. We want it to be $-100.
      if (val < 0) {
        return `-$${formatted.replace('-$','').replace('-','')}`;
      }
      return formatted;
    }
    return val.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const isNegative = value < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <BareCardContent>
        <div
          className={`text-2xl font-bold ${isNegative ? 'text-destructive' : 'text-foreground'}`}
        >
          {formatValue(animatedValue)}
        </div>
      </BareCardContent>
    </Card>
  );
}
