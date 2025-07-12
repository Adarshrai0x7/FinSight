"use client";

import { createChart, CrosshairMode } from "lightweight-charts";
import { useEffect, useRef } from "react";

interface CandleData {
  time: string; // ISO format date (e.g., "2023-07-12")
  open: number;
  high: number;
  low: number;
  close: number;
}

const ChartView = ({ data }: { data: CandleData[] }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const chart = createChart(chartContainerRef.current!, {
      width: chartContainerRef.current!.clientWidth,
      height: 400,
      layout: {
        background: { color: "#111827" },
        textColor: "#e5e7eb",
      },
      grid: {
        vertLines: { color: "#374151" },
        horzLines: { color: "#374151" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: { // ✅ updated here
    borderColor: "#6b7280",
      },
      timeScale: {
        timeVisible: true,
        borderColor: "#6b7280",
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#00ff88",
      downColor: "#ff4444",
      borderVisible: false,
      wickUpColor: "#00ff88",
      wickDownColor: "#ff4444",
    });

    // Format time to UNIX timestamp (number) if needed
    const formattedData = data.map((d) => ({
      time: d.time, // keep as string, ISO format like "2023-07-12
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    candleSeries.setData(formattedData);

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    });
    resizeObserver.observe(chartContainerRef.current!);

    return () => {
      chart.remove();
      resizeObserver.disconnect();
    };
  }, [data]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
};

export default ChartView;
