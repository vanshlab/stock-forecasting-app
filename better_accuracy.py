import os
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt
from nixtla import NixtlaClient

# ✅ Set API Key
API_KEY = 'nixak-oe7kXV1rgAfSGBESpowggRA5m2HnKmKc8CFECAxEsqIC5lErcroQRw2htfndCFLEnZ60DBacHGwfOvfr'  # 🔹 Replace with your actual API key
if not API_KEY:
    raise ValueError("❌ API key is missing! Set `API_KEY` before running.")

# ✅ Initialize Nixtla Client
tgt = NixtlaClient(api_key=API_KEY)

# ✅ Load S&P 500 Stock List
sp500_url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
sp500_df = pd.read_html(sp500_url, header=0)[0]
stock_symbols = sp500_df["Symbol"].tolist()

# ✅ Forecasting Function
def forecast_stock(symbol):
    print(f"📊 Fetching data for {symbol}...")

    # Fetch stock data (Last 1 Year)
    data = yf.download(symbol, period="1y", interval="1d", auto_adjust=True)

    # Check if data is empty
    if data.empty or "Close" not in data.columns:
        print(f"⚠️ Skipping {symbol} (No valid data)")
        return None, None

    # ✅ Format Data for TimeGPT
    data = data.reset_index()[["Date", "Close"]]
    data.columns = ["ds", "y"]

    # ✅ Ensure Daily Frequency & Fill Missing Values
    data["ds"] = pd.to_datetime(data["ds"])
    data = data.set_index("ds").asfreq("D").reset_index()
    data["y"] = data["y"].interpolate()  # Fill missing values with linear interpolation

    # ✅ Add Exponential Moving Average (EMA) for Smoother Trends
    data["ema"] = data["y"].ewm(span=10, adjust=False).mean()

    # ✅ Forecast for Next 30 Days
    try:
        forecast_df = tgt.forecast(df=data[["ds", "y"]], h=30, time_col="ds", target_col="y")

        # Debugging: Print first few rows
        print(forecast_df.head())  

        if "TimeGPT" not in forecast_df.columns:
            print(f"❌ Forecast failed for {symbol}: Missing 'TimeGPT' column in forecast data!")
            return None, None

        print(f"✅ Forecasting Successful for {symbol}!")
        return data, forecast_df

    except Exception as e:
        print(f"❌ Forecasting Failed for {symbol}: {e}")
        return None, None

# ✅ Plotting Function
def plot_forecast(actual_df, forecast_df, symbol):
    if actual_df is None or forecast_df is None:
        print("⚠️ No data available to plot!")
        return

    plt.figure(figsize=(12, 6))
    plt.plot(actual_df["ds"], actual_df["y"], marker="o", linestyle="-", label="Actual Prices", color="black")
    plt.plot(actual_df["ds"], actual_df["ema"], linestyle="--", label="EMA (Trend Line)", color="orange")
    plt.plot(forecast_df["ds"], forecast_df["TimeGPT"], marker="o", linestyle="--", label="Forecasted Prices", color="blue")

    plt.xlabel("Date")
    plt.ylabel("Stock Price (USD)")
    plt.title(f"{symbol} Stock Price Forecast")
    plt.legend()
    plt.grid(True)

    print("✅ Displaying the graph...")
    plt.show(block=True)  # Ensures the graph remains open

# ✅ User Input Loop
while True:
    stock_ticker = input("📈 Enter a Stock Ticker (or type 'exit' to stop): ").upper()
    if stock_ticker == "EXIT":
        break
    elif stock_ticker not in stock_symbols:
        print("⚠️ Invalid ticker! Please enter a valid S&P 500 stock symbol.")
        continue

    # Fetch & Forecast
    actual_df, forecast_df = forecast_stock(stock_ticker)

    # Save to CSV
    if forecast_df is not None:
        forecast_df.to_csv(f"{stock_ticker}_forecast.csv", index=False)
        print(f"📊 Forecast for {stock_ticker} saved in '{stock_ticker}_forecast.csv'!")

    # Plot Graph
    plot_forecast(actual_df, forecast_df, stock_ticker)

print("🎯 Stock Forecasting Completed!")  
