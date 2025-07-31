require('dotenv').config(); // Load .env variables early

const express = require('express');
const cors = require('cors');
const stockRoutes = require('./routes/stockRoutes');
const newsRoutes = require('./routes/newsRoutes'); // ✅ Add this line
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/news', newsRoutes); // ✅ Register the new /api/news endpoint
// Fallback route for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

// Development: Log Twelve Data API key
if (process.env.NODE_ENV !== 'production') {
  console.log('🔐 Twelve Data API Key loaded:', process.env.TWELVE_DATA_API_KEY);
  console.log('📰 Finnhub API Key loaded:', process.env.FINNHUB_API_KEY); // ✅ Optional: to confirm it's loaded
}
