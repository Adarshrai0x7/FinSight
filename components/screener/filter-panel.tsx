"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FilterPanelProps {
  activeTab: string
}

export function FilterPanel({ activeTab }: FilterPanelProps) {
  // Technical Indicators
  const [rsiFilter, setRsiFilter] = useState({
    enabled: true,
    condition: "above",
    value: 70,
  })

  const [macdFilter, setMacdFilter] = useState({
    enabled: false,
    crossover: "bullish",
  })

  const [movingAveragesFilter, setMovingAveragesFilter] = useState({
    enabled: true,
    type: "SMA",
    period1: 50,
    period2: 200,
    condition: "golden-cross",
  })

  const [bollingerBandsFilter, setBollingerBandsFilter] = useState({
    enabled: false,
    condition: "upper",
  })

  const [volumeSurgeFilter, setVolumeSurgeFilter] = useState({
    enabled: true,
    percentage: 50,
  })

  // Fundamental Indicators
  const [peRatioFilter, setPeRatioFilter] = useState({
    enabled: true,
    min: 0,
    max: 30,
  })

  const [marketCapFilter, setMarketCapFilter] = useState({
    enabled: true,
    size: "large",
  })

  const [dividendYieldFilter, setDividendYieldFilter] = useState({
    enabled: false,
    min: 2,
  })

  const [debtEquityFilter, setDebtEquityFilter] = useState({
    enabled: false,
    max: 1.5,
  })

  const [earningsGrowthFilter, setEarningsGrowthFilter] = useState({
    enabled: true,
    period: "YoY",
    min: 10,
  })

  // Sentiment Indicators
  const [newsSentimentFilter, setNewsSentimentFilter] = useState({
    enabled: true,
    sentiment: "positive",
  })

  const [socialMediaFilter, setSocialMediaFilter] = useState({
    enabled: false,
    threshold: 70,
  })

  const [insiderTradingFilter, setInsiderTradingFilter] = useState({
    enabled: false,
    activity: "buying",
  })

  const [analystRatingFilter, setAnalystRatingFilter] = useState({
    enabled: true,
    rating: "buy",
  })

  const renderTechnicalFilters = () => (
    <TooltipProvider>
      <Accordion type="multiple" defaultValue={["rsi", "moving-averages", "volume"]}>
        {/* RSI Filter */}
        <AccordionItem value="rsi" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-gray-200">RSI</span>
              </div>
              <Switch
                checked={rsiFilter.enabled}
                onCheckedChange={(checked) => setRsiFilter({ ...rsiFilter, enabled: checked })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">Condition</Label>
                <Select
                  value={rsiFilter.condition}
                  onValueChange={(value) => setRsiFilter({ ...rsiFilter, condition: value })}
                  disabled={!rsiFilter.enabled}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="above">Above</SelectItem>
                    <SelectItem value="below">Below</SelectItem>
                    <SelectItem value="between">Between</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-400 text-xs">Value: {rsiFilter.value}</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">
                      <p className="text-xs">RSI above 70 indicates overbought, below 30 indicates oversold</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Slider
                  disabled={!rsiFilter.enabled}
                  value={[rsiFilter.value]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setRsiFilter({ ...rsiFilter, value: value[0] })}
                  className="[&_[role=slider]]:bg-cyan-500"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* MACD Filter */}
        <AccordionItem value="macd" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-gray-200">MACD Crossover</span>
              </div>
              <Switch
                checked={macdFilter.enabled}
                onCheckedChange={(checked) => setMacdFilter({ ...macdFilter, enabled: checked })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">Signal</Label>
                <Select
                  value={macdFilter.crossover}
                  onValueChange={(value) => setMacdFilter({ ...macdFilter, crossover: value })}
                  disabled={!macdFilter.enabled}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                    <SelectValue placeholder="Crossover" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="bullish">Bullish (MACD crosses above Signal)</SelectItem>
                    <SelectItem value="bearish">Bearish (MACD crosses below Signal)</SelectItem>
                    <SelectItem value="zero-cross-up">Zero Line Cross Up</SelectItem>
                    <SelectItem value="zero-cross-down">Zero Line Cross Down</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Moving Averages Filter */}
        <AccordionItem value="moving-averages" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-gray-200">Moving Averages</span>
              </div>
              <Switch
                checked={movingAveragesFilter.enabled}
                onCheckedChange={(checked) => setMovingAveragesFilter({ ...movingAveragesFilter, enabled: checked })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">Type</Label>
                <Select
                  value={movingAveragesFilter.type}
                  onValueChange={(value) => setMovingAveragesFilter({ ...movingAveragesFilter, type: value })}
                  disabled={!movingAveragesFilter.enabled}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="SMA">Simple Moving Average (SMA)</SelectItem>
                    <SelectItem value="EMA">Exponential Moving Average (EMA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Short Period: {movingAveragesFilter.period1}d</Label>
                  <Slider
                    disabled={!movingAveragesFilter.enabled}
                    value={[movingAveragesFilter.period1]}
                    min={5}
                    max={100}
                    step={1}
                    onValueChange={(value) => setMovingAveragesFilter({ ...movingAveragesFilter, period1: value[0] })}
                    className="[&_[role=slider]]:bg-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Long Period: {movingAveragesFilter.period2}d</Label>
                  <Slider
                    disabled={!movingAveragesFilter.enabled}
                    value={[movingAveragesFilter.period2]}
                    min={50}
                    max={300}
                    step={1}
                    onValueChange={(value) => setMovingAveragesFilter({ ...movingAveragesFilter, period2: value[0] })}
                    className="[&_[role=slider]]:bg-cyan-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">Condition</Label>
                <Select
                  value={movingAveragesFilter.condition}
                  onValueChange={(value) => setMovingAveragesFilter({ ...movingAveragesFilter, condition: value })}
                  disabled={!movingAveragesFilter.enabled}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="golden-cross">Golden Cross (Short crosses above Long)</SelectItem>
                    <SelectItem value="death-cross">Death Cross (Short crosses below Long)</SelectItem>
                    <SelectItem value="above">Price above both MAs</SelectItem>
                    <SelectItem value="below">Price below both MAs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Bollinger Bands Filter */}
        <AccordionItem value="bollinger" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-gray-200">Bollinger Bands</span>
              </div>
              <Switch
                checked={bollingerBandsFilter.enabled}
                onCheckedChange={(checked) => setBollingerBandsFilter({ ...bollingerBandsFilter, enabled: checked })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">Condition</Label>
                <Select
                  value={bollingerBandsFilter.condition}
                  onValueChange={(value) => setBollingerBandsFilter({ ...bollingerBandsFilter, condition: value })}
                  disabled={!bollingerBandsFilter.enabled}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="upper">Price near Upper Band</SelectItem>
                    <SelectItem value="lower">Price near Lower Band</SelectItem>
                    <SelectItem value="squeeze">Bollinger Squeeze (Bands narrowing)</SelectItem>
                    <SelectItem value="breakout-up">Breakout Above Upper Band</SelectItem>
                    <SelectItem value="breakout-down">Breakout Below Lower Band</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Volume Surge Filter */}
        <AccordionItem value="volume" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-gray-200">Volume Surge</span>
              </div>
              <Switch
                checked={volumeSurgeFilter.enabled}
                onCheckedChange={(checked) => setVolumeSurgeFilter({ ...volumeSurgeFilter, enabled: checked })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-400 text-xs">
                    Volume increase over average: {volumeSurgeFilter.percentage}%
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">
                      <p className="text-xs">Percentage increase over 20-day average volume</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Slider
                  disabled={!volumeSurgeFilter.enabled}
                  value={[volumeSurgeFilter.percentage]}
                  min={10}
                  max={300}
                  step={5}
                  onValueChange={(value) => setVolumeSurgeFilter({ ...volumeSurgeFilter, percentage: value[0] })}
                  className="[&_[role=slider]]:bg-cyan-500"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TooltipProvider>
  )

  const renderFundamentalFilters = () => (
    <TooltipProvider>
      <Accordion type="multiple" defaultValue={["pe-ratio", "market-cap", "earnings"]}>
        {/* P/E Ratio Filter */}
        <AccordionItem value="pe-ratio" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-gray-200">P/E Ratio</span>
              </div>
              <Switch
                checked={peRatioFilter.enabled}
                onCheckedChange={(checked) => setPeRatioFilter({ ...peRatioFilter, enabled: checked })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Min: {peRatioFilter.min}</Label>
                  <Slider
                    disabled={!peRatioFilter.enabled}
                    value={[peRatioFilter.min]}
                    min={0}
                    max={50}
                    step={1}
                    onValueChange={(value) => setPeRatioFilter({ ...peRatioFilter, min: value[0] })}
                    className="[&_[role=slider]]:bg-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Max: {peRatioFilter.max}</Label>
                  <Slider
                    disabled={!peRatioFilter.enabled}
                    value={[peRatioFilter.max]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setPeRatioFilter({ ...peRatioFilter, max: value[0] })}
                    className="[&_[role=slider]]:bg-cyan-500"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Market Cap Filter */}
        <AccordionItem value="market-cap" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-gray-200">Market Cap</span>
              </div>
              <Switch
                checked={marketCapFilter.enabled}
                onCheckedChange={(checked) => setMarketCapFilter({ ...marketCapFilter, enabled: checked })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">Size</Label>
                <Select
                  value={marketCapFilter.size}
                  onValueChange={(value) => setMarketCapFilter({ ...marketCapFilter, size: value })}
                  disabled={!marketCapFilter.enabled}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="mega">Mega Cap (&gt;$200B)</SelectItem>
                    <SelectItem value="large">Large Cap ($10B-$200B)</SelectItem>
                    <SelectItem value="mid">Mid Cap ($2B-$10B)</SelectItem>
                    <SelectItem value="small">Small Cap ($300M-$2B)</SelectItem>
                    <SelectItem value="micro">Micro Cap (&lt;$300M)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Dividend Yield Filter */}
        <AccordionItem value="dividend" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-gray-200">Dividend Yield</span>
              </div>
              <Switch
                checked={dividendYieldFilter.enabled}
                onCheckedChange={(checked) => setDividendYieldFilter({ ...dividendYieldFilter, enabled: checked })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-400 text-xs">Minimum Yield: {dividendYieldFilter.min}%</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">
                      <p className="text-xs">Annual dividend as percentage of share price</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Slider
                  disabled={!dividendYieldFilter.enabled}
                  value={[dividendYieldFilter.min]}
                  min={0}
                  max={10}
                  step={0.1}
                  onValueChange={(value) => setDividendYieldFilter({ ...dividendYieldFilter, min: value[0] })}
                  className="[&_[role=slider]]:bg-cyan-500"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Debt-to-Equity Filter */}
        <AccordionItem value="debt-equity" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-gray-200">Debt-to-Equity</span>
              </div>
              <Switch
                checked={debtEquityFilter.enabled}
                onCheckedChange={(checked) => setDebtEquityFilter({ ...debtEquityFilter, enabled: checked })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-400 text-xs">Maximum Ratio: {debtEquityFilter.max}</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">
                      <p className="text-xs">Lower values indicate less debt relative to equity</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Slider
                  disabled={!debtEquityFilter.enabled}
                  value={[debtEquityFilter.max]}
                  min={0}
                  max={5}
                  step={0.1}
                  onValueChange={(value) => setDebtEquityFilter({ ...debtEquityFilter, max: value[0] })}
                  className="[&_[role=slider]]:bg-cyan-500"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Earnings Growth Filter */}
        <AccordionItem value="earnings" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-gray-200">Earnings Growth</span>
              </div>
              <Switch
                checked={earningsGrowthFilter.enabled}
                onCheckedChange={(checked) => setEarningsGrowthFilter({ ...earningsGrowthFilter, enabled: checked })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">Period</Label>
                <Select
                  value={earningsGrowthFilter.period}
                  onValueChange={(value) => setEarningsGrowthFilter({ ...earningsGrowthFilter, period: value })}
                  disabled={!earningsGrowthFilter.enabled}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="QoQ">Quarter over Quarter</SelectItem>
                    <SelectItem value="YoY">Year over Year</SelectItem>
                    <SelectItem value="3Y">3-Year CAGR</SelectItem>
                    <SelectItem value="5Y">5-Year CAGR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-400 text-xs">Minimum Growth: {earningsGrowthFilter.min}%</Label>
                </div>
                <Slider
                  disabled={!earningsGrowthFilter.enabled}
                  value={[earningsGrowthFilter.min]}
                  min={-20}
                  max={100}
                  step={1}
                  onValueChange={(value) => setEarningsGrowthFilter({ ...earningsGrowthFilter, min: value[0] })}
                  className="[&_[role=slider]]:bg-cyan-500"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TooltipProvider>
  )

  const renderSentimentFilters = () => (
    <TooltipProvider>
      <Accordion type="multiple" defaultValue={["news-sentiment", "analyst-rating"]}>
        {/* News Sentiment Filter */}
        <AccordionItem value="news-sentiment" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-gray-200">News Sentiment</span>
              </div>
              <Switch
                checked={newsSentimentFilter.enabled}
                onCheckedChange={(checked) => setNewsSentimentFilter({ ...newsSentimentFilter, enabled: checked })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">Sentiment</Label>
                <Select
                  value={newsSentimentFilter.sentiment}
                  onValueChange={(value) => setNewsSentimentFilter({ ...newsSentimentFilter, sentiment: value })}
                  disabled={!newsSentimentFilter.enabled}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                    <SelectValue placeholder="Sentiment" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Social Media Filter */}
        <AccordionItem value="social-media" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-gray-200">Social Media Buzz</span>
              </div>
              <Switch
                checked={socialMediaFilter.enabled}
                onCheckedChange={(checked) => setSocialMediaFilter({ ...socialMediaFilter, enabled: checked })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-400 text-xs">Minimum Buzz Score: {socialMediaFilter.threshold}</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">
                      <p className="text-xs">Higher values indicate more social media activity</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Slider
                  disabled={!socialMediaFilter.enabled}
                  value={[socialMediaFilter.threshold]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setSocialMediaFilter({ ...socialMediaFilter, threshold: value[0] })}
                  className="[&_[role=slider]]:bg-cyan-500"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Insider Trading Filter */}
        <AccordionItem value="insider-trading" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-gray-200">Insider Trading</span>
              </div>
              <Switch
                checked={insiderTradingFilter.enabled}
                onCheckedChange={(checked) => setInsiderTradingFilter({ ...insiderTradingFilter, enabled: checked })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">Activity</Label>
                <Select
                  value={insiderTradingFilter.activity}
                  onValueChange={(value) => setInsiderTradingFilter({ ...insiderTradingFilter, activity: value })}
                  disabled={!insiderTradingFilter.enabled}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                    <SelectValue placeholder="Activity" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="buying">Insider Buying</SelectItem>
                    <SelectItem value="selling">Insider Selling</SelectItem>
                    <SelectItem value="net-buying">Net Buying</SelectItem>
                    <SelectItem value="net-selling">Net Selling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Analyst Rating Filter */}
        <AccordionItem value="analyst-rating" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-gray-200">Analyst Rating</span>
              </div>
              <Switch
                checked={analystRatingFilter.enabled}
                onCheckedChange={(checked) => setAnalystRatingFilter({ ...analystRatingFilter, enabled: checked })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">Rating</Label>
                <Select
                  value={analystRatingFilter.rating}
                  onValueChange={(value) => setAnalystRatingFilter({ ...analystRatingFilter, rating: value })}
                  disabled={!analystRatingFilter.enabled}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="strong-buy">Strong Buy</SelectItem>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="hold">Hold</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                    <SelectItem value="strong-sell">Strong Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TooltipProvider>
  )

  return (
    <div>
      {activeTab === "technical" && renderTechnicalFilters()}
      {activeTab === "fundamental" && renderFundamentalFilters()}
      {activeTab === "sentiment" && renderSentimentFilters()}
    </div>
  )
}
