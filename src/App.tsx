import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StockCard } from './components/StockCard';
import { StockModal } from './components/StockModal';
import { StockForecast } from './types/forecast';
import { loadForecastData } from './utils/csvParser';
import { calculateStats } from './utils/calculations';
import { Loader2, AlertCircle } from 'lucide-react';

function App() {
  const [forecasts, setForecasts] = useState<StockForecast[]>([]);
  const [selectedForecast, setSelectedForecast] = useState<StockForecast | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadForecastData();
        
        const forecastList: StockForecast[] = Object.entries(data).map(([symbol, forecastData]) => ({
          symbol,
          data: forecastData,
          stats: calculateStats(forecastData),
        }));

        setForecasts(forecastList);
      } catch (err) {
        setError('Failed to load forecast data. Please ensure CSV files are available.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCardClick = (forecast: StockForecast) => {
    setSelectedForecast(forecast);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedForecast(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading forecast data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-danger-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Market Forecasts</h2>
          <p className="text-gray-600">
            AI-powered stock price predictions for the next 30 days using TimeGPT technology.
          </p>
        </div>

        {forecasts.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No forecast data available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forecasts.map((forecast) => (
              <StockCard
                key={forecast.symbol}
                forecast={forecast}
                onClick={() => handleCardClick(forecast)}
              />
            ))}
          </div>
        )}
      </main>

      <StockModal
        forecast={selectedForecast}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;