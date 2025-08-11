"use client"

import React, { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Check, ChevronDown, Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface AutocompleteOption {
  id: string
  name?: string
  crime?: string
  description: string
  category?: string
}

interface IntelligentAutocompleteProps {
  value: string
  onChange: (value: string) => void
  options: AutocompleteOption[]
  placeholder?: string
  className?: string
  label?: string
  required?: boolean
  allowCustom?: boolean
  emptyMessage?: string
  fieldType?: 'crime' | 'location'
}

// Simple fuzzy search function
const fuzzySearch = (query: string, text: string): number => {
  if (!query || !text) return 0
  
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()
  
  // Exact match gets highest score
  if (textLower === queryLower) return 1000
  if (textLower.startsWith(queryLower)) return 900
  if (textLower.includes(queryLower)) return 800
  
  // Character-by-character matching
  let score = 0
  let queryIndex = 0
  
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      score += 100
      queryIndex++
    }
  }
  
  // Bonus for matching all characters
  if (queryIndex === queryLower.length) {
    score += 200
  }
  
  return score
}

// Remove accents and normalize text
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function IntelligentAutocomplete({
  value,
  onChange,
  options,
  placeholder = "Digite para buscar...",
  className,
  label,
  required = false,
  allowCustom = true,
  emptyMessage = "Nenhum resultado encontrado",
  fieldType = 'crime'
}: IntelligentAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOption, setSelectedOption] = useState<AutocompleteOption | null>(null)
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Find selected option when value changes
  useEffect(() => {
    const displayName = fieldType === 'crime' ? 'crime' : 'name'
    const found = options.find(option => 
      option[displayName as keyof AutocompleteOption] === value
    )
    setSelectedOption(found || null)
  }, [value, options, fieldType])

  // Filter and sort options based on search
  const filteredOptions = React.useMemo(() => {
    if (!debouncedQuery.trim()) return options.slice(0, 10) // Show first 10 if no query
    
    const normalizedQuery = normalizeText(debouncedQuery)
    const displayName = fieldType === 'crime' ? 'crime' : 'name'
    
    const scored = options
      .map(option => {
        const name = option[displayName as keyof AutocompleteOption] as string || ""
        const normalizedName = normalizeText(name)
        const normalizedDescription = normalizeText(option.description)
        
        const nameScore = fuzzySearch(normalizedQuery, normalizedName)
        const descriptionScore = fuzzySearch(normalizedQuery, normalizedDescription) * 0.5
        
        return {
          option,
          score: nameScore + descriptionScore
        }
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10) // Limit to 10 results
    
    return scored.map(item => item.option)
  }, [debouncedQuery, options, fieldType])

  const handleSelect = (option: AutocompleteOption) => {
    const displayName = fieldType === 'crime' ? 'crime' : 'name'
    const displayValue = option[displayName as keyof AutocompleteOption] as string
    onChange(displayValue)
    setSearchQuery("")
    setOpen(false)
  }

  const handleCustomValue = () => {
    if (allowCustom && searchQuery.trim()) {
      onChange(searchQuery.trim())
      setSearchQuery("")
      setOpen(false)
    }
  }

  const handleInputChange = (newValue: string) => {
    onChange(newValue)
    setSearchQuery(newValue)
    if (newValue.length >= 2) {
      setOpen(true)
    }
  }

  const displayName = fieldType === 'crime' ? 'crime' : 'name'

  return (
    <TooltipProvider>
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-semibold dark-text">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                ref={inputRef}
                value={value}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={placeholder}
                className={cn("input-dark pr-10", className)}
                required={required}
                onFocus={() => {
                  if (value.length >= 2) setOpen(true)
                }}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {value && selectedOption ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <Check className="h-4 w-4 text-green-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">{selectedOption.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Search className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
          </PopoverTrigger>
          
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Buscar..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="border-none focus:ring-0"
              />
              <CommandList className="max-h-[200px] overflow-y-auto">
                <CommandEmpty>
                  <div className="py-4 text-center text-sm text-gray-500">
                    {emptyMessage}
                    {allowCustom && searchQuery.trim() && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-blue-400 hover:text-blue-300"
                        onClick={handleCustomValue}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar "{searchQuery.trim()}"
                      </Button>
                    )}
                  </div>
                </CommandEmpty>
                
                <CommandGroup>
                  {filteredOptions.map((option) => {
                    const isSelected = value === (option[displayName as keyof AutocompleteOption] as string)
                    const optionName = option[displayName as keyof AutocompleteOption] as string
                    
                    return (
                      <CommandItem
                        key={option.id}
                        value={option.id}
                        onSelect={() => handleSelect(option)}
                        className={cn(
                          "flex items-start gap-2 px-3 py-2 cursor-pointer",
                          isSelected && "bg-blue-500/10 text-blue-400"
                        )}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4 mt-0.5 shrink-0",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {optionName}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {option.description}
                          </div>
                          {option.category && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {option.category}
                            </Badge>
                          )}
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                
                {allowCustom && searchQuery.trim() && !filteredOptions.some(option => 
                  (option[displayName as keyof AutocompleteOption] as string)?.toLowerCase() === searchQuery.toLowerCase()
                ) && (
                  <CommandGroup>
                    <CommandItem
                      onSelect={handleCustomValue}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer text-blue-400"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">Adicionar "{searchQuery.trim()}"</span>
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        {selectedOption && (
          <div className="text-xs text-gray-400 mt-1 bg-gray-800/50 p-2 rounded">
            💡 {selectedOption.description}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}