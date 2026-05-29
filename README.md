
# 📈 Stock Screener
<h1 align="center">📈 FinSight</h1>

<p align="center">
  <strong>An AI-powered financial analysis platform for stock screening, forecasting, real-time charting, and intelligent market assistance.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase" />
  <img src="https://img.shields.io/badge/LangChain-000000?style=flat-square" />
</p>

---

## 🚀 Key Highlights

- 📊 Real-time stock charting with technical indicators  
- 🔍 Advanced stock screener using technical & fundamental filters  
- 🤖 AI-powered chatbot (**FBOT**) using RAG + LLaMA 3  
- 🔮 SARIMAX-based stock price forecasting  
- 💼 Portfolio & watchlist management with Firebase  
- ⚡ Microservices architecture using Next.js, Express, and FastAPI  

---

## ✨ Features

### 📈 Real-Time Charting
- Interactive TradingView-style charts
- Technical indicators: RSI, MACD, EMA, SMA, Bollinger Bands
- Multiple timeframe support
- Live market simulation and trade execution

### 🔍 Stock Screener
- Fundamental filters: P/E, ROE, Market Cap, Debt/Equity
- Technical filters: RSI, MACD, Volume Surge, Moving Averages
- Quick filter templates and CSV export

### 🤖 FBOT — AI Financial Assistant
- RAG-powered chatbot using LangChain + FAISS
- Groq-powered LLaMA 3 integration
- Financial Q&A with conversational memory
- Integrated floating chatbot widget

### 🔮 Forecasting Engine
- SARIMAX-based stock forecasting
- Confidence intervals and prediction visualization
- Forecast performance metrics

### 📰 Market News
- Real-time financial news integration
- Trending and category-based news filtering
- Bookmark and search functionality

### 💼 Portfolio Management
- Firebase-backed portfolio tracking
- Buy/Sell trade simulation
- Real-time P&L calculations
- Watchlist synchronization

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- React 18
- TypeScript
- TailwindCSS
- Zustand
- TradingView Widgets
- Recharts

### Backend
- Node.js + Express
- Python + FastAPI
- Firebase Authentication & Firestore
- Prisma ORM

### AI / ML
- LangChain
- FAISS Vector Store
- Groq API (LLaMA 3)
- SARIMAX (statsmodels)
- yfinance

---
## 🎥 Demo
▶ [Watch the Demo Video](https://drive.google.com/file/d/1NyCJnNXQW5MLRadt52dZItlwYAkvRf_Z/view?usp=drivesdk)

## 🔥 Firebase Console
[Open Firebase Console](https://console.firebase.google.com/u/0/project/finsight-7b199/firestore/databases/-default-/data/~2Fwatchlists~2F2eUSzbUi0SZGaZK3aWzo3ge5Oxi2?view=panel-view&query=1%7CLIM%7C3%2F100&scopeType=collection&scopeName=%2Fstocks)

## 🏗️ Architecture

```text
Frontend (Next.js)
        │
 ┌──────┼──────────────┐
 │      │              │
 ▼      ▼              ▼
Stock API      Forecast API      Chatbot API
(Express)       (FastAPI)         (FastAPI)
 │                  │                  │
 ▼                  ▼                  ▼
Yahoo Finance   SARIMAX Model    LangChain + FAISS
Finnhub API     yfinance         Groq LLaMA 3
