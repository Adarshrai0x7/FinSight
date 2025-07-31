import yfinance as yf
import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.metrics import mean_squared_error
import numpy as np
import math

def run_forecast(ticker: str, start_date: str, end_date: str, forecast_days: int):
    try:
        print(f"Fetching data for {ticker} from {start_date} to {end_date}")
        df = yf.download(ticker, start=start_date, end=end_date)

        if df.empty:
            raise ValueError("No data fetched. Check ticker symbol or date range.")

        df = df['Close'].dropna()

        # Fit SARIMAX model
        model = SARIMAX(df, order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
        results = model.fit(disp=False)

        # Forecast future values
        forecast = results.get_forecast(steps=forecast_days)
        forecast_mean = forecast.predicted_mean
        forecast_mean.index = pd.date_range(
            start=df.index[-1] + pd.Timedelta(days=1),
            periods=forecast_days,
            freq='B'  # Business days
        )
        forecast_ci = forecast.conf_int()
        forecast_ci.columns = ['lower_bound', 'upper_bound']
        forecast_ci.index = forecast_mean.index

        # Prepare forecast dataframe
        forecast_df = pd.DataFrame({
            "date": forecast_mean.index.strftime('%Y-%m-%d'),
            "forecast": forecast_mean.values,
            "lower_bound": forecast_ci['lower_bound'].values,
            "upper_bound": forecast_ci['upper_bound'].values
        })

        # Calculate model evaluation metrics on training set
        predicted = results.fittedvalues
        actual = df

        mse = mean_squared_error(actual, predicted)
        rmse = math.sqrt(mse)
        mean_actual = actual.mean()
        percent_rmse = (rmse / mean_actual) * 100



        return {
            "ticker": ticker,
            "forecast_start": df.index[-1].strftime('%Y-%m-%d'),
            "last_observed_price": round(df.iloc[-1], 2),
            "forecast_days": forecast_days,
            "forecast": forecast_df.to_dict(orient="records"),
            "metrics": {
                "mse": round(mse, 2),
                "rmse": round(rmse, 2)
            },
            "model_info": {
                "order": "(1, 1, 1)",
                "seasonal_order": "(1, 1, 1, 12)",
                "percent_rmse": round(percent_rmse, 2)
            }
        }
    except Exception as e:
        print(f"Error during forecasting: {e}")
        return {
            "error": f"Forecasting failed: {str(e)}",
            "ticker": ticker
        }
