"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";

const ForecastPanel = ({ forecast }: { forecast: any }) => {
  if (!forecast || !forecast.forecast) return null;

  const modelOrder = forecast.model_info?.order ?? "N/A";
  const seasonalOrder = forecast.model_info?.seasonal_order ?? "N/A";
  const mse = typeof forecast.metrics?.mse === "number" ? forecast.metrics.mse.toFixed(2) : "N/A";
  const rmse = typeof forecast.metrics?.rmse === "number" ? forecast.metrics.rmse.toFixed(2) : "N/A";

  const lastPrice = forecast.last_observed_price || 1;
  

  const chartData = forecast.forecast.map((d: any) => ({
    date: d.date,
    forecast: d.forecast,
    lower: d.lower_bound,
    upper: d.upper_bound,
  }));

  return (
    <div className="bg-gray-800 text-white mt-4 p-4 rounded-lg max-h-[480px] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">Forecast Summary</h2>
      <p><strong>Model:</strong> SARIMAX</p>
      <p><strong>Order:</strong> {modelOrder}</p>
      <p><strong>Seasonal Order:</strong> {seasonalOrder}</p>
      <p><strong>MSE:</strong> {mse}</p>
      <p><strong>RMSE:</strong> {rmse}</p>
      
      <div className="mt-4">
        <h3 className="text-md font-semibold mb-1">Forecast Chart</h3>
<ResponsiveContainer width="100%" height={220}>
  <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
    <defs>
      <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
      </linearGradient>
    </defs>
    <XAxis
      dataKey="date"
      tick={{ fontSize: 10, fill: "#cbd5e1" }}
      tickLine={false}
      axisLine={false}
    />
    <YAxis
      tick={{ fontSize: 10, fill: "#cbd5e1" }}
      tickLine={false}
      axisLine={false}
      domain={["auto", "auto"]}
    />
    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
    <Tooltip
      contentStyle={{ backgroundColor: "#1e293b", border: "none", fontSize: "12px" }}
      labelStyle={{ color: "#38bdf8" }}
      itemStyle={{ color: "#e2e8f0" }}
    />
    <Area
      type="monotone"
      dataKey="forecast"
      stroke="#38bdf8"
      fill="url(#colorForecast)"
      strokeWidth={2}
      dot={{ r: 1 }}
      activeDot={{ r: 3 }}
    />
  </AreaChart>
</ResponsiveContainer>

      </div>
    </div>
  );
};

export default ForecastPanel;
