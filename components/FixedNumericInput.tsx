"use client"

import React, { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FixedNumericInputProps {
  value: number
  onChange: (value: number) => void
  label?: string
  placeholder?: string
  className?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  onFocus?: () => void
  onBlur?: () => void
}

export function FixedNumericInput({
  value,
  onChange,
  label,
  placeholder = "0",
  className,
  required = false,
  min = 0,
  max,
  step = 1,
  prefix,
  suffix,
  onFocus,
  onBlur
}: FixedNumericInputProps) {
  const [inputValue, setInputValue] = useState(value.toString())
  const [isFocused, setIsFocused] = useState(false)
  const [hasBeenFocused, setHasBeenFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update input value when prop value changes (external updates)
  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString())
    }
  }, [value, isFocused])

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    
    // Only select all text on the first focus, not during continuous editing
    if (!hasBeenFocused) {
      setHasBeenFocused(true)
      // Use setTimeout to ensure selection happens after focus
      setTimeout(() => {
        e.target.select()
      }, 0)
    }
    
    onFocus?.()
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    setHasBeenFocused(false)
    
    // Parse and validate the final value
    const numValue = parseFloat(inputValue) || 0
    const clampedValue = Math.max(min, max ? Math.min(max, numValue) : numValue)
    
    if (clampedValue !== numValue) {
      setInputValue(clampedValue.toString())
    }
    
    if (clampedValue !== value) {
      onChange(clampedValue)
    }
    
    onBlur?.()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    
    // Allow empty string, numbers, and decimal points during typing
    if (newValue === "" || /^\d*\.?\d*$/.test(newValue)) {
      setInputValue(newValue)
      
      // Update parent immediately if it's a valid number
      const numValue = parseFloat(newValue)
      if (!isNaN(numValue)) {
        const clampedValue = Math.max(min, max ? Math.min(max, numValue) : numValue)
        onChange(clampedValue)
      } else if (newValue === "") {
        onChange(0)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow navigation and control keys
    if ([
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', 'Tab', 'Delete', 'Backspace',
      'Enter', 'Escape'
    ].includes(e.key)) {
      
      // Handle arrow up/down for incrementing/decrementing
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const currentNum = parseFloat(inputValue) || 0
        const newValue = Math.max(min, max ? Math.min(max, currentNum + step) : currentNum + step)
        setInputValue(newValue.toString())
        onChange(newValue)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const currentNum = parseFloat(inputValue) || 0
        const newValue = Math.max(min, max ? Math.min(max, currentNum - step) : currentNum - step)
        setInputValue(newValue.toString())
        onChange(newValue)
      }
      
      return
    }
    
    // Allow numbers, decimal point, and control keys
    if (!/^\d$|^\.$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
    }
    
    // Prevent multiple decimal points
    if (e.key === '.' && inputValue.includes('.')) {
      e.preventDefault()
    }
  }

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm font-semibold dark-text">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 pointer-events-none z-10">
            {prefix}
          </div>
        )}
        
        <Input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "input-dark transition-all duration-200",
            isFocused && "ring-2 ring-blue-500/50 border-blue-500",
            prefix && "pl-8",
            suffix && "pr-8",
            className
          )}
          required={required}
          min={min}
          max={max}
          step={step}
        />
        
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
      
      {(min !== undefined || max !== undefined) && (
        <div className="flex justify-between text-xs text-gray-400">
          {min !== undefined && <span>Mín: {min}</span>}
          {max !== undefined && <span>Máx: {max}</span>}
        </div>
      )}
    </div>
  )
}