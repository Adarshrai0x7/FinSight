const axios = require('axios');

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

exports.getLatestNews = async (req, res) => {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching latest news:", error.message);
    res.status(500).json({ error: 'Failed to fetch latest news' });
  }
};

exports.getTrendingNews = async (req, res) => {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`);

    const hotKeywords = /surge|record|plunge|breaks|AI|rally|beats|explodes|boom|skyrockets|growth/i;

    const trending = response.data
      .filter(article =>
        article.image &&
        article.headline &&
        Date.now() - article.datetime * 1000 < 24 * 60 * 60 * 1000 && // last 24 hrs
        hotKeywords.test(article.headline + " " + (article.summary || ""))
      )
      .map(article => {
        const hoursAgo = (Date.now() - article.datetime * 1000) / (1000 * 60 * 60);
        const recencyBoost = Math.max(0, 24 - hoursAgo); // newer = higher boost

        return {
          ...article,
          isTrending: true,
          trendScore: Math.min(100, Math.floor(Math.random() * 10 + 70 + recencyBoost)), // 70–100+
        };
      })
      .sort((a, b) => b.trendScore - a.trendScore) // sort by score
      .slice(0, 10); // top 10 trending

    console.log("🔥 Trending stories:", trending.length);

    res.json(trending);
  } catch (error) {
    console.error("❌ Error fetching trending news:", error.message);
    res.status(500).json({ error: 'Failed to fetch trending news' });
  }
};
