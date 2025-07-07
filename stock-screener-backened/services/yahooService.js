const yahooFinance = require('yahoo-finance2').default;

exports.fetchFundamentals = async (symbol) => {
  try {
    const quoteSummary = await yahooFinance.quoteSummary(symbol, {
      modules: ['defaultKeyStatistics', 'financialData'],
    });

    return {
      peRatio: quoteSummary.defaultKeyStatistics?.trailingPE,
      eps: quoteSummary.defaultKeyStatistics?.trailingEps,
      marketCap: quoteSummary.defaultKeyStatistics?.marketCap,
      profitMargins: quoteSummary.financialData?.profitMargins,
      returnOnEquity: quoteSummary.financialData?.returnOnEquity,
      debtToEquity: quoteSummary.financialData?.debtToEquity,
    };
  } catch (error) {
    throw new Error("Failed to fetch data from Yahoo Finance: " + error.message);
  }
};
