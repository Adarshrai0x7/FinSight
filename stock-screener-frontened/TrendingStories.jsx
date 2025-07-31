import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Flame, AlertCircle } from "lucide-react"; // Optional icons

dayjs.extend(relativeTime);

const TrendingStories = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/news/trending");
        setNews(res.data);
      } catch (err) {
        console.error("Failed to fetch news", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div className="text-white text-center">Loading news...</div>;
  }

  if (news.length === 0) {
    return <div className="text-gray-400 text-center">No trending stories found at the moment.</div>;
  }

  return (
    <div className="space-y-6">
      {news.map((article, idx) => (
        <div
          key={idx}
          className="flex gap-4 transition transform hover:-translate-y-1 hover:shadow-lg duration-300 bg-[#111827] rounded-xl p-4 border border-[#1f2937]"
        >
          {article.image && (
            <img
              src={article.image}
              alt="thumbnail"
              className="w-24 h-24 object-cover rounded-md hidden sm:block"
            />
          )}
          <div className="flex flex-col justify-between w-full">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-white">{article.headline}</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3 h-3" /> Breaking
                </span>
                <span className="flex items-center gap-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  <Flame className="w-3 h-3" /> Trending
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-2">{article.summary}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline"
              >
                {article.source}
              </a>
              <span>{dayjs.unix(article.datetime).fromNow()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingStories;
