"use client";
import { useEffect, useRef } from "react";

const TradingViewChart = ({ symbol = "NASDAQ:AAPL" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      if ((window as any).TradingView) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1", // 1 = candlestick
          locale: "en",
          toolbar_bg: "#1e1e2f",
          enable_publishing: false,
          hide_top_toolbar: false,
          withdateranges: true,
          save_image: false,
          container_id: "tv_chart_container",
        });
      }
    };

    containerRef.current?.appendChild(script);
  }, [symbol]);

  return <div id="tv_chart_container" className="w-full h-[500px]" ref={containerRef}></div>;
};

export default TradingViewChart;
