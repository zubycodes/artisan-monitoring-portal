
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils'; import { Loader2 } from 'lucide-react';
interface BarChartCardProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
  }>;
  color?: string;
  className?: string;
  loading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 text-xs border shadow rounded">
        <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];


const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, fill }) => {
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
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const getPath = (x, y, width, height) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
  Z`;
};

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

const BarChartCard = ({ title, data, color = "#3b82f6", className, loading }: BarChartCardProps) => {
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
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />

              <Bar dataKey="value" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChartCard;
