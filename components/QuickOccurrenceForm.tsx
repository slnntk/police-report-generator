"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { useOccurrenceStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, Wifi, WifiOff, Plus, Minus, Zap } from "lucide-react"
import { IntelligentAutocomplete } from "@/components/IntelligentAutocomplete"
import { FixedNumericInput } from "@/components/FixedNumericInput"
import { PeopleCount } from "@/components/PeopleCount"
import { CRIMES_LIST, QTH_LIST } from "@/lib/autocomplete-data"

interface QuickOccurrenceFormProps {
  onFormSubmit: () => void
  showResults: boolean
  onCalculationUpdate?: () => void
}

// Dados de fallback simplificados
const fallbackData = {
  ferramentas: [
    { id: 1, nome: "Pé de cabra", categoria: "Arrombamento" },
    { id: 2, nome: "Chave micha", categoria: "Arrombamento" },
    { id: 3, nome: "Furadeira", categoria: "Arrombamento" },
    { id: 4, nome: "Alicate", categoria: "Corte" },
    { id: 5, nome: "Lima", categoria: "Corte" },
  ],
  entorpecentes: [
    { id: 1, nome: "Maconha", unidade: "gramas", categoria: "Cannabis" },
    { id: 2, nome: "Cocaína", unidade: "gramas", categoria: "Estimulante" },
    { id: 3, nome: "Crack", unidade: "pedras", categoria: "Estimulante" },
    { id: 4, nome: "Heroína", unidade: "gramas", categoria: "Opiáceo" },
  ],
  municoes: [
    { id: 1, nome: ".38", calibre: "38", tipo: "Revólver" },
    { id: 2, nome: ".380", calibre: "380", tipo: "Pistola" },
    { id: 3, nome: "9mm", calibre: "9", tipo: "Pistola" },
    { id: 4, nome: ".40", calibre: "40", tipo: "Pistola" },
  ],
  produtos: [
    { id: 1, nome: "Celular", categoria: "Eletrônicos", valor_medio: 800 },
    { id: 2, nome: "Notebook", categoria: "Eletrônicos", valor_medio: 2500 },
    { id: 3, nome: "Televisão", categoria: "Eletrônicos", valor_medio: 1500 },
    { id: 4, nome: "Bicicleta", categoria: "Veículos", valor_medio: 600 },
  ],
  armas: [
    { id: 1, nome: "Pistola .380", categoria: "Pistola", calibre: "380" },
    { id: 2, nome: "Revólver .38", categoria: "Revólver", calibre: "38" },
    { id: 3, nome: "Pistola 9mm", categoria: "Pistola", calibre: "9mm" },
    { id: 4, nome: "Espingarda 12", categoria: "Espingarda", calibre: "12" },
  ],
  tipos_inicio: [
    { id: "abordagem", nome: "Abordagem", emoji: "🚔" },
    { id: "fuga", nome: "Fuga", emoji: "🏃" },
    { id: "disparo", nome: "Disparo", emoji: "🔫" },
    { id: "denuncia", nome: "Denúncia", emoji: "📞" },
    { id: "flagrante", nome: "Flagrante", emoji: "👁️" },
    { id: "corrida", nome: "Corrida", emoji: "🏎️" },
  ],
}

export function QuickOccurrenceForm({ onFormSubmit, showResults, onCalculationUpdate }: QuickOccurrenceFormProps) {
  const { formData, setFormData, generateReport, calculatePenalty } = useOccurrenceStore()

  const [ferramentas, setFerramentas] = useState(fallbackData.ferramentas)
  const [entorpecentes, setEntorpecentes] = useState(fallbackData.entorpecentes)
  const [municoes, setMunicoes] = useState(fallbackData.municoes)
  const [produtos, setProdutos] = useState(fallbackData.produtos)
  const [armas, setArmas] = useState(fallbackData.armas)
  const [tiposInicio, setTiposInicio] = useState(fallbackData.tipos_inicio)
  const [isOnline, setIsOnline] = useState(true)
  
  // New state for autocomplete data
  // Use the exact data lists provided
  const crimes = CRIMES_LIST
  const locations = QTH_LIST

  // Estados para contadores rápidos
  const [quickCounters, setQuickCounters] = useState({
    ferramentas: {} as Record<number, number>,
    entorpecentes: {} as Record<number, number>,
    municoes: {} as Record<number, number>,
    produtos: {} as Record<number, number>,
    armas: {} as Record<number, number>,
  })

  // Estados para categorias genéricas
  const [genericCounters, setGenericCounters] = useState({
    entorpecentes_genericos: 0,
    ferramentas_genericas: 0,
    municoes_genericas: 0,
    produtos_genericos: 0,
    armas_genericas: 0,
  })

  // Estado para slider de desobediência
  const [desobedienciaPenalty, setDesobedienciaPenalty] = useState([30])

  useEffect(() => {
    const loadData = async () => {
      try {
        const responses = await Promise.allSettled([
          fetch("/data/ferramentas.json"),
          fetch("/data/entorpecentes.json"),
          fetch("/data/municoes.json"),
          fetch("/data/produtos.json"),
          fetch("/data/armas.json"),
          fetch("/data/templates.json"),
        ])

        let hasErrors = false

        // Carregar dados (mesmo código anterior, mas simplificado)
        if (responses[0].status === "fulfilled" && responses[0].value.ok) {
          try {
            const ferramentasData = await responses[0].value.json()
            setFerramentas(ferramentasData.ferramentas || fallbackData.ferramentas)
          } catch {
            hasErrors = true
          }
        } else {
          hasErrors = true
        }

        // Carregar entorpecentes completos
        if (responses[1].status === "fulfilled" && responses[1].value.ok) {
          try {
            const entorpecentesData = await responses[1].value.json()
            setEntorpecentes(entorpecentesData.entorpecentes || fallbackData.entorpecentes)
          } catch {
            hasErrors = true
          }
        } else {
          hasErrors = true
        }

        // Carregar munições completas
        if (responses[2].status === "fulfilled" && responses[2].value.ok) {
          try {
            const municoesData = await responses[2].value.json()
            setMunicoes(municoesData.municoes || fallbackData.municoes)
          } catch {
            hasErrors = true
          }
        } else {
          hasErrors = true
        }

        // Carregar produtos completos
        if (responses[3].status === "fulfilled" && responses[3].value.ok) {
          try {
            const produtosData = await responses[3].value.json()
            setProdutos(produtosData.produtos || fallbackData.produtos)
          } catch {
            hasErrors = true
          }
        } else {
          hasErrors = true
        }

        // Carregar armas completas
        if (responses[4].status === "fulfilled" && responses[4].value.ok) {
          try {
            const armasData = await responses[4].value.json()
            setArmas(armasData.armas || fallbackData.armas)
          } catch {
            hasErrors = true
          }
        } else {
          hasErrors = true
        }

        // Carregar templates com novo tipo
        if (responses[5].status === "fulfilled" && responses[5].value.ok) {
          try {
            const templatesData = await responses[5].value.json()
            setTiposInicio(templatesData.tipos_inicio || fallbackData.tipos_inicio)
          } catch {
            hasErrors = true
          }
        } else {
          hasErrors = true
        }

        setIsOnline(!hasErrors)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setIsOnline(false)
      }
    }

    loadData()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Converter contadores para formato do store
    const convertCountersToItems = (counters: Record<number, number>, itemsList: any[]) => {
      return Object.entries(counters)
        .filter(([_, count]) => count > 0)
        .map(([id, quantidade]) => {
          const item = itemsList.find((i) => i.id.toString() === id)
          return {
            id,
            nome: item?.nome || "Item não identificado",
            quantidade,
            unidade: item?.unidade || "un",
            categoria: item?.categoria,
          }
        })
    }

    // Converter contadores genéricos para itens
    const convertGenericCountersToItems = () => {
      const genericItems = []
      
      if (genericCounters.entorpecentes_genericos > 0) {
        genericItems.push({
          id: 'generic_entorpecentes',
          nome: 'Entorpecentes (genérico)',
          quantidade: genericCounters.entorpecentes_genericos,
          unidade: 'un',
          categoria: 'Genérico',
        })
      }
      
      if (genericCounters.ferramentas_genericas > 0) {
        genericItems.push({
          id: 'generic_ferramentas',
          nome: 'Ferramentas (genérico)',
          quantidade: genericCounters.ferramentas_genericas,
          unidade: 'un',
          categoria: 'Genérico',
        })
      }
      
      if (genericCounters.municoes_genericas > 0) {
        genericItems.push({
          id: 'generic_municoes',
          nome: 'Munições (genérico)',
          quantidade: genericCounters.municoes_genericas,
          unidade: 'un',
          categoria: 'Genérico',
        })
      }
      
      if (genericCounters.produtos_genericos > 0) {
        genericItems.push({
          id: 'generic_produtos',
          nome: 'Produtos (genérico)',
          quantidade: genericCounters.produtos_genericos,
          unidade: 'un',
          categoria: 'Genérico',
        })
      }
      
      if (genericCounters.armas_genericas > 0) {
        genericItems.push({
          id: 'generic_armas',
          nome: 'Armas (genérico)',
          quantidade: genericCounters.armas_genericas,
          unidade: 'un',
          categoria: 'Genérico',
        })
      }
      
      return genericItems
    }

    const updatedFormData = {
      ...formData,
      ferramentas_selecionadas: [
        ...convertCountersToItems(quickCounters.ferramentas, ferramentas),
        ...(genericCounters.ferramentas_genericas > 0 ? [{
          id: 'generic_ferramentas',
          nome: 'Ferramentas (genérico)',
          quantidade: genericCounters.ferramentas_genericas,
          unidade: 'un',
          categoria: 'Genérico',
        }] : [])
      ],
      entorpecentes_selecionados: [
        ...convertCountersToItems(quickCounters.entorpecentes, entorpecentes),
        ...(genericCounters.entorpecentes_genericos > 0 ? [{
          id: 'generic_entorpecentes',
          nome: 'Entorpecentes (genérico)',
          quantidade: genericCounters.entorpecentes_genericos,
          unidade: 'un',
          categoria: 'Genérico',
        }] : [])
      ],
      municoes_selecionadas: [
        ...convertCountersToItems(quickCounters.municoes, municoes),
        ...(genericCounters.municoes_genericas > 0 ? [{
          id: 'generic_municoes',
          nome: 'Munições (genérico)',
          quantidade: genericCounters.municoes_genericas,
          unidade: 'un',
          categoria: 'Genérico',
        }] : [])
      ],
      produtos_selecionados: [
        ...convertCountersToItems(quickCounters.produtos, produtos),
        ...(genericCounters.produtos_genericos > 0 ? [{
          id: 'generic_produtos',
          nome: 'Produtos (genérico)',
          quantidade: genericCounters.produtos_genericos,
          unidade: 'un',
          categoria: 'Genérico',
        }] : [])
      ],
      armas_selecionadas: [
        ...convertCountersToItems(quickCounters.armas, armas),
        ...(genericCounters.armas_genericas > 0 ? [{
          id: 'generic_armas',
          nome: 'Armas (genérico)',
          quantidade: genericCounters.armas_genericas,
          unidade: 'un',
          categoria: 'Genérico',
        }] : [])
      ],
      desobediencia_penalidade: formData.desobediencia ? desobedienciaPenalty[0] : 0,
    }

    setFormData(updatedFormData)
    generateReport()
    calculatePenalty()
    onFormSubmit()
  }

  const updateCounter = (category: keyof typeof quickCounters, itemId: number, change: number) => {
    setQuickCounters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [itemId]: Math.max(0, (prev[category][itemId] || 0) + change),
      },
    }))
  }

  const setCounterValue = (category: keyof typeof quickCounters, itemId: number, value: number) => {
    setQuickCounters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [itemId]: Math.max(0, value),
      },
    }))
  }

  const updateGenericCounter = (category: keyof typeof genericCounters, change: number) => {
    setGenericCounters((prev) => ({
      ...prev,
      [category]: Math.max(0, prev[category] + change),
    }))
  }

  const setGenericCounterValue = (category: keyof typeof genericCounters, value: number) => {
    setGenericCounters((prev) => ({
      ...prev,
      [category]: Math.max(0, value),
    }))
  }

  const updateFormDataWithRegeneration = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })

    if (showResults) {
      setTimeout(() => {
        generateReport()
        calculatePenalty()
        onCalculationUpdate?.()
      }, 100)
    }
  }

  const QuickCounter = ({ category, item }: { category: keyof typeof quickCounters; item: any }) => {
    const count = quickCounters[category][item.id] || 0
    const [isHolding, setIsHolding] = useState(false)
    const [holdTimeout, setHoldTimeout] = useState<NodeJS.Timeout | null>(null)
    const [holdInterval, setHoldInterval] = useState<NodeJS.Timeout | null>(null)

    const startHold = (change: number, event: React.MouseEvent | React.TouchEvent) => {
      event.preventDefault()
      setIsHolding(true)
      updateCounter(category, item.id, change)
      
      const timeout = setTimeout(() => {
        if (isHolding) { // Check if still holding before starting interval
          const interval = setInterval(() => {
            updateCounter(category, item.id, change)
          }, 100) // Increment every 100ms when holding
          setHoldInterval(interval)
        }
      }, 500) // Start rapid increment after 500ms
      
      setHoldTimeout(timeout)
    }

    const stopHold = () => {
      setIsHolding(false)
      if (holdTimeout) {
        clearTimeout(holdTimeout)
        setHoldTimeout(null)
      }
      if (holdInterval) {
        clearInterval(holdInterval)
        setHoldInterval(null)
      }
    }

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (holdTimeout) clearTimeout(holdTimeout)
        if (holdInterval) clearInterval(holdInterval)
      }
    }, [holdTimeout, holdInterval])

    return (
      <div className="flex items-center justify-between p-2 dark-secondary-bg rounded border dark-border hover:bg-gray-700/50 transition-colors">
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium dark-text truncate">{item.nome}</span>
          {item.categoria && <span className="text-xs dark-text-soft ml-2">({item.categoria})</span>}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onMouseDown={(e) => startHold(-1, e)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={(e) => startHold(-1, e)}
            onTouchEnd={stopHold}
            disabled={count === 0}
            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <FixedNumericInput
            value={count}
            onChange={(value) => setCounterValue(category, item.id, value)}
            min={0}
            className="w-12 h-6 text-center text-sm font-bold bg-gray-800 border-gray-600 text-white px-1"
          />
          
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onMouseDown={(e) => startHold(1, e)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={(e) => startHold(1, e)}
            onTouchEnd={stopHold}
            className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  const GenericCounter = ({ category, title, emoji }: { category: keyof typeof genericCounters; title: string; emoji: string }) => {
    const count = genericCounters[category]
    const [holdTimeout, setHoldTimeout] = useState<NodeJS.Timeout | null>(null)
    const [holdInterval, setHoldInterval] = useState<NodeJS.Timeout | null>(null)

    const startHold = (change: number, event: React.MouseEvent | React.TouchEvent) => {
      event.preventDefault()
      updateGenericCounter(category, change)
      
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          updateGenericCounter(category, change)
        }, 100)
        setHoldInterval(interval)
      }, 500)
      
      setHoldTimeout(timeout)
    }
    
    const stopHold = () => {
      if (holdTimeout) {
        clearTimeout(holdTimeout)
        setHoldTimeout(null)
      }
      if (holdInterval) {
        clearInterval(holdInterval)
        setHoldInterval(null)
      }
    }

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (holdTimeout) clearTimeout(holdTimeout)
        if (holdInterval) clearInterval(holdInterval)
      }
    }, [holdTimeout, holdInterval])

    return (
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span className="text-sm font-semibold text-indigo-300">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onMouseDown={(e) => startHold(-1, e)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={(e) => startHold(-1, e)}
            onTouchEnd={stopHold}
            disabled={count === 0}
            className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <FixedNumericInput
            value={count}
            onChange={(value) => setGenericCounterValue(category, value)}
            min={0}
            className="w-16 h-7 text-center text-sm font-bold bg-gray-800 border-indigo-500/50 text-white"
          />
          
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onMouseDown={(e) => startHold(1, e)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={(e) => startHold(1, e)}
            onTouchEnd={stopHold}
            className="h-7 w-7 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 flex-1 flex flex-col min-h-0">
      {/* Indicador de status */}
      {!isOnline && (
        <Card className="bg-yellow-500/10 border border-yellow-500/30 flex-shrink-0">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-yellow-400" />
              <p className="text-sm text-yellow-300">Modo Offline - Dados básicos</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="police-card-dark flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-4 flex-shrink-0">
          <CardTitle className="text-xl dark-highlight font-bold flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {showResults ? "Editar Ocorrência" : "Nova Ocorrência"}
            {showResults && <Badge className="gradient-primary dark-cta-text text-xs">Editável</Badge>}
            {isOnline && <Wifi className="h-4 w-4 text-green-400" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 min-h-0 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
            {/* Tipo de início - Grid de 6 colunas para acomodar todos os tipos */}
            <div className="space-y-2 flex-shrink-0">
              <Label className="text-sm font-semibold dark-text">Como iniciou?</Label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {tiposInicio.map((tipo) => (
                  <Button
                    key={tipo.id}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFormDataWithRegeneration("tipo_inicio", tipo.id)}
                    className={`h-12 flex flex-col items-center gap-1 text-xs transition-all ${
                      formData.tipo_inicio === tipo.id
                        ? "gradient-primary dark-cta-text shadow-md"
                        : "dark-secondary-bg dark-text hover:dark-hover"
                    }`}
                  >
                    <span className="text-base">{tipo.emoji}</span>
                    <span className="font-medium leading-tight text-center">{tipo.nome}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Dados básicos - Grid compacto com autocompletes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-shrink-0">
              <IntelligentAutocomplete
                value={formData.tipo_crime}
                onChange={(value) => updateFormDataWithRegeneration("tipo_crime", value)}
                options={crimes}
                placeholder="Ex: Tráfico de Drogas"
                label="Crime"
                required
                fieldType="crime"
                allowCustom={true}
                emptyMessage="Nenhum crime encontrado"
              />
              
              <IntelligentAutocomplete
                value={formData.local_inicio}
                onChange={(value) => updateFormDataWithRegeneration("local_inicio", value)}
                options={locations}
                placeholder="Ex: Los Santos Central"
                label="Local de Início"
                required
                fieldType="location"
                allowCustom={true}
                emptyMessage="Nenhum local encontrado"
              />
              
              <IntelligentAutocomplete
                value={formData.local_prisao}
                onChange={(value) => updateFormDataWithRegeneration("local_prisao", value)}
                options={locations}
                placeholder="Ex: Próximo a Arcadius"
                label="Local de Prisão"
                required
                fieldType="location"
                allowCustom={true}
                emptyMessage="Nenhum local encontrado"
              />
              
              <IntelligentAutocomplete
                value={formData.veiculo}
                onChange={(value) => updateFormDataWithRegeneration("veiculo", value)}
                options={[]} // Empty array for now, can add vehicle data later
                placeholder="Ex: Elegy RH5 Preto - A1BC1234"
                label="Veículo"
                fieldType="location"
                allowCustom={true}
                emptyMessage="Digite o veículo"
              />
            </div>

            {/* Número de pessoas envolvidas */}
            <div className="flex-shrink-0">
              <PeopleCount
                value={formData.numero_pessoas_envolvidas}
                onChange={(value) => updateFormDataWithRegeneration("numero_pessoas_envolvidas", value)}
                required={true}
                min={1}
                max={10}
                variant="both"
              />
            </div>

            {/* Desobediência - Slider */}
            <div className="space-y-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex-shrink-0">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={formData.desobediencia}
                  onCheckedChange={(checked) => {
                    updateFormDataWithRegeneration("desobediencia", checked)
                    if (!checked) {
                      setDesobedienciaPenalty([30]) // Reset to default when unchecked
                    }
                  }}
                  className="border-red-400"
                />
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-red-300">Desobediência</span>
                </div>
                {formData.desobediencia && (
                  <Badge className="bg-red-500 text-white text-xs">+{desobedienciaPenalty[0]} meses</Badge>
                )}
              </div>
              
              {formData.desobediencia && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-red-300">
                    <span>Penalidade: {desobedienciaPenalty[0]} meses</span>
                    <div className="flex gap-4">
                      <span>Min: 25</span>
                      <span>Max: 50</span>
                    </div>
                  </div>
                  <Slider
                    value={desobedienciaPenalty}
                    onValueChange={setDesobedienciaPenalty}
                    max={50}
                    min={25}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Quantidades Genéricas - Seção rápida para especificar apenas totais */}
            <div className="space-y-3 flex-shrink-0">
              <h3 className="text-lg font-bold dark-highlight flex items-center gap-2">
                🔢 Quantidades Genéricas
                <Badge className="bg-indigo-500/20 text-indigo-400 text-xs">Opcional</Badge>
              </h3>
              <p className="text-xs dark-text-soft">
                💡 Use esta seção quando não precisar especificar itens exatos. Ex: "30 entorpecentes" em vez de "10 maconha + 10 cocaína + 10 crack"
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <GenericCounter 
                  category="entorpecentes_genericos" 
                  title="Entorpecentes Genéricos"
                  emoji="💊"
                />
                <GenericCounter 
                  category="ferramentas_genericas" 
                  title="Ferramentas Genéricas"
                  emoji="🔧"
                />
                <GenericCounter 
                  category="municoes_genericas" 
                  title="Munições Genéricas"
                  emoji="🔫"
                />
                <GenericCounter 
                  category="produtos_genericos" 
                  title="Produtos Genéricos"
                  emoji="📱"
                />
                <GenericCounter 
                  category="armas_genericas" 
                  title="Armas Genéricas"
                  emoji="🎯"
                />
              </div>
            </div>

            {/* Itens Apreendidos - Contadores Rápidos com Scroll - Esta seção pode crescer */}
            <div className="space-y-3 flex-1 min-h-0">
              <h3 className="text-lg font-bold dark-highlight flex items-center gap-2">
                📋 Itens Específicos (clique +/- ou digite)
                <Badge className="bg-gray-500/20 text-gray-400 text-xs">Detalhado</Badge>
              </h3>
              <p className="text-xs dark-text-soft">💡 Role dentro dos cards para ver mais opções. Use apenas se precisar especificar itens exatos.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 min-h-0">
                {/* Ferramentas */}
                <Card className="police-card-compact flex flex-col min-h-0">
                  <CardHeader className="pb-2 flex-shrink-0">
                    <CardTitle className="text-sm dark-text flex items-center gap-2">
                      🔧 Ferramentas
                      <span className="text-xs dark-text-soft">(10 + itens×10)</span>
                      <Badge className="bg-blue-500/20 text-blue-400 text-xs">{ferramentas.length} opções</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 min-h-0">
                    <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 px-3 pb-3">
                      <div className="space-y-1">
                        {ferramentas.map((item) => (
                          <QuickCounter key={item.id} category="ferramentas" item={item} />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Entorpecentes */}
                <Card className="police-card-compact flex flex-col min-h-0">
                  <CardHeader className="pb-2 flex-shrink-0">
                    <CardTitle className="text-sm dark-text flex items-center gap-2">
                      💊 Entorpecentes
                      <span className="text-xs dark-text-soft">(15 + itens÷2)</span>
                      <Badge className="bg-purple-500/20 text-purple-400 text-xs">{entorpecentes.length} opções</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 min-h-0">
                    <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 px-3 pb-3">
                      <div className="space-y-1">
                        {entorpecentes.map((item) => (
                          <QuickCounter key={item.id} category="entorpecentes" item={item} />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Munições */}
                <Card className="police-card-compact flex flex-col min-h-0">
                  <CardHeader className="pb-2 flex-shrink-0">
                    <CardTitle className="text-sm dark-text flex items-center gap-2">
                      🔫 Munições
                      <span className="text-xs dark-text-soft">(15 + grupos/20×5)</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">{municoes.length} opções</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 min-h-0">
                    <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 px-3 pb-3">
                      <div className="space-y-1">
                        {municoes.map((item) => (
                          <QuickCounter key={item.id} category="municoes" item={item} />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Armas */}
                <Card className="police-card-compact flex flex-col min-h-0">
                  <CardHeader className="pb-2 flex-shrink-0">
                    <CardTitle className="text-sm dark-text flex items-center gap-2">
                      🎯 Armas
                      <span className="text-xs dark-text-soft">(20 + armas×15)</span>
                      <Badge className="bg-red-500/20 text-red-400 text-xs">{armas.length} opções</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 min-h-0">
                    <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 px-3 pb-3">
                      <div className="space-y-1">
                        {armas.map((item) => (
                          <QuickCounter key={item.id} category="armas" item={item} />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Produtos */}
                <Card className="police-card-compact flex flex-col min-h-0">
                  <CardHeader className="pb-2 flex-shrink-0">
                    <CardTitle className="text-sm dark-text flex items-center gap-2">
                      📱 Produtos
                      <span className="text-xs dark-text-soft">(10 + itens×2)</span>
                      <Badge className="bg-green-500/20 text-green-400 text-xs">{produtos.length} opções</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 min-h-0">
                    <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 px-3 pb-3">
                      <div className="space-y-1">
                        {produtos.map((item) => (
                          <QuickCounter key={item.id} category="produtos" item={item} />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Valores monetários - Inline com inputs numéricos melhorados */}
            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              <FixedNumericInput
                value={formData.dinheiro_ilicito}
                onChange={(value) => updateFormDataWithRegeneration("dinheiro_ilicito", value)}
                label="Dinheiro Ilícito"
                placeholder="0,00"
                prefix="R$"
                step={0.01}
                min={0}
                className="h-9"
              />
              
              <FixedNumericInput
                value={formData.multas_pendentes}
                onChange={(value) => updateFormDataWithRegeneration("multas_pendentes", value)}
                label="Multas Pendentes"
                placeholder="0,00"
                prefix="R$"
                step={0.01}
                min={0}
                className="h-9"
              />
            </div>

            {/* Observações - Compacto */}
            <div className="flex-shrink-0">
              <label className="text-sm font-semibold dark-text">Observações</label>
              <Textarea
                value={formData.observacoes}
                onChange={(e) => updateFormDataWithRegeneration("observacoes", e.target.value)}
                placeholder="Informações adicionais..."
                rows={3}
                className="textarea-dark"
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-primary-dark py-3 text-base font-bold transition-all duration-300 transform hover:scale-105 flex-shrink-0"
            >
              {showResults ? "🔄 Atualizar" : "⚡ Gerar Relatório"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}