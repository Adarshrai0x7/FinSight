"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface IndicatorSettingsProps {
  preset: string
}

export function IndicatorSettings({ preset }: IndicatorSettingsProps) {
  // Indicator states
  const [movingAverages, setMovingAverages] = useState({
    enabled: true,
    type: "SMA",
    period: 20,
    source: "close",
  })

  const [bollingerBands, setBollingerBands] = useState({
    enabled: true,
    period: 20,
    deviations: 2,
    source: "close",
  })

  const [rsi, setRsi] = useState({
    enabled: true,
    period: 14,
    overbought: 70,
    oversold: 30,
  })

  const [macd, setMacd] = useState({
    enabled: true,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
  })

  const [stochastic, setStochastic] = useState({
    enabled: false,
    kPeriod: 14,
    dPeriod: 3,
    smooth: 3,
  })

  const [vwap, setVwap] = useState({
    enabled: false,
    period: "session",
  })

  const [ichimoku, setIchimoku] = useState({
    enabled: false,
    conversionPeriod: 9,
    basePeriod: 26,
    laggingSpan2Period: 52,
    displacement: 26,
  })

  const [fibonacci, setFibonacci] = useState({
    enabled: false,
    levels: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1],
  })

  const [pivotPoints, setPivotPoints] = useState({
    enabled: false,
    type: "standard",
    timeframe: "daily",
  })

  return (
    <div className="p-4 space-y-4">
      <TooltipProvider>
        <Accordion type="multiple" defaultValue={["moving-averages", "bollinger-bands", "rsi"]}>
          {/* Moving Averages */}
          <AccordionItem value="moving-averages" className="border-gray-700/50">
            <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="text-gray-200">Moving Averages</span>
                </div>
                <Switch
                  checked={movingAverages.enabled}
                  onCheckedChange={(checked) => setMovingAverages({ ...movingAverages, enabled: checked })}
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Type</Label>
                    <Select
                      value={movingAverages.type}
                      onValueChange={(value) => setMovingAverages({ ...movingAverages, type: value })}
                      disabled={!movingAverages.enabled}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                        <SelectItem value="SMA">SMA</SelectItem>
                        <SelectItem value="EMA">EMA</SelectItem>
                        <SelectItem value="WMA">WMA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Source</Label>
                    <Select
                      value={movingAverages.source}
                      onValueChange={(value) => setMovingAverages({ ...movingAverages, source: value })}
                      disabled={!movingAverages.enabled}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                        <SelectValue placeholder="Source" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                        <SelectItem value="close">Close</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="hl2">(H+L)/2</SelectItem>
                        <SelectItem value="hlc3">(H+L+C)/3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-400 text-xs">Period: {movingAverages.period}</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">
                        <p className="text-xs">Number of periods used in calculation</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Slider
                    disabled={!movingAverages.enabled}
                    value={[movingAverages.period]}
                    min={5}
                    max={200}
                    step={1}
                    onValueChange={(value) => setMovingAverages({ ...movingAverages, period: value[0] })}
                    className="[&_[role=slider]]:bg-cyan-500"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Bollinger Bands */}
          <AccordionItem value="bollinger-bands" className="border-gray-700/50">
            <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="text-gray-200">Bollinger Bands</span>
                </div>
                <Switch
                  checked={bollingerBands.enabled}
                  onCheckedChange={(checked) => setBollingerBands({ ...bollingerBands, enabled: checked })}
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Period: {bollingerBands.period}</Label>
                    <Slider
                      disabled={!bollingerBands.enabled}
                      value={[bollingerBands.period]}
                      min={5}
                      max={50}
                      step={1}
                      onValueChange={(value) => setBollingerBands({ ...bollingerBands, period: value[0] })}
                      className="[&_[role=slider]]:bg-cyan-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Deviations: {bollingerBands.deviations}</Label>
                    <Slider
                      disabled={!bollingerBands.enabled}
                      value={[bollingerBands.deviations]}
                      min={1}
                      max={4}
                      step={0.1}
                      onValueChange={(value) => setBollingerBands({ ...bollingerBands, deviations: value[0] })}
                      className="[&_[role=slider]]:bg-cyan-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Source</Label>
                  <Select
                    value={bollingerBands.source}
                    onValueChange={(value) => setBollingerBands({ ...bollingerBands, source: value })}
                    disabled={!bollingerBands.enabled}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                      <SelectItem value="close">Close</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="hl2">(H+L)/2</SelectItem>
                      <SelectItem value="hlc3">(H+L+C)/3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* RSI */}
          <AccordionItem value="rsi" className="border-gray-700/50">
            <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="text-gray-200">RSI</span>
                </div>
                <Switch
                  checked={rsi.enabled}
                  onCheckedChange={(checked) => setRsi({ ...rsi, enabled: checked })}
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Period: {rsi.period}</Label>
                  <Slider
                    disabled={!rsi.enabled}
                    value={[rsi.period]}
                    min={2}
                    max={50}
                    step={1}
                    onValueChange={(value) => setRsi({ ...rsi, period: value[0] })}
                    className="[&_[role=slider]]:bg-cyan-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Overbought: {rsi.overbought}</Label>
                    <Slider
                      disabled={!rsi.enabled}
                      value={[rsi.overbought]}
                      min={50}
                      max={90}
                      step={1}
                      onValueChange={(value) => setRsi({ ...rsi, overbought: value[0] })}
                      className="[&_[role=slider]]:bg-cyan-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Oversold: {rsi.oversold}</Label>
                    <Slider
                      disabled={!rsi.enabled}
                      value={[rsi.oversold]}
                      min={10}
                      max={50}
                      step={1}
                      onValueChange={(value) => setRsi({ ...rsi, oversold: value[0] })}
                      className="[&_[role=slider]]:bg-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* MACD */}
          <AccordionItem value="macd" className="border-gray-700/50">
            <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="text-gray-200">MACD</span>
                </div>
                <Switch
                  checked={macd.enabled}
                  onCheckedChange={(checked) => setMacd({ ...macd, enabled: checked })}
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Fast: {macd.fastPeriod}</Label>
                    <Slider
                      disabled={!macd.enabled}
                      value={[macd.fastPeriod]}
                      min={2}
                      max={50}
                      step={1}
                      onValueChange={(value) => setMacd({ ...macd, fastPeriod: value[0] })}
                      className="[&_[role=slider]]:bg-cyan-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Slow: {macd.slowPeriod}</Label>
                    <Slider
                      disabled={!macd.enabled}
                      value={[macd.slowPeriod]}
                      min={10}
                      max={100}
                      step={1}
                      onValueChange={(value) => setMacd({ ...macd, slowPeriod: value[0] })}
                      className="[&_[role=slider]]:bg-cyan-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Signal: {macd.signalPeriod}</Label>
                    <Slider
                      disabled={!macd.enabled}
                      value={[macd.signalPeriod]}
                      min={2}
                      max={50}
                      step={1}
                      onValueChange={(value) => setMacd({ ...macd, signalPeriod: value[0] })}
                      className="[&_[role=slider]]:bg-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Stochastic Oscillator */}
          <AccordionItem value="stochastic" className="border-gray-700/50">
            <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="text-gray-200">Stochastic Oscillator</span>
                </div>
                <Switch
                  checked={stochastic.enabled}
                  onCheckedChange={(checked) => setStochastic({ ...stochastic, enabled: checked })}
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">K Period: {stochastic.kPeriod}</Label>
                    <Slider
                      disabled={!stochastic.enabled}
                      value={[stochastic.kPeriod]}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(value) => setStochastic({ ...stochastic, kPeriod: value[0] })}
                      className="[&_[role=slider]]:bg-cyan-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">D Period: {stochastic.dPeriod}</Label>
                    <Slider
                      disabled={!stochastic.enabled}
                      value={[stochastic.dPeriod]}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(value) => setStochastic({ ...stochastic, dPeriod: value[0] })}
                      className="[&_[role=slider]]:bg-cyan-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Smooth: {stochastic.smooth}</Label>
                    <Slider
                      disabled={!stochastic.enabled}
                      value={[stochastic.smooth]}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(value) => setStochastic({ ...stochastic, smooth: value[0] })}
                      className="[&_[role=slider]]:bg-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* VWAP */}
          <AccordionItem value="vwap" className="border-gray-700/50">
            <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="text-gray-200">VWAP</span>
                </div>
                <Switch
                  checked={vwap.enabled}
                  onCheckedChange={(checked) => setVwap({ ...vwap, enabled: checked })}
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Period</Label>
                  <Select
                    value={vwap.period}
                    onValueChange={(value) => setVwap({ ...vwap, period: value })}
                    disabled={!vwap.enabled}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                      <SelectItem value="session">Session</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Ichimoku Cloud */}
          <AccordionItem value="ichimoku" className="border-gray-700/50">
            <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="text-gray-200">Ichimoku Cloud</span>
                </div>
                <Switch
                  checked={ichimoku.enabled}
                  onCheckedChange={(checked) => setIchimoku({ ...ichimoku, enabled: checked })}
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Conversion: {ichimoku.conversionPeriod}</Label>
                    <Slider
                      disabled={!ichimoku.enabled}
                      value={[ichimoku.conversionPeriod]}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(value) => setIchimoku({ ...ichimoku, conversionPeriod: value[0] })}
                      className="[&_[role=slider]]:bg-cyan-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Base: {ichimoku.basePeriod}</Label>
                    <Slider
                      disabled={!ichimoku.enabled}
                      value={[ichimoku.basePeriod]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(value) => setIchimoku({ ...ichimoku, basePeriod: value[0] })}
                      className="[&_[role=slider]]:bg-cyan-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Lagging Span 2: {ichimoku.laggingSpan2Period}</Label>
                    <Slider
                      disabled={!ichimoku.enabled}
                      value={[ichimoku.laggingSpan2Period]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(value) => setIchimoku({ ...ichimoku, laggingSpan2Period: value[0] })}
                      className="[&_[role=slider]]:bg-cyan-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Displacement: {ichimoku.displacement}</Label>
                    <Slider
                      disabled={!ichimoku.enabled}
                      value={[ichimoku.displacement]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(value) => setIchimoku({ ...ichimoku, displacement: value[0] })}
                      className="[&_[role=slider]]:bg-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Fibonacci Retracement */}
          <AccordionItem value="fibonacci" className="border-gray-700/50">
            <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="text-gray-200">Fibonacci Retracement</span>
                </div>
                <Switch
                  checked={fibonacci.enabled}
                  onCheckedChange={(checked) => setFibonacci({ ...fibonacci, enabled: checked })}
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Levels</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {fibonacci.levels.map((level, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-md text-center text-sm ${
                          fibonacci.enabled
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                            : "bg-gray-800/30 text-gray-400 border border-gray-700/50"
                        }`}
                      >
                        {level.toFixed(3)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Pivot Points */}
          <AccordionItem value="pivot-points" className="border-gray-700/50">
            <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="text-gray-200">Pivot Points</span>
                </div>
                <Switch
                  checked={pivotPoints.enabled}
                  onCheckedChange={(checked) => setPivotPoints({ ...pivotPoints, enabled: checked })}
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Type</Label>
                  <Select
                    value={pivotPoints.type}
                    onValueChange={(value) => setPivotPoints({ ...pivotPoints, type: value })}
                    disabled={!pivotPoints.enabled}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="fibonacci">Fibonacci</SelectItem>
                      <SelectItem value="woodie">Woodie</SelectItem>
                      <SelectItem value="camarilla">Camarilla</SelectItem>
                      <SelectItem value="demark">DeMark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Timeframe</Label>
                  <Select
                    value={pivotPoints.timeframe}
                    onValueChange={(value) => setPivotPoints({ ...pivotPoints, timeframe: value })}
                    disabled={!pivotPoints.enabled}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-gray-300">
                      <SelectValue placeholder="Timeframe" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TooltipProvider>
    </div>
  )
}
