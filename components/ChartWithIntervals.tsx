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
    interval: '1',
    limit: 24,
    timeFormat: 'hour'
  },
  '7d': {
    label: '7 Days',
    interval: '7',
    limit: 42,
    timeFormat: 'day'
  },
  '1m': {
    label: '1 Month',
    interval: '30',
    limit: 30,
    timeFormat: 'day'
  },
  '3m': {
    label: '3 Months',
    interval: '90',
    limit: 90,
    timeFormat: 'day'
  },
  '1y': {
    label: '1 Year',
    interval: '365',
    limit: 52,
    timeFormat: 'week'
  }
};

interface ChartWithIntervalsProps {
  baseSymbol: string;
  coinGeckoId: string;
  isPositive: boolean;
  initialKlines: KlineData[];
}

export default function ChartWithIntervals({ 
  baseSymbol, 
  coinGeckoId,
  isPositive, 
  initialKlines 
}: ChartWithIntervalsProps) {
  const [selectedInterval, setSelectedInterval] = useState<string>('1d');
  const [klines, setKlines] = useState<KlineData[]>(initialKlines);
  const [loading, setLoading] = useState(false);

  const fetchKlines = async (intervalKey: string) => {
    if (!coinGeckoId || !baseSymbol) return;
    
    setLoading(true);
    try {
      const config = INTERVALS[intervalKey];
      const days = parseInt(config.interval);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const res = await fetch(
        `/api/crypto/${baseSymbol}/klines?days=${days}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch klines: ${res.status} ${res.statusText}`
        );
      }
      
      let convertedKlines: KlineData[];
      try {
        convertedKlines = await res.json();
      } catch (jsonError) {
        console.error('Failed to parse klines JSON response:', jsonError);
        throw new Error('Invalid response format from server');
      }
      
      if (!Array.isArray(convertedKlines) || convertedKlines.length === 0) {
        console.warn(`No klines data received for ${baseSymbol} (${config.label})`);
        return;
      }
      
      setKlines(convertedKlines);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error(`Request timeout while fetching klines for ${baseSymbol}`);
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error(`Network error fetching klines for ${baseSymbol}:`, error.message);
        } else {
          console.error(`Error fetching klines for ${baseSymbol}:`, error.message);
        }
      } else {
        console.error('Unknown error fetching klines:', error);
      }
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
      {/* Interval Buttons */}
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
            <p className="text-primary text-sm sm:text-base">Loading chart data...</p>
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

