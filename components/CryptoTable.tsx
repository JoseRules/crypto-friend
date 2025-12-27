'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Coin, SortColumn, SortDirection } from '@/types/ui';
import MagnifyingGlass from '@/assets/icons/MagnifyingGlass';
import XSign from '@/assets/icons/XSign';
import SortIndicator from '@/assets/icons/SortIndicator';
import { formatPrice, formatVolume, truncateName } from '@/utils/format';

interface CryptoTableProps {  
  data: Coin[];
}

const ITEMS_PER_PAGE = 15;
const DESKTOP_COLUMNS: SortColumn[] = ['Name', 'Symbol', 'Price', 'Price Change', 'Volume'];

export default function CryptoTable({ data }: CryptoTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (!searchTerm) return true;
      const symbol = item.symbol.toLowerCase();
      const coinName = item.name.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      return symbol.includes(searchLower) || coinName.includes(searchLower);
    });
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      if (!sortColumn) {
        const keyA = a.coinGeckoId || `${a.symbol}-${a.name}`;
        const keyB = b.coinGeckoId || `${b.symbol}-${b.name}`;
        return keyA.localeCompare(keyB);
      }
      
      let comparison = 0;
      switch (sortColumn) {
        case 'Name': {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        }
        case 'Symbol': {
          const symbolA = a.symbol.toLowerCase();
          const symbolB = b.symbol.toLowerCase();
          comparison = symbolA.localeCompare(symbolB);
          break;
        }
        case 'Price': {
          comparison = parseFloat(a.lastPrice) - parseFloat(b.lastPrice);
          break;
        }
        case 'Price Change': {
          comparison = parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent);
          break;
        }
        case 'Volume': {
          comparison = parseFloat(a.volume) - parseFloat(b.volume);
          break;
        }
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredData, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = sortedData.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    //Showing always the first page
    pages.push(1);
    if (currentPage > 3) {
      pages.push('...');
    }
    //Showing pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    //Showing always the last page
    pages.push(totalPages);
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
          <MagnifyingGlass className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary transition-colors"
              aria-label="Clear search"
            >
              <XSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="w-full max-w-6xl bg-foreground rounded-lg p-2 sm:p-6 overflow-visible">
        <div className="min-w-full">
          <table className="w-full border-collapse table-fixed sm:table-auto">
            {/* Desktop Header */}
            <thead className="hidden sm:table-header-group">
              <tr className="border-b border-foreground/30">
                {DESKTOP_COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="text-left py-3 px-4 text-primary font-semibold text-sm sm:text-base cursor-pointer hover:bg-foreground/10 transition-colors select-none"
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center">
                      {column}
                      <SortIndicator column={column} sortColumn={sortColumn} sortDirection={sortDirection} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            {/* Mobile Header */}
            <thead className="table-header-group sm:hidden">
              <tr className="border-b border-foreground/30">
                <th className="text-left py-2 px-2 text-primary font-semibold text-xs w-[60%]">Coin</th>
                <th className="text-right py-2 px-2 text-primary font-semibold text-xs w-[40%]">Price</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item: Coin) => {
                const symbol = item.symbol;
                const priceChange = parseFloat(item.priceChangePercent);
                const isPositive = priceChange >= 0;

                return (
                  <tr
                    key={item.coinGeckoId || `${item.symbol}-${item.name}`}
                    onClick={() => router.push(`/crypto/${symbol}`)}
                    className="border-b border-foreground/20 hover:bg-foreground/10 transition-colors cursor-pointer"
                  >
                    {/* Desktop Columns */}
                    <td className="hidden sm:table-cell py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Image
                          alt={`${item.name} logo`}
                          width={24}
                          height={24}
                          loading="lazy"
                          src={item.image || `https://assets.coingecko.com/coins/images/1/small/bitcoin.png`}
                          className="flex-shrink-0 h-6 w-6"
                        />
                        <span className="text-primary font-medium text-sm sm:text-base whitespace-nowrap">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell py-4 px-4">
                      <span className="text-secondary text-sm sm:text-base font-medium">{symbol}</span>
                    </td>
                    <td className="hidden sm:table-cell py-4 px-4 text-right">
                      <span className="text-primary text-sm sm:text-base font-medium">
                        ${formatPrice(item.lastPrice)}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell py-4 px-4 text-right">
                      <span
                        className={`text-sm sm:text-base font-semibold ${isPositive ? 'text-success' : 'text-danger'
                          }`}
                      >
                        {isPositive ? '+' : ''}{parseFloat(item.priceChangePercent).toFixed(2)}%
                      </span>
                    </td>
                    <td className="hidden sm:table-cell py-4 px-4 text-right">
                      <span className="text-secondary text-sm sm:text-base">
                        {formatVolume(item.volume)}
                      </span>
                    </td>

                    {/* Mobile Columns */}
                    <td className="table-cell sm:hidden py-2.5 px-2">
                      <div className="flex items-center gap-1.5">
                        <Image
                          alt={`${item.name} logo`}
                          width={28}
                          height={28}
                          loading="lazy"
                          src={item.image || `https://assets.coingecko.com/coins/images/1/small/bitcoin.png`}
                          className="flex-shrink-0 h-7 w-7"
                        />
                        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                          <span className="text-primary font-semibold text-xs leading-tight">
                            {truncateName(item.name, 12)}
                          </span>
                          <span className="text-secondary text-[10px] font-medium leading-tight truncate">{symbol}</span>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell sm:hidden py-2.5 px-2 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-primary font-semibold text-xs leading-tight">
                          ${formatPrice(item.lastPrice)}
                        </span>
                        <span
                          className={`text-[10px] font-semibold leading-tight ${isPositive ? 'text-success' : 'text-danger'
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 sm:mt-6 w-full max-w-6xl">
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
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
              ? 'bg-foreground/30 text-secondary cursor-not-allowed'
              : 'bg-foreground text-primary hover:bg-accent hover:text-button-text'
              }`}
            aria-label="Previous page"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-secondary text-sm hidden sm:inline">
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`min-w-[36px] sm:min-w-[40px] px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                    ? 'bg-accent text-button-text'
                    : 'bg-foreground text-primary hover:bg-foreground/80 hidden sm:inline'
                    }`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
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

