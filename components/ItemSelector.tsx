"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface ItemSelectorProps {
  title: string
  items: any[]
  selectedItems: any[]
  onItemsChange: (items: any[]) => void
  penaltyInfo: string
  showUnit?: boolean
  compact?: boolean
}

export function ItemSelector({
  title,
  items,
  selectedItems,
  onItemsChange,
  penaltyInfo,
  showUnit = false,
  compact = false,
}: ItemSelectorProps) {
  const addItem = () => {
    onItemsChange([...selectedItems, { id: "", quantidade: 1, nome: "", unidade: "" }])
  }

  const removeItem = (index: number) => {
    const newItems = selectedItems.filter((_, i) => i !== index)
    onItemsChange(newItems)
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...selectedItems]

    if (field === "id") {
      // Quando o ID muda, atualizar também o nome e unidade
      const selectedItemData = items.find((item) => item.id.toString() === value)
      if (selectedItemData) {
        newItems[index] = {
          ...newItems[index],
          id: value,
          nome: selectedItemData.nome,
          unidade: selectedItemData.unidade || "unidade(s)",
          categoria: selectedItemData.categoria,
        }
      } else {
        newItems[index] = { ...newItems[index], [field]: value }
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value }
    }

    onItemsChange(newItems)
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {selectedItems.map((selectedItem, index) => {
          const item = items.find((i) => i.id.toString() === selectedItem.id)
          return (
            <div key={index} className="flex gap-2 items-center p-3 dark-secondary-bg rounded-lg border dark-border">
              <div className="flex-1 min-w-0">
                <Select value={selectedItem.id} onValueChange={(value) => updateItem(index, "id", value)}>
                  <SelectTrigger className="h-9 input-dark">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="dark-box-bg border dark-border">
                    {items.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()} className="dark-text hover:dark-hover">
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
                  value={selectedItem.quantidade}
                  onChange={(e) => updateItem(index, "quantidade", Number.parseInt(e.target.value) || 1)}
                  className="h-9 text-center input-dark"
                />
              </div>
              {showUnit && item && <div className="w-16 text-xs dark-text-soft text-center">{item.unidade}</div>}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="h-9 w-9 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        })}

        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          size="sm"
          className="w-full h-9 btn-secondary-dark border-dashed bg-transparent"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      </div>
    )
  }

  return (
    <Card className="police-card-dark">
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center dark-text">
          {title}
          <span className="text-sm dark-text-soft font-normal">{penaltyInfo}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {selectedItems.map((selectedItem, index) => {
          const item = items.find((i) => i.id.toString() === selectedItem.id)
          return (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1">
                <Label className="dark-text">Item</Label>
                <Select value={selectedItem.id} onValueChange={(value) => updateItem(index, "id", value)}>
                  <SelectTrigger className="input-dark">
                    <SelectValue placeholder="Selecione um item" />
                  </SelectTrigger>
                  <SelectContent className="dark-box-bg border dark-border">
                    {items.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()} className="dark-text hover:dark-hover">
                        {item.nome} {item.categoria && `(${item.categoria})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Label className="dark-text">Qtd</Label>
                <Input
                  type="number"
                  min="1"
                  value={selectedItem.quantidade}
                  onChange={(e) => updateItem(index, "quantidade", Number.parseInt(e.target.value) || 1)}
                  className="input-dark"
                />
              </div>
              {showUnit && item && <div className="w-20 text-sm dark-text-soft pb-2">{item.unidade}</div>}
              <Button type="button" variant="destructive" size="sm" onClick={() => removeItem(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        })}

        <Button type="button" variant="outline" onClick={addItem} className="w-full btn-secondary-dark bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar {title.slice(0, -1)}
        </Button>
      </CardContent>
    </Card>
  )
}
