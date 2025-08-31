import os
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt
from nixtla import NixtlaClient

# Replace with your API key
key = 'nixak-oe7kXV1rgAfSGBESpowggRA5m2HnKmKc8CFECAxEsqIC5lErcroQRw2htfndCFLEnZ60DBacHGwfOvfr'
if not key:
    raise ValueError("API key is missing.")

# Initialize client
client = NixtlaClient(api_key=key)

# Load S&P 500 stock list
url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
stocks_df = pd.read_html(url, header=0)[0]
symbols = stocks_df["Symbol"].tolist()

# Forecasts a stock
def forecast(ticker):
    print(f"Fetching data for {ticker}...")

    # Fetch last year of stock data
    hist_data = yf.download(ticker, period="1y", interval="1d", auto_adjust=True)

    # Check for valid data
    if hist_data.empty or "Close" not in hist_data.columns:
        print(f"Skipping {ticker}, no data found.")
        return None, None

    # Format data for forecasting
    hist_data = hist_data.reset_index()[["Date", "Close"]]
    hist_data.columns = ["ds", "y"]

    # Resample to daily and fill gaps
    hist_data["ds"] = pd.to_datetime(hist_data["ds"])
    hist_data = hist_data.set_index("ds").asfreq("D").reset_index()
    hist_data["y"] = hist_data["y"].interpolate()

    # Calculate moving average
    hist_data["ema"] = hist_data["y"].ewm(span=10, adjust=False).mean()

    # Forecast next 30 days
    try:
        fcst_df = client.forecast(df=hist_data[["ds", "y"]], h=30, time_col="ds", target_col="y")

        # Debugging print
        print(fcst_df.head())

        if "TimeGPT" not in fcst_df.columns:
            print(f"Forecast failed for {ticker}: Missing 'TimeGPT' column.")
            return None, None

        print(f"Forecast successful for {ticker}.")
        return hist_data, fcst_df

    except Exception as e:
        print(f"Forecast failed for {ticker}: {e}")
        return None, None

# Plots the forecast
def plot(hist, fcst, ticker):
    if hist is None or fcst is None:
        print("No data to plot.")
        return

    plt.figure(figsize=(12, 6))
    plt.plot(hist["ds"], hist["y"], marker="o", linestyle="-", label="Actual Prices", color="black")
    plt.plot(hist["ds"], hist["ema"], linestyle="--", label="EMA (Trend Line)", color="orange")
    plt.plot(fcst["ds"], fcst["TimeGPT"], marker="o", linestyle="--", label="Forecasted Prices", color="blue")

    plt.xlabel("Date")
    plt.ylabel("Stock Price (USD)")
    plt.title(f"{ticker} Stock Price Forecast")
    plt.legend()
    plt.grid(True)

    print("Showing plot...")
    plt.show(block=True)

# Main loop to get user input
while True:
    ticker = input("Enter stock ticker or 'exit' to stop: ").upper()
    if ticker == "EXIT":
        break
    elif ticker not in symbols:
        print("Invalid ticker. Please use an S&P 500 symbol.")
        continue

    # Get forecast
    hist, fcst = forecast(ticker)

    # Save results to a file
    if fcst is not None:
        fcst.to_csv(f"{ticker}_forecast.csv", index=False)
        print(f"Forecast saved to {ticker}_forecast.csv")

    # Show plot
    plot(hist, fcst, ticker)

print("Forecasting finished.")
