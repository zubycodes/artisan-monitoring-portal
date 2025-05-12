import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface PieChartCardProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  className?: string;
  loading: boolean;
  onClick: (data: any, index: number) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 text-xs border shadow rounded">
        <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value, fill }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.3; // Adjust radius to position outside
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={fill} // Use the segment's color
      fontSize="12"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className={x > cx ? 'ps-3' : 'pe-1'}
    >
      {`${name}: ${value} (${(percent * 100).toFixed(0)})%`}
    </text>
  );
};

const PieChartCard = ({ title, data, className, loading, onClick }: PieChartCardProps) => {
  if (loading) {
    return (
      <Card className={cn("hover-lift", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] w-full">
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className={cn("hover-lift", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true} // Enable label lines
                label={renderCustomizedLabel} // Use custom label with name
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onClick={onClick}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChartCard;