'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number;
  type?: 'currency' | 'number';
}

export function StatCard({ title, value, type = 'number' }: StatCardProps) {
  const formatValue = (val: number) => {
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(val);
    }
    return val.toString();
  };

  const isNegative = value < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold ${isNegative ? 'text-destructive' : 'text-foreground'}`}
        >
          {formatValue(value)}
        </div>
      </CardContent>
    </Card>
  );
}
