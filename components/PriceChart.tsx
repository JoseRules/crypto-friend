'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export type KlineData = [
  number,    // Open time
  string,    // Open
  string,    // High
  string,    // Low
  string,    // Close
  string,    // Volume
  number,    // Close time
  string,    // Quote asset volume
  number,    // Number of trades
  string,    // Taker buy base asset volume
  string,    // Taker buy quote asset volume
  string     // Ignore
];

type ChartDataPoint = {
  time: string;
  price: number;
  volume: number;
};

interface PriceChartProps {
  klines: KlineData[];
  isPositive: boolean;
  timeFormat?: 'hour' | 'day' | 'week' | 'month';
}

export default function PriceChart({ klines, isPositive, timeFormat = 'hour' }: PriceChartProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check current theme
    const theme = document.documentElement.getAttribute('data-theme');
    setIsDark(theme === 'dark');
    
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setIsDark(currentTheme === 'dark');
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

  // Get theme-aware colors
  const successColor = isDark ? '#5e9961' : '#7ecd7b';
  const dangerColor = isDark ? '#7d230d' : '#9c2e1f';
  const lineColor = isPositive ? successColor : dangerColor;

  // Format time based on interval
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    
    switch (timeFormat) {
      case 'hour':
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      case 'day':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      case 'week':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: '2-digit'
        });
      case 'month':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
      default:
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
    }
  };

  // Transform klines data for the chart
  const chartData: ChartDataPoint[] = klines.map((kline) => {
    const closeTime = kline[6];
    
    return {
      time: formatTime(closeTime),
      price: parseFloat(kline[4]), // Close price
      volume: parseFloat(kline[5]), // Volume
    };
  });

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-foreground border border-foreground/20 rounded-lg p-3 shadow-lg">
          <p className="text-primary font-semibold text-sm">
            ${payload[0].value.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 8 
            })}
          </p>
          <p className="text-secondary text-xs mt-1">
            {payload[0].payload.time}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
        <XAxis 
          dataKey="time" 
          stroke="currentColor"
          strokeOpacity={0.5}
          style={{ fontSize: '12px' }}
          tick={{ fill: 'currentColor', fillOpacity: 0.6 }}
        />
        <YAxis 
          stroke="currentColor"
          strokeOpacity={0.5}
          style={{ fontSize: '12px' }}
          tick={{ fill: 'currentColor', fillOpacity: 0.6 }}
          domain={['dataMin', 'dataMax']}
          tickFormatter={(value) => `$${value.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ 
            r: 4,
            fill: lineColor,
            strokeWidth: 2,
            stroke: isDark ? '#1f1616' : '#ffffff'
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

