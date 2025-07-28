"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Package, AlertCircle } from "lucide-react"

interface CompactItemSelectorProps {
  title: string
  items: any[]
  selectedItems: any[]
  onItemsChange: (items: any[]) => void
  penaltyFormula: string
  showUnit?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

export function CompactItemSelector({
  title,
  items,
  selectedItems,
  onItemsChange,
  penaltyFormula,
  showUnit = false,
  icon: Icon = Package,
}: CompactItemSelectorProps) {
  const [newItem, setNewItem] = useState({ id: "", quantidade: 1, nome: "", unidade: "" })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addItem = () => {
    // Só adiciona se um item foi selecionado
    if (!newItem.id) {
      return
    }

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

  const removeItem = (index: number) => {
    const newItems = selectedItems.filter((_, i) => i !== index)
    onItemsChange(newItems)
  }

  const updateQuantity = (index: number, quantidade: number) => {
    const newItems = [...selectedItems]
    newItems[index] = { ...newItems[index], quantidade: Math.max(1, quantidade) }
    onItemsChange(newItems)
  }

  const getTotalQuantity = () => {
    return selectedItems.reduce((total, item) => total + item.quantidade, 0)
  }

  if (!mounted) {
    return (
      <Card className="police-card-dark">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base dark-text">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 dark-highlight" />
              <span>{title}</span>
            </div>
            <span className="text-xs dark-text-soft font-normal">{penaltyFormula}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-blue-300">Carregando itens...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="police-card-dark">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base dark-text">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 dark-highlight" />
            <span>{title}</span>
            {selectedItems.length > 0 && (
              <Badge className="gradient-secondary dark-text font-semibold text-xs">
                {selectedItems.length} item(s) • {getTotalQuantity()} total
              </Badge>
            )}
          </div>
          <span className="text-xs dark-text-soft font-normal">{penaltyFormula}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Lista de itens selecionados */}
        {selectedItems.length > 0 && (
          <div className="space-y-2">
            {selectedItems.map((selectedItem, index) => (
              <div
                key={`${selectedItem.id}-${index}`}
                className="flex items-center gap-2 p-2 dark-secondary-bg rounded-lg border dark-border"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium dark-text text-sm truncate">{selectedItem.nome}</span>
                    {selectedItem.categoria && (
                      <Badge variant="outline" className="text-xs dark-text-soft border-gray-600">
                        {selectedItem.categoria}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={selectedItem.quantidade}
                    onChange={(e) => updateQuantity(index, Number.parseInt(e.target.value) || 1)}
                    className="w-16 h-8 text-center text-xs input-dark"
                  />
                  {showUnit && selectedItem.unidade && (
                    <span className="text-xs dark-text-soft w-12 text-center">{selectedItem.unidade}</span>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulário para adicionar novo item */}
        <div className="flex gap-2 items-end p-3 bg-gray-800/30 rounded-lg border border-dashed dark-border">
          <div className="flex-1">
            <Select
              value={newItem.id}
              onValueChange={(value) => {
                const selectedItemData = items.find((item) => item.id.toString() === value)
                setNewItem({
                  id: value,
                  quantidade: newItem.quantidade,
                  nome: selectedItemData?.nome || "",
                  unidade: selectedItemData?.unidade || "",
                })
              }}
            >
              <SelectTrigger className="h-8 text-xs input-dark">
                <SelectValue placeholder="Selecionar item..." />
              </SelectTrigger>
              <SelectContent className="dark-box-bg border dark-border">
                {items.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()} className="dark-text hover:dark-hover text-xs">
                    <div className="flex flex-col">
                      <span>{item.nome}</span>
                      {item.categoria && <span className="text-xs dark-text-soft">{item.categoria}</span>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-16">
            <Input
              type="number"
              min="1"
              value={newItem.quantidade}
              onChange={(e) => setNewItem({ ...newItem, quantidade: Number.parseInt(e.target.value) || 1 })}
              className="h-8 text-center text-xs input-dark"
              placeholder="Qtd"
            />
          </div>
          <Button
            type="button"
            onClick={addItem}
            disabled={!newItem.id}
            size="sm"
            className={`h-8 px-3 text-xs font-semibold ${
              newItem.id ? "btn-primary-dark" : "bg-gray-600 text-gray-400 cursor-not-allowed hover:bg-gray-600"
            }`}
          >
            <Plus className="h-3 w-3 mr-1" />
            Adicionar
          </Button>
        </div>

        {/* Aviso quando nenhum item selecionado */}
        {selectedItems.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-blue-300">Nenhum item selecionado para esta categoria</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
