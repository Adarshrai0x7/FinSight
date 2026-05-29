/**
 * Centralized API configuration for all backend services.
 *
 * Uses NEXT_PUBLIC_* environment variables so the values are available
 * in both server and client components.  Falls back to localhost
 * defaults for local development.
 */
export const API_CONFIG = {
  /** Node.js stock-screener backend (quotes, charts, screener, news) */
  STOCK_API:    process.env.NEXT_PUBLIC_STOCK_API_URL    || "http://127.0.0.1:5000",

  /** Python FastAPI forecast backend (SARIMAX model) */
  FORECAST_API: process.env.NEXT_PUBLIC_FORECAST_API_URL || "http://127.0.0.1:8000",

  /** Python LangGraph chatbot backend */
  CHATBOT_API:  process.env.NEXT_PUBLIC_CHATBOT_API_URL  || "http://127.0.0.1:8200",
} as const;
