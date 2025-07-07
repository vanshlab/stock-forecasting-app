export interface ForecastData {
  ds: string;
  TimeGPT: number;
  Symbol?: string;
}

export interface StockForecast {
  symbol: string;
  data: ForecastData[];
  stats: {
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    priceRange: number;
    trend: 'up' | 'down' | 'stable';
    volatility: number;
    totalDays: number;
  };
}