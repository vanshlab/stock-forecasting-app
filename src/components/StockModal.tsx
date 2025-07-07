import React from 'react';
import { X, TrendingUp, TrendingDown, Minus, Calendar, DollarSign, Activity } from 'lucide-react';
import { StockForecast } from '../types/forecast';
import { ForecastChart } from './ForecastChart';
import { formatPrice, formatDate } from '../utils/calculations';

interface StockModalProps {
  forecast: StockForecast | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StockModal: React.FC<StockModalProps> = ({ forecast, isOpen, onClose }) => {
  if (!isOpen || !forecast) return null;

  const { symbol, data, stats } = forecast;
  
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
        return 'text-success-600 bg-success-50 border-success-200';
      case 'down':
        return 'text-danger-600 bg-danger-50 border-danger-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const firstDate = data[0]?.ds;
  const lastDate = data[data.length - 1]?.ds;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">{symbol}</h2>
              <div className={`px-3 py-1 rounded-full border flex items-center space-x-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-sm font-medium capitalize">{stats.trend}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-4">
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium text-gray-600">Average Price</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.avgPrice)}</p>
            </div>

            <div className="card p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Activity className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium text-gray-600">Volatility</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.volatility)}</p>
            </div>

            <div className="card p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium text-gray-600">Forecast Period</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDays} days</p>
            </div>
          </div>

          <div className="card p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Forecast Chart</h3>
            <ForecastChart data={data} symbol={symbol} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Price</span>
                  <span className="font-semibold">{formatPrice(stats.minPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maximum Price</span>
                  <span className="font-semibold">{formatPrice(stats.maxPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Range</span>
                  <span className="font-semibold">{formatPrice(stats.priceRange)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Price</span>
                  <span className="font-semibold">{formatPrice(stats.avgPrice)}</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-semibold">{formatDate(firstDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date</span>
                  <span className="font-semibold">{formatDate(lastDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Days</span>
                  <span className="font-semibold">{stats.totalDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trend Direction</span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon()}
                    <span className="font-semibold capitalize">{stats.trend}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};