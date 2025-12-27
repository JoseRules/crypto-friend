export const formatPrice = (price: string) => {
  const num = parseFloat(price);
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 8 
  });
};

export const formatVolume = (volume: string) => {
  const num = parseFloat(volume);
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

export const truncateName = (name: string, maxLength: number = 12): string => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength) + '...';
};
