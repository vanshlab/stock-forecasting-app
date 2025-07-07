import React from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { StockForecast } from '../types/forecast';
import { formatPrice } from '../utils/calculations';

interface StockCardProps {
  forecast: StockForecast;
  onClick: () => void;
}

export const StockCard: React.FC<StockCardProps> = ({ forecast, onClick }) => {
  const { symbol, stats } = forecast;
  
  const getTrendIcon = () => {
    switch (stats.trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-success-600" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-danger-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (stats.trend) {
      case 'up':
        return 'text-success-600 bg-success-50';
      case 'down':
        return 'text-danger-600 bg-danger-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div 
      className="card p-6 cursor-pointer hover:scale-[1.02] transition-transform duration-200 animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{symbol}</h3>
            <p className="text-sm text-gray-500">{stats.totalDays} day forecast</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full flex items-center space-x-1 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-medium capitalize">{stats.trend}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Average Price</span>
          <span className="font-semibold text-gray-900">{formatPrice(stats.avgPrice)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Price Range</span>
          <span className="text-sm text-gray-700">
            {formatPrice(stats.minPrice)} - {formatPrice(stats.maxPrice)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Volatility</span>
          <span className="text-sm text-gray-700">{formatPrice(stats.volatility)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center text-primary-600 hover:text-primary-700 transition-colors">
          <span className="text-sm font-medium">View Details</span>
        </div>
      </div>
    </div>
  );
};