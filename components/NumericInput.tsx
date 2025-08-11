"use client"

import React, { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface NumericInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value' | 'type'> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  decimalPlaces?: number
}

export function NumericInput({ 
  value, 
  onChange, 
  min = 0, 
  max, 
  step = 0.01,
  decimalPlaces = 2,
  className,
  onBlur,
  onFocus,
  ...props 
}: NumericInputProps) {
  const [displayValue, setDisplayValue] = useState(value.toString())
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync display value when prop value changes (but not when focused)
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value.toString())
    }
  }, [value, isFocused])

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    
    // Parse and validate the input
    const numericValue = parseFloat(displayValue)
    let finalValue = isNaN(numericValue) ? 0 : numericValue

    // Apply constraints
    if (typeof min === 'number') {
      finalValue = Math.max(finalValue, min)
    }
    if (typeof max === 'number') {
      finalValue = Math.min(finalValue, max)
    }

    // Round to specified decimal places
    finalValue = Math.round(finalValue * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)

    setDisplayValue(finalValue.toString())
    onChange(finalValue)
    
    onBlur?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    
    // Allow empty string, numbers, and decimal point
    if (newValue === '' || /^-?\d*\.?\d*$/.test(newValue)) {
      setDisplayValue(newValue)
      
      // If it's a valid number, update immediately (for real-time feedback)
      const numericValue = parseFloat(newValue)
      if (!isNaN(numericValue)) {
        onChange(numericValue)
      } else if (newValue === '') {
        onChange(0)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if ([8, 9, 27, 13, 46, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
      return
    }
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
    }
  }

  return (
    <Input
      {...props}
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={cn("text-right", className)}
    />
  )
}