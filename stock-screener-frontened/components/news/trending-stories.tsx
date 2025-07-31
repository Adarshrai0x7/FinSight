"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  ExternalLink,
  TrendingUp,
  Clock,
  Flame,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TrendingStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("latest");

  // Fetch news from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const endpoint =
          activeTab === "latest" ? "/api/news/latest" : "/api/news/trending";
        const res = await axios.get(`http://localhost:5000${endpoint}`);
        setStories(res.data);
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };

    fetchNews();
  }, [activeTab]);

  // Filter based on search input
  const filteredStories = stories.filter((story) => {
    return (
      story.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.source?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const openStory = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Trending Stories</h1>
            <p className="text-gray-400 mt-1">
              Latest market news and trending financial stories
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 w-full md:w-64 rounded-full"
              />
            </div>

            <Button
              variant="outline"
              className="border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-800/50 border border-gray-700/50">
              <TabsTrigger
                value="latest"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Latest
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Stories List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4 max-w-4xl">
          {filteredStories.length > 0 ? (
            filteredStories.map((story, index) => (
              <Card
                key={index}
                className="bg-gray-800/30 border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer group"
                onClick={() => openStory(story.url)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-700/30 rounded-lg overflow-hidden">
                      {story.image ? (
                        <img
                          src={story.image}
                          alt={story.headline}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl text-gray-500">
                          📰
                        </div>
                      )}
                    </div>

                    {/* Story Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-100 group-hover:text-cyan-400 transition-colors line-clamp-2 flex-1">
                              {story.headline}
                            </h3>
                            {activeTab === "trending" && (
                              <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/50 text-xs">
                                <Flame className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>

                          <p className="text-gray-400 text-sm line-clamp-2 mb-3 leading-relaxed">
                            {story.summary}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-cyan-400 font-medium">{story.source}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-400">
                                {new Date(story.datetime * 1000).toLocaleString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                              <span className="text-xs text-gray-400">Read full story</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-cyan-400 text-6xl mb-4">
                {activeTab === "trending" ? "📈" : "📰"}
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">
                {searchTerm
                  ? "No stories found"
                  : activeTab === "trending"
                  ? "No trending stories"
                  : "No stories available"}
              </h3>
              <p className="text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : activeTab === "trending"
                  ? "No stories are trending right now"
                  : "Check back later for the latest market news"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
