'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { COIN_NAMES } from '@/utils/coins';

type Repo = {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string; 
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;    
  lastId: number;
  count: number;
};

interface CryptoTableProps {
  data: Repo[];
}

const ITEMS_PER_PAGE = 15;

type SortColumn = 'name' | 'symbol' | 'price' | 'priceChange' | 'volume' | null;
type SortDirection = 'asc' | 'desc';

export default function CryptoTable({ data }: CryptoTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    
    const symbol = item.symbol.replace('USDT', '').toLowerCase();
    const coinName = (COIN_NAMES[symbol.toUpperCase()] || symbol).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return symbol.includes(searchLower) || coinName.includes(searchLower);
  });

  // Sort filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    let comparison = 0;

    switch (sortColumn) {
      case 'name': {
        const symbolA = a.symbol.replace('USDT', '');
        const symbolB = b.symbol.replace('USDT', '');
        const nameA = (COIN_NAMES[symbolA.toUpperCase()] || symbolA).toLowerCase();
        const nameB = (COIN_NAMES[symbolB.toUpperCase()] || symbolB).toLowerCase();
        comparison = nameA.localeCompare(nameB);
        break;
      }
      case 'symbol': {
        const symbolA = a.symbol.replace('USDT', '').toLowerCase();
        const symbolB = b.symbol.replace('USDT', '').toLowerCase();
        comparison = symbolA.localeCompare(symbolB);
        break;
      }
      case 'price': {
        comparison = parseFloat(a.lastPrice) - parseFloat(b.lastPrice);
        break;
      }
      case 'priceChange': {
        comparison = parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent);
        break;
      }
      case 'volume': {
        comparison = parseFloat(a.volume) - parseFloat(b.volume);
        break;
      }
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Handle column header click
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
    // Reset to page 1 when sorting changes
    setCurrentPage(1);
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Sort indicator component (hidden on mobile)
  const SortIndicator = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-3 h-3 ml-1 text-secondary opacity-50 hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-3 h-3 ml-1 text-accent hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 ml-1 text-accent hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 8 
    });
  };

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Maximum visible page numbers
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="w-full max-w-6xl mb-4 sm:mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by symbol or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-foreground text-primary placeholder:text-secondary border border-foreground/20 rounded-lg px-4 py-3 pl-10 sm:pl-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
          <svg
            className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="w-full max-w-6xl bg-foreground rounded-lg p-2 sm:p-6 overflow-visible">
        <div className="min-w-full">
          <table className="w-full border-collapse">
            {/* Desktop Header */}
            <thead className="hidden sm:table-header-group">
              <tr className="border-b border-foreground/30">
                <th 
                  className="text-left py-3 px-4 text-primary font-semibold text-sm sm:text-base cursor-pointer hover:bg-foreground/10 transition-colors select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    <SortIndicator column="name" />
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 text-primary font-semibold text-sm sm:text-base cursor-pointer hover:bg-foreground/10 transition-colors select-none"
                  onClick={() => handleSort('symbol')}
                >
                  <div className="flex items-center">
                    Symbol
                    <SortIndicator column="symbol" />
                  </div>
                </th>
                <th 
                  className="text-right py-3 px-4 text-primary font-semibold text-sm sm:text-base cursor-pointer hover:bg-foreground/10 transition-colors select-none"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end">
                    Price
                    <SortIndicator column="price" />
                  </div>
                </th>
                <th 
                  className="text-right py-3 px-4 text-primary font-semibold text-sm sm:text-base cursor-pointer hover:bg-foreground/10 transition-colors select-none"
                  onClick={() => handleSort('priceChange')}
                >
                  <div className="flex items-center justify-end">
                    Price Change
                    <SortIndicator column="priceChange" />
                  </div>
                </th>
                <th 
                  className="text-right py-3 px-4 text-primary font-semibold text-sm sm:text-base cursor-pointer hover:bg-foreground/10 transition-colors select-none"
                  onClick={() => handleSort('volume')}
                >
                  <div className="flex items-center justify-end">
                    Volume
                    <SortIndicator column="volume" />
                  </div>
                </th>
              </tr>
            </thead>
            {/* Mobile Header */}
            <thead className="table-header-group sm:hidden">
              <tr className="border-b border-foreground/30">
                <th className="text-left py-2 px-3 text-primary font-semibold text-xs">Coin</th>
                <th className="text-right py-2 px-3 text-primary font-semibold text-xs">Price</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item: Repo) => {
                const symbol = item.symbol.replace('USDT', '');
                const priceChange = parseFloat(item.priceChangePercent);
                const isPositive = priceChange >= 0;
                
                return (
                  <tr 
                    key={item.symbol}
                    onClick={() => router.push(`/crypto/${symbol}`)}
                    className="border-b border-foreground/20 hover:bg-foreground/10 transition-colors cursor-pointer"
                  >
                    {/* Desktop: Name Column */}
                    <td className="hidden sm:table-cell py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Image 
                          alt={`${COIN_NAMES[symbol] || symbol} logo`}
                          width={24}
                          height={24}
                          loading="lazy"
                          src={`https://bin.bnbstatic.com/static/assets/logos/${symbol}.png`}
                          className="flex-shrink-0 h-6 w-6"
                        />
                        <span className="text-primary font-medium text-sm sm:text-base whitespace-nowrap">
                          {COIN_NAMES[symbol] || symbol}
                        </span>
                      </div>
                    </td>
                    {/* Desktop: Symbol Column */}
                    <td className="hidden sm:table-cell py-4 px-4">
                      <span className="text-secondary text-sm sm:text-base font-medium">{symbol}</span>
                    </td>
                    {/* Desktop: Price Column */}
                    <td className="hidden sm:table-cell py-4 px-4 text-right">
                      <span className="text-primary text-sm sm:text-base font-medium">
                        ${formatPrice(item.lastPrice)}
                      </span>
                    </td>
                    {/* Desktop: Price Change Column */}
                    <td className="hidden sm:table-cell py-4 px-4 text-right">
                      <span 
                        className={`text-sm sm:text-base font-semibold ${
                          isPositive ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {isPositive ? '+' : ''}{parseFloat(item.priceChangePercent).toFixed(2)}%
                      </span>
                    </td>
                    {/* Desktop: Volume Column */}
                    <td className="hidden sm:table-cell py-4 px-4 text-right">
                      <span className="text-secondary text-sm sm:text-base">
                        {formatVolume(item.volume)}
                      </span>
                    </td>
                    
                    {/* Mobile: Combined Name/Symbol Column */}
                    <td className="table-cell sm:hidden py-3 px-3">
                      <div className="flex items-center gap-2">
                        <Image 
                          alt={`${COIN_NAMES[symbol] || symbol} logo`}
                          width={32}
                          height={32}
                          loading="lazy"
                          src={`https://bin.bnbstatic.com/static/assets/logos/${symbol}.png`}
                          className="flex-shrink-0 h-8 w-8"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-primary font-semibold text-sm truncate">
                            {COIN_NAMES[symbol] || symbol}
                          </span>
                          <span className="text-secondary text-xs font-medium">{symbol}</span>
                        </div>
                      </div>
                    </td>
                    {/* Mobile: Combined Price/Price Change Column */}
                    <td className="table-cell sm:hidden py-3 px-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-primary font-semibold text-sm">
                          ${formatPrice(item.lastPrice)}
                        </span>
                        <span 
                          className={`text-xs font-semibold ${
                            isPositive ? 'text-success' : 'text-danger'
                          }`}
                        >
                          {isPositive ? '+' : ''}{parseFloat(item.priceChangePercent).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 sm:mt-6 w-full max-w-6xl">
        {/* Page Info */}
        <div className="text-secondary text-sm sm:text-base">
          {sortedData.length === 0 ? (
            <span>No results found</span>
          ) : (
            <span>
              Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} result{sortedData.length !== 1 ? 's' : ''}
              {searchTerm && ` (filtered from ${data.length} total)`}
            </span>
          )}
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'bg-foreground/30 text-secondary cursor-not-allowed'
                : 'bg-foreground text-primary hover:bg-accent hover:text-button-text'
            }`}
            aria-label="Previous page"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 sm:gap-2">
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-secondary text-sm">
                    ...
                  </span>
                );
              }
              
              const pageNum = page as number;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`min-w-[36px] sm:min-w-[40px] px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-accent text-button-text'
                      : 'bg-foreground text-primary hover:bg-foreground/80'
                  }`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? 'bg-foreground/30 text-secondary cursor-not-allowed'
                : 'bg-foreground text-primary hover:bg-accent hover:text-button-text'
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

