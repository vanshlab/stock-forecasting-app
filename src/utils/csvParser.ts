import { ForecastData } from '../types/forecast';

export const parseCSVData = (csvContent: string): ForecastData[] => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row: any = {};
    
    headers.forEach((header, index) => {
      const key = header.trim();
      const value = values[index]?.trim();
      
      if (key === 'ds') {
        row[key] = value;
      } else if (key === 'TimeGPT') {
        row[key] = parseFloat(value);
      } else if (key === 'Symbol') {
        row[key] = value;
      }
    });
    
    return row as ForecastData;
  });
};

export const loadForecastData = async (): Promise<{ [key: string]: ForecastData[] }> => {
  const stockSymbols = ['AAPL', 'AMZN', 'F', 'GM', 'GOOGL', 'JPM', 'TSLA', 'V', 'WMT'];
  const forecastData: { [key: string]: ForecastData[] } = {};
  
  for (const symbol of stockSymbols) {
    try {
      const response = await fetch(`/${symbol}_forecast.csv`);
      if (response.ok) {
        const csvContent = await response.text();
        forecastData[symbol] = parseCSVData(csvContent);
      }
    } catch (error) {
      console.warn(`Could not load data for ${symbol}:`, error);
    }
  }
  
  return forecastData;
};