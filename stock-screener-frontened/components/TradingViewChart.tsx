"use client";
import { useEffect, useRef } from "react";

const TradingViewChart = ({ symbol = "NASDAQ:AAPL" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear any existing widgets
    containerRef.current!.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      if ((window as any).TradingView) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1", // Candlestick
          locale: "en",
          toolbar_bg: "#1e1e2f",
          enable_publishing: false,
          hide_top_toolbar: false,
          withdateranges: true,
          save_image: false,
          container_id: "tradingview_container",
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      // Clean up widget on unmount
      if (containerRef.current) {
  containerRef.current.innerHTML = "";
}

    };
  }, [symbol]);

  return (
    <div
      id="tradingview_container"
      ref={containerRef}
      className="w-full h-[500px]"
    ></div>
  );
};

export default TradingViewChart;
