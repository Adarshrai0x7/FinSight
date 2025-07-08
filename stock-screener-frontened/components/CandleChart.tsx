"use client"

import { useEffect, useRef } from "react"
import { createChart, type IChartApi, type CandlestickData } from "lightweight-charts"

export default function CandleChart({ data }: { data: any[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chart = createChart(chartContainerRef.current!, {
      layout: {
        background: { color: "#0f172a" }, // bg-gray-950
        textColor: "#cbd5e1",
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
      width: chartContainerRef.current!.clientWidth,
      height: 400,
    })

    // @ts-expect-error: addCandlestickSeries is available in lightweight-charts
    const candleSeries = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    })

    candleSeries.setData(
      data.map((d) => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
    )

    return () => chart.remove()
  }, [data])

  return <div ref={chartContainerRef} className="w-full" />
}
