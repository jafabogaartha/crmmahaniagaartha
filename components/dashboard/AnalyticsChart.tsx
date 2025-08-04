
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card } from '../ui/Card';

interface AnalyticsChartProps {
  title: string;
  data: any[];
  type: 'bar' | 'line';
  dataKeys: { key: string; color: string }[];
  xAxisKey: string;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ title, data, type, dataKeys, xAxisKey }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-gray-300 dark:border-dark-content/30 rounded-md shadow-lg">
          <p className="font-bold text-neutral dark:text-white">{label}</p>
          {payload.map((pld: any) => (
            <div key={pld.dataKey} style={{ color: pld.fill }}>{`${pld.name}: ${pld.value.toLocaleString()}`}</div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (type === 'bar') {
      return (
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
          <XAxis dataKey={xAxisKey} tick={{ fill: 'currentColor', fontSize: 12 }} />
          <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}/>
          <Legend />
          {dataKeys.map(dk => <Bar key={dk.key} dataKey={dk.key} fill={dk.color} name={dk.key.charAt(0).toUpperCase() + dk.key.slice(1)} radius={[4, 4, 0, 0]} />)}
        </BarChart>
      );
    }
    return (
       <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
        <XAxis dataKey={xAxisKey} tick={{ fill: 'currentColor', fontSize: 12 }}/>
        <YAxis tick={{ fill: 'currentColor', fontSize: 12 }}/>
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}/>
        <Legend />
        {dataKeys.map(dk => <Line key={dk.key} type="monotone" dataKey={dk.key} stroke={dk.color} strokeWidth={2} name={dk.key.charAt(0).toUpperCase() + dk.key.slice(1)} />)}
      </LineChart>
    );
  };

  return (
    <Card className="shadow-neo-sm dark:shadow-dark-neo-sm">
      <h3 className="text-lg font-bold text-neutral dark:text-white mb-4">{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
