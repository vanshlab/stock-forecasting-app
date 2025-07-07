import { ForecastData, StockForecast } from '../types/forecast';

export const calculateStats = (data: ForecastData[]): StockForecast['stats'] => {
  if (data.length === 0) {
    return {
      avgPrice: 0,
      minPrice: 0,
      maxPrice: 0,
      priceRange: 0,
      trend: 'stable',
      volatility: 0,
      totalDays: 0,
    };
  }

  const prices = data.map(d => d.TimeGPT);
  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  // Calculate trend based on first and last values
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100;
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (priceChange > 1) trend = 'up';
  else if (priceChange < -1) trend = 'down';

  // Calculate volatility (standard deviation)
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / prices.length;
  const volatility = Math.sqrt(variance);

  return {
    avgPrice,
    minPrice,
    maxPrice,
    priceRange,
    trend,
    volatility,
    totalDays: data.length,
  };
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};