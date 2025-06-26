"use client"

import { useEffect, useRef } from "react"

interface TechnicalChartProps {
  symbol: string
  compareSymbol?: string
  timeframe: string
}

export function TechnicalChart({ symbol, compareSymbol, timeframe }: TechnicalChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This is a placeholder for a real chart implementation
    // In a real app, you would integrate with a charting library like TradingView, ApexCharts, etc.
    const renderChart = () => {
      if (!chartContainerRef.current) return

      const canvas = document.createElement("canvas")
      canvas.width = chartContainerRef.current.clientWidth
      canvas.height = chartContainerRef.current.clientHeight
      chartContainerRef.current.innerHTML = ""
      chartContainerRef.current.appendChild(canvas)

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set background
      ctx.fillStyle = "#1a1a2e"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "#2a2a3e"
      ctx.lineWidth = 0.5

      // Vertical grid lines
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }

      // Horizontal grid lines
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      // Generate some random data for the chart
      const data = []
      let price = 100
      for (let i = 0; i < canvas.width; i += 5) {
        price += (Math.random() - 0.5) * 2
        data.push({ x: i, y: price })
      }

      // Draw the price line
      ctx.strokeStyle = "#06B6D4"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(data[0].x, canvas.height - data[0].y)
      for (let i = 1; i < data.length; i++) {
        ctx.lineTo(data[i].x, canvas.height - data[i].y * 2)
      }
      ctx.stroke()

      // Add some text
      ctx.fillStyle = "#ffffff"
      ctx.font = "14px Arial"
      ctx.fillText(`${symbol} - ${timeframe}`, 20, 30)

      if (compareSymbol) {
        // Draw comparison line
        ctx.strokeStyle = "#10B981"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(data[0].x, canvas.height - data[0].y * 0.8)
        for (let i = 1; i < data.length; i++) {
          ctx.lineTo(data[i].x, canvas.height - data[i].y * 1.8)
        }
        ctx.stroke()

        ctx.fillStyle = "#10B981"
        ctx.fillText(`${compareSymbol}`, 20, 50)
      }
    }

    renderChart()

    const handleResize = () => {
      renderChart()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [symbol, compareSymbol, timeframe])

  return <div ref={chartContainerRef} className="w-full h-full bg-gray-900/50 rounded-lg"></div>
}
