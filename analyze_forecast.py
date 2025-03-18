import pandas as pd
import matplotlib.pyplot as plt

# ✅ Change this filename to your generated forecast file
csv_filename = "_forecast.csv"  # Update accordingly

# ✅ Load Forecast CSV
df = pd.read_csv(csv_filename)

# ✅ Print available columns for debugging
print("✅ Available Columns in CSV:", df.columns.tolist())

# ✅ Convert 'ds' to datetime format for proper plotting
df["ds"] = pd.to_datetime(df["ds"])

# ✅ Select the correct forecast column dynamically
forecast_col = None
if "TimeGPT" in df.columns:  # Use TimeGPT instead of yhat
    forecast_col = "TimeGPT"
else:
    raise ValueError("❌ No valid forecast column found in CSV!")

# ✅ Plot the forecast
plt.figure(figsize=(10, 5))
plt.plot(df["ds"], df[forecast_col], marker="o", linestyle="-", label="Forecasted Price", color="blue")

# ✅ Formatting
plt.xlabel("Date")
plt.ylabel("Predicted Price")
plt.title(f"Stock Price Forecast for {csv_filename.split('_')[0]}")
plt.xticks(rotation=45)
plt.legend()
plt.grid()
plt.show()
