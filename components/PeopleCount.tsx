"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Users, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface PeopleCountProps {
  value: number
  onChange: (value: number) => void
  label?: string
  className?: string
  required?: boolean
  min?: number
  max?: number
  showSlider?: boolean
  variant?: 'select' | 'slider' | 'both'
}

// Helper function for pluralization
export function pluralize(word: string, count: number, pluralForm?: string): string {
  if (count === 1) return word
  
  if (pluralForm) return pluralForm
  
  // Portuguese pluralization rules (simplified)
  const lastChar = word.slice(-1).toLowerCase()
  const lastTwoChars = word.slice(-2).toLowerCase()
  
  if (lastChar === 'm') {
    return word.slice(0, -1) + 'ns'  // homem -> homens
  } else if (lastTwoChars === 'ão') {
    return word.slice(0, -2) + 'ões'  // suspeição -> suspeições (rare case)
  } else if (lastChar === 'l') {
    return word.slice(0, -1) + 'is'   // animal -> animais
  } else if (lastChar === 'r' || lastChar === 's' || lastChar === 'z') {
    return word + 'es'  // suspeitor -> suspeitores
  } else {
    return word + 's'   // suspeito -> suspeitos
  }
}

export function PeopleCount({
  value,
  onChange,
  label = "Número de Pessoas Envolvidas",
  className,
  required = false,
  min = 1,
  max = 10,
  showSlider = true,
  variant = 'both'
}: PeopleCountProps) {
  const handleSelectChange = (stringValue: string) => {
    const numValue = parseInt(stringValue, 10)
    if (!isNaN(numValue)) {
      onChange(numValue)
    }
  }

  const handleSliderChange = (values: number[]) => {
    onChange(values[0])
  }

  const getPersonText = (count: number) => {
    return count === 1 ? "pessoa" : "pessoas"
  }

  const getSuspectText = (count: number) => {
    return pluralize("suspeito", count)
  }

  const renderSelect = () => (
    <div className="space-y-2">
      <Select value={value.toString()} onValueChange={handleSelectChange} required={required}>
        <SelectTrigger className={cn("input-dark", className)}>
          <SelectValue placeholder="Selecione..." />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: max - min + 1 }, (_, i) => {
            const num = min + i
            return (
              <SelectItem key={num} value={num.toString()}>
                <div className="flex items-center gap-2">
                  {num === 1 ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                  <span>
                    {num} {getPersonText(num)}
                  </span>
                </div>
              </SelectItem>
            )
          })}
          <SelectItem value="10+">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>10+ pessoas</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )

  const renderSlider = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {value === 1 ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />}
          <span>{value} {getPersonText(value)}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {getSuspectText(value)}
        </Badge>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        max={max}
        min={min}
        step={1}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}+</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold dark-text">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </Label>
          <Badge className="bg-blue-500/20 text-blue-400 text-xs">
            Afeta pluralização
          </Badge>
        </div>
      )}
      
      <div className="space-y-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
        {(variant === 'select' || variant === 'both') && renderSelect()}
        {(variant === 'slider' || variant === 'both') && showSlider && renderSlider()}
        
        {/* Preview of how it affects the report */}
        <div className="mt-3 p-2 bg-blue-500/10 rounded border border-blue-500/30">
          <div className="text-xs text-blue-300 font-medium mb-1">💡 Como aparecerá no relatório:</div>
          <div className="text-xs text-gray-300">
            "O{value === 1 ? '' : 's'} {getSuspectText(value)} {value === 1 ? 'foi' : 'foram'} 
            {value === 1 ? ' detido' : ' detidos'} e {value === 1 ? 'conduzido' : 'conduzidos'} ao departamento policial."
          </div>
        </div>
      </div>
    </div>
  )
}