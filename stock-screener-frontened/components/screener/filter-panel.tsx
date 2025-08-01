"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FilterPanelProps {
  activeTab: string
  onFiltersChange: (filters: {
    peGt: number
    peLt: number
    roeGt: number
    marketCapGt: number
  }) => void
}

export function FilterPanel({ activeTab, onFiltersChange }: FilterPanelProps) {
  const [peGt, setPeGt] = useState(0)
  const [peLt, setPeLt] = useState(30)
  const [roeGt, setRoeGt] = useState(10)
  const [marketCapGt, setMarketCapGt] = useState(1000) // in crores

  // Notify parent whenever filters change
  useEffect(() => {
    onFiltersChange({
      peGt,
      peLt,
      roeGt,
      marketCapGt
    })
  }, [peGt, peLt, roeGt, marketCapGt])

  const renderFundamentalFilters = () => (
    <TooltipProvider>
      <Accordion type="multiple" defaultValue={["pe", "roe", "market-cap"]}>
        {/* P/E Greater Than */}
        <AccordionItem value="pe" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <span className="text-gray-200">P/E Ratio (Greater Than)</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <Label className="text-gray-400 text-xs">P/E &gt; {peGt}</Label>
            <Slider
              value={[peGt]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setPeGt(value[0])}
              className="[&_[role=slider]]:bg-cyan-500"
            />
          </AccordionContent>
        </AccordionItem>

        {/* P/E Less Than */}
        <AccordionItem value="pe-lt" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <span className="text-gray-200">P/E Ratio (Less Than)</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <Label className="text-gray-400 text-xs">P/E &lt; {peLt}</Label>
            <Slider
              value={[peLt]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setPeLt(value[0])}
              className="[&_[role=slider]]:bg-cyan-500"
            />
          </AccordionContent>
        </AccordionItem>

        {/* ROE Greater Than */}
        <AccordionItem value="roe" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <span className="text-gray-200">ROE (Greater Than)</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <Label className="text-gray-400 text-xs">ROE &gt; {roeGt}%</Label>
            <Slider
              value={[roeGt]}
              min={0}
              max={50}
              step={1}
              onValueChange={(value) => setRoeGt(value[0])}
              className="[&_[role=slider]]:bg-cyan-500"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Market Cap Greater Than */}
        <AccordionItem value="market-cap" className="border-gray-700/50">
          <AccordionTrigger className="py-3 px-4 hover:bg-gray-800/30 rounded-lg">
            <span className="text-gray-200">Market Cap (Greater Than)</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <Label className="text-gray-400 text-xs">
              Market Cap &gt; {marketCapGt} Cr
            </Label>
            <Slider
  value={[marketCapGt]}
  min={0}
  max={100}
  step={1}
  onValueChange={(value) => setMarketCapGt(value[0])}
   className="
  w-full 
  [&_[data-radix-slider-track]]:bg-lime-400
  [&_[data-radix-slider-thumb]]:bg-white 
  [&_[data-radix-slider-thumb]]:shadow-lg 
  [&_[data-radix-slider-thumb]]:hover:scale-110 
  [&_[data-radix-slider-thumb]]:transition 
  [&_[data-radix-slider-thumb]]:duration-150 
  [&_[data-radix-slider-thumb]]:rounded-full 
  [&_[data-radix-slider-thumb]]:w-5 
  [&_[data-radix-slider-thumb]]:h-5
"
/>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TooltipProvider>
  )

  return (
    <div className="p-4 text-gray-400 text-sm">
      {activeTab === "fundamental" ? (
        renderFundamentalFilters()
      ) : (
        <div className="text-center py-12 border border-gray-700/50 rounded-lg bg-gray-800/30">
          🚧 This section is coming soon!
        </div>
      )}
    </div>
  )
}
