const yahooService = require("../services/yahooService");

exports.getQuote = async (req, res) => {
  const { symbol } = req.params;

  try {
    const stock = await yahooService.getQuoteFromYahoo(symbol); // ✅ use Yahoo quote instead

    if (!stock || !stock.price) {
      return res.status(404).json({ error: "Symbol not found or no price available" });
    }

    res.json(stock);
  } catch (error) {
    console.error("❌ Quote API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch quote" });
  }
};
