"use client";
import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine,
} from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw } from "lucide-react";

interface ForecastPanelProps {
  forecast: any;
  isLoading?: boolean;
}

// ── Loading skeleton ────────────────────────────────────────────────────────
const ForecastSkeleton = () => (
  <div className="bg-gray-800/60 border border-gray-700/40 rounded-xl mt-4 p-4 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-5 w-40 bg-gray-700 rounded" />
      <div className="h-4 w-20 bg-gray-700/60 rounded ml-auto" />
    </div>
    <div className="grid grid-cols-3 gap-3 mb-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-700/50 rounded-lg p-3">
          <div className="h-3 w-16 bg-gray-600 rounded mb-2" />
          <div className="h-5 w-20 bg-gray-600 rounded" />
        </div>
      ))}
    </div>
    <div className="h-48 bg-gray-700/40 rounded-lg flex items-center justify-center text-gray-500 gap-2">
      <RefreshCw className="w-4 h-4 animate-spin" />
      <span className="text-sm">Running SARIMAX model… this may take a moment</span>
    </div>
  </div>
);

// ── Custom tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const forecast = payload.find((p: any) => p.dataKey === "forecast");
  const upper    = payload.find((p: any) => p.dataKey === "upper");
  const lower    = payload.find((p: any) => p.dataKey === "lower");

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {forecast && <p className="text-sky-400 font-semibold">Forecast: ${Number(forecast.value).toFixed(2)}</p>}
      {upper    && <p className="text-emerald-400/70">High: ${Number(upper.value).toFixed(2)}</p>}
      {lower    && <p className="text-red-400/70">Low: ${Number(lower.value).toFixed(2)}</p>}
    </div>
  );
};

const ForecastPanel: React.FC<ForecastPanelProps> = ({ forecast, isLoading = false }) => {
  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) return <ForecastSkeleton />;

  // ── No data ───────────────────────────────────────────────────────────────
  if (!forecast || !forecast.forecast) return null;

  // ── Parse metrics ─────────────────────────────────────────────────────────
  const modelOrder    = forecast.model_info?.order        ?? "N/A";
  const seasonalOrder = forecast.model_info?.seasonal_order ?? "N/A";
  const percentRmseRaw = forecast.model_info?.percent_rmse;
  const percentRmse = percentRmseRaw != null ? parseFloat(String(percentRmseRaw)) : null;

  const mse  = typeof forecast.metrics?.mse  === "number" ? forecast.metrics.mse.toFixed(2)  : "N/A";
  const rmse = typeof forecast.metrics?.rmse === "number" ? forecast.metrics.rmse.toFixed(2) : "N/A";

  // Fix last_observed_price: handle both plain number and {"AAPL": 213.5} object
  let lastPrice: number | null = null;
  if (typeof forecast.last_observed_price === "number") {
    lastPrice = forecast.last_observed_price;
  } else if (typeof forecast.last_observed_price === "object" && forecast.last_observed_price !== null) {
    lastPrice = Object.values(forecast.last_observed_price)[0] as number;
  }

  const forecastEnd   = forecast.forecast[forecast.forecast.length - 1];
  const forecastFirst = forecast.forecast[0];
  const priceChange   = forecastEnd && lastPrice
    ? ((forecastEnd.forecast - lastPrice) / lastPrice) * 100
    : null;
  const isPositive    = (priceChange ?? 0) >= 0;

  // ── Build chart data with confidence bands ────────────────────────────────
  const chartData = forecast.forecast.map((d: any) => ({
    date:     d.date,
    forecast: parseFloat(d.forecast?.toFixed(2) ?? 0),
    upper:    parseFloat(d.upper_bound?.toFixed(2) ?? d.forecast),
    lower:    parseFloat(d.lower_bound?.toFixed(2) ?? d.forecast),
  }));

  // Show every 5th label to avoid crowding
  const tickIndices = new Set(chartData.filter((_: any, i: number) => i % 5 === 0).map((d: any) => d.date));
  const xAxisTick = ({ x, y, payload }: any) => {
    if (!tickIndices.has(payload.value)) return <g />;
    return (
      <text x={x} y={y + 12} textAnchor="middle" fill="#94a3b8" fontSize={10}>
        {payload.value.slice(5)} {/* show MM-DD only */}
      </text>
    );
  };

  return (
    <div className="bg-gray-800/60 border border-gray-700/40 rounded-xl mt-4 p-4">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-100">SARIMAX Price Forecast</h2>
          <p className="text-xs text-gray-500 mt-0.5">{forecast.forecast_days ?? 30}-day forward projection</p>
        </div>
        {priceChange !== null && (
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${
            isPositive
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isPositive ? "+" : ""}{priceChange.toFixed(2)}% projected
          </div>
        )}
      </div>

      {/* ── Metric cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-700/30">
          <p className="text-xs text-gray-500 mb-1">Last Close</p>
          <p className="font-semibold text-gray-100 text-sm">
            {lastPrice !== null ? `$${lastPrice.toFixed(2)}` : "N/A"}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-700/30">
          <p className="text-xs text-gray-500 mb-1">30-Day Target</p>
          <p className={`font-semibold text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {forecastEnd ? `$${forecastEnd.forecast.toFixed(2)}` : "N/A"}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-700/30">
          <p className="text-xs text-gray-500 mb-1">RMSE</p>
          <p className="font-semibold text-gray-100 text-sm">{rmse}</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-700/30">
          <p className="text-xs text-gray-500 mb-1">Error %</p>
          <p className="font-semibold text-gray-100 text-sm">
            {percentRmse != null && !isNaN(percentRmse) ? `${percentRmse.toFixed(2)}%` : "N/A"}
          </p>
        </div>
      </div>

      {/* ── Chart: forecast line + confidence band ──────────────────────── */}
      <div className="bg-gray-900/50 rounded-lg p-2">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="gradBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#64748b" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#64748b" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="date" tick={xAxisTick} axisLine={false} tickLine={false} />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Confidence band (upper - lower shaded region) */}
            <Area
              type="monotone" dataKey="upper"
              stroke="#4ade80" strokeWidth={0.5} strokeDasharray="3,3"
              fill="url(#gradBand)" dot={false} activeDot={false}
            />
            <Area
              type="monotone" dataKey="lower"
              stroke="#f87171" strokeWidth={0.5} strokeDasharray="3,3"
              fill="transparent" dot={false} activeDot={false}
            />

            {/* Main forecast line */}
            <Area
              type="monotone" dataKey="forecast"
              stroke="#38bdf8" strokeWidth={2.5}
              fill="url(#gradForecast)"
              dot={false} activeDot={{ r: 4, fill: "#38bdf8" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Model info + disclaimer ──────────────────────────────────────── */}
      <div className="mt-3 flex items-start gap-2 text-xs text-gray-500">
        <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-yellow-500/70" />
        <span>
          Model: SARIMAX {modelOrder} × {seasonalOrder} &nbsp;|&nbsp;
          For educational purposes only. Not financial advice. Past performance does not guarantee future results.
        </span>
      </div>
    </div>
  );
};

export default ForecastPanel;
