"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, ChevronRight, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CollapsibleItemCardProps {
  title: string
  items: any[]
  selectedItems: any[]
  onItemsChange: (items: any[]) => void
  penaltyFormula: string
  showUnit?: boolean
  icon?: React.ComponentType<{ className?: string }>
  defaultExpanded?: boolean
}

export function CollapsibleItemCard({
  title,
  items,
  selectedItems,
  onItemsChange,
  penaltyFormula,
  showUnit = false,
  icon: Icon,
  defaultExpanded = false,
}: CollapsibleItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [newItem, setNewItem] = useState({ id: "", quantidade: 1, nome: "", unidade: "" })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addItem = (e?: React.MouseEvent) => {
    // Prevenir propagação do evento para não interferir com outros handlers
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!newItem.id) return

    const selectedItemData = items.find((item) => item.id.toString() === newItem.id)
    if (selectedItemData) {
      const itemToAdd = {
        id: newItem.id,
        nome: selectedItemData.nome,
        quantidade: newItem.quantidade,
        unidade: selectedItemData.unidade || "unidade(s)",
        categoria: selectedItemData.categoria,
      }

      onItemsChange([...selectedItems, itemToAdd])
      setNewItem({ id: "", quantidade: 1, nome: "", unidade: "" })
    }
  }

  const removeItem = (index: number, e?: React.MouseEvent) => {
    // Prevenir propagação do evento
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    const newItems = selectedItems.filter((_, i) => i !== index)
    onItemsChange(newItems)
  }

  const updateQuantity = (index: number, quantidade: number, e?: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent propagation and stop bubbling
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // Ensure quantity is valid
    const validQuantity = Math.max(1, Math.floor(quantidade) || 1)
    const newItems = [...selectedItems]
    newItems[index] = { ...newItems[index], quantidade: validQuantity }
    onItemsChange(newItems)
  }

  const handleToggleExpanded = (e: React.MouseEvent) => {
    // Only prevent default, don't stop propagation as it might affect parent handlers
    e.preventDefault()
    setIsExpanded(!isExpanded)
  }

  const handleSelectChange = (value: string) => {
    const selectedItemData = items.find((item) => item.id.toString() === value)
    setNewItem({
      id: value,
      quantidade: newItem.quantidade,
      nome: selectedItemData?.nome || "",
      unidade: selectedItemData?.unidade || "",
    })
  }

  const handleQuantityChange = (value: number, e?: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent propagation but allow the input to function
    if (e) {
      e.stopPropagation()
    }
    
    // Ensure value is valid
    const validValue = Math.max(1, Math.floor(value) || 1)
    setNewItem({ ...newItem, quantidade: validValue })
  }

  const getTotalQuantity = () => {
    return selectedItems.reduce((total, item) => total + item.quantidade, 0)
  }

  const getStatusColor = () => {
    if (selectedItems.length === 0) return "border-gray-600 bg-gray-600/5"
    return "border-green-500 bg-green-500/10"
  }

  const getStatusIcon = () => {
    if (selectedItems.length === 0) return "⚪"
    return "🟢"
  }

  if (!mounted) {
    return (
      <Card className={`police-card-dark transition-all duration-300 ${getStatusColor()}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <ChevronRight className="h-4 w-4 dark-text-soft" />
              {Icon && <Icon className="h-5 w-5 dark-highlight" />}
              <span className="font-semibold dark-text">{title}</span>
            </div>
            <span className="text-xs dark-text-soft">Carregando...</span>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={`police-card-compact transition-all duration-300 hover:shadow-lg ${getStatusColor()}`}>
      <CardHeader className="pb-3">
        <Button
          type="button"
          variant="ghost"
          className="w-full p-0 h-auto justify-start hover:bg-transparent"
          onClick={handleToggleExpanded}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight className="h-4 w-4 dark-text-soft flex-shrink-0" />
              </motion.div>

              {Icon && <Icon className="h-4 w-4 dark-highlight flex-shrink-0" />}

              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold dark-text readable-text truncate">{title}</span>
                <span className="text-base flex-shrink-0">{getStatusIcon()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              {/* Badges de status - mais compactos */}
              {selectedItems.length > 0 ? (
                <div className="flex items-center gap-1">
                  <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 font-semibold text-xs px-1.5 py-0.5">
                    {selectedItems.length}
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold text-xs px-1.5 py-0.5">
                    {getTotalQuantity()}
                  </Badge>
                </div>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/30 font-semibold text-xs px-1.5 py-0.5">
                  Vazio
                </Badge>
              )}
            </div>
          </div>
        </Button>

        {/* Fórmula de penalidade em linha separada para melhor legibilidade */}
        <div className="mt-2 px-6">
          <span className="text-xs dark-text-soft font-medium bg-gray-800/30 px-2 py-1 rounded">{penaltyFormula}</span>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CardContent className="pt-0 space-y-4">
              {/* Preview dos itens selecionados quando expandido */}
              {selectedItems.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-semibold dark-highlight">Itens Selecionados:</span>
                  </div>

                  {selectedItems.map((selectedItem, index) => (
                    <motion.div
                      key={`${selectedItem.id}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2 p-2.5 dark-secondary-bg rounded-lg border dark-border"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium dark-text readable-small truncate">{selectedItem.nome}</span>
                          {selectedItem.categoria && (
                            <Badge variant="outline" className="text-xs dark-text-soft border-gray-600 compact-badge">
                              {selectedItem.categoria}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Input
                          type="number"
                          min="1"
                          max="999"
                          value={selectedItem.quantidade}
                          onChange={(e) => updateQuantity(index, Number.parseInt(e.target.value) || 1, e)}
                          onFocus={(e) => e.target.select()}
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 h-8 text-center text-sm input-dark border-gray-600 focus:border-blue-500"
                        />
                        {showUnit && selectedItem.unidade && (
                          <span className="text-xs dark-text-soft w-10 text-center truncate">
                            {selectedItem.unidade}
                          </span>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => removeItem(index, e)}
                          className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Formulário para adicionar novo item */}
              <div className="border-t dark-border pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="h-4 w-4 dark-highlight" />
                  <span className="text-sm font-semibold dark-highlight">Adicionar Item:</span>
                </div>

                <div className="flex gap-2 items-end p-3 bg-gray-800/30 rounded-lg border border-dashed dark-border">
                  <div className="flex-1">
                    <Select value={newItem.id} onValueChange={handleSelectChange}>
                      <SelectTrigger 
                        className="h-9 text-sm input-dark border-gray-600 focus:border-blue-500" 
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                      >
                        <SelectValue placeholder="Selecionar item..." />
                      </SelectTrigger>
                      <SelectContent className="dark-box-bg border dark-border max-h-48 overflow-y-auto">
                        {items.map((item) => (
                          <SelectItem 
                            key={item.id} 
                            value={item.id.toString()} 
                            className="dark-text hover:dark-hover cursor-pointer"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium readable-text">{item.nome}</span>
                              {item.categoria && <span className="text-xs dark-text-soft readable-small">{item.categoria}</span>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min="1"
                      max="999"
                      value={newItem.quantidade}
                      onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1, e)}
                      onFocus={(e) => e.target.select()}
                      onClick={(e) => e.stopPropagation()}
                      className="h-9 text-center text-sm input-dark border-gray-600 focus:border-blue-500"
                      placeholder="Qtd"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addItem}
                    disabled={!newItem.id}
                    size="sm"
                    className={`h-9 px-4 text-sm font-semibold ${
                      newItem.id ? "btn-primary-dark" : "bg-gray-600 text-gray-400 cursor-not-allowed hover:bg-gray-600"
                    }`}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Aviso quando nenhum item selecionado */}
              {selectedItems.length === 0 && (
                <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <AlertCircle className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-300">Nenhum item selecionado para esta categoria</span>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
