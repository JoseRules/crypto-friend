'use client';

import { useState, useEffect } from 'react';
import PriceChart from './PriceChart';
import type { KlineData } from './PriceChart';

type IntervalConfig = {
  label: string;
  interval: string;
  limit: number;
  timeFormat: 'hour' | 'day' | 'week' | 'month';
};

const INTERVALS: Record<string, IntervalConfig> = {
  '1d': {
    label: '1 Day',
    interval: '1h',
    limit: 24,
    timeFormat: 'hour'
  },
  '7d': {
    label: '7 Days',
    interval: '4h',
    limit: 42, // 7 days * 6 intervals per day
    timeFormat: 'day'
  },
  '1m': {
    label: '1 Month',
    interval: '1d',
    limit: 30,
    timeFormat: 'day'
  },
  '3m': {
    label: '3 Months',
    interval: '1d',
    limit: 90,
    timeFormat: 'day'
  },
  '1y': {
    label: '1 Year',
    interval: '1w',
    limit: 52,
    timeFormat: 'week'
  }
};

interface ChartWithIntervalsProps {
  baseSymbol: string;
  isPositive: boolean;
  initialKlines: KlineData[];
}

export default function ChartWithIntervals({ 
  baseSymbol, 
  isPositive, 
  initialKlines 
}: ChartWithIntervalsProps) {
  const [selectedInterval, setSelectedInterval] = useState<string>('1d');
  const [klines, setKlines] = useState<KlineData[]>(initialKlines);
  const [loading, setLoading] = useState(false);

  const fetchKlines = async (intervalKey: string) => {
    setLoading(true);
    try {
      const config = INTERVALS[intervalKey];
      const symbol = `${baseSymbol}USDT`;
      
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${config.interval}&limit=${config.limit}`
      );
      
      if (!res.ok) throw new Error('Failed to fetch klines');
      
      const data = await res.json();
      setKlines(data);
    } catch (error) {
      console.error('Error fetching klines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedInterval === '1d') {
      setKlines(initialKlines);
    } else {
      fetchKlines(selectedInterval);
    }
  }, [selectedInterval, baseSymbol, initialKlines]);

  return (
    <div>
      {/* Interval Selection Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(INTERVALS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedInterval(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedInterval === key
                ? 'bg-accent text-button-text'
                : 'bg-background text-primary hover:bg-foreground/50 border border-foreground/20'
            }`}
            disabled={loading}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full h-64 sm:h-96 bg-background rounded-lg border border-foreground/20 p-4">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-secondary text-sm sm:text-base">Loading chart data...</p>
          </div>
        ) : (
          <PriceChart 
            klines={klines} 
            isPositive={isPositive}
            timeFormat={INTERVALS[selectedInterval].timeFormat}
          />
        )}
      </div>
    </div>
  );
}

