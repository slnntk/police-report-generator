"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useOccurrenceStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  Plus, 
  Minus, 
  Zap, 
  Save, 
  CheckCircle, 
  ChevronDown,
  ChevronRight,
  Users,
  MapPin,
  Car,
  DollarSign,
  FileText,
  Package
} from "lucide-react"
import { IntelligentAutocomplete } from "@/components/IntelligentAutocomplete"
import { FixedNumericInput } from "@/components/FixedNumericInput"
import { PeopleCount } from "@/components/PeopleCount"
import { CRIMES_LIST, QTH_LIST } from "@/lib/autocomplete-data"
import { InlineLoader } from "@/components/EnhancedLoadingSpinner"
import { usePoliceToast } from "@/components/ui/enhanced-toast"

interface CompactOccurrenceFormProps {
  onFormSubmit: () => void
  showResults: boolean
  onCalculationUpdate?: () => void
}

// Dados de fallback simplificados
const fallbackData = {
  ferramentas: [
    { id: 1, nome: "Lockpick", categoria: "Arrombamento" },
    { id: 2, nome: "Chave Micha", categoria: "Arrombamento" },
    { id: 3, nome: "Furadeira", categoria: "Arrombamento" },
  ],
  entorpecentes: [
    { id: 1, nome: "Maconha", unidade: "gramas", categoria: "Cannabis" },
    { id: 2, nome: "Cocaína", unidade: "gramas", categoria: "Estimulante" },
    { id: 3, nome: "Metanfetamina", unidade: "gramas", categoria: "Sintético" },
  ],
  municoes: [
    { id: 1, nome: "Munição de Revólver .38", calibre: "38", tipo: "Revólver" },
    { id: 2, nome: "Munição de Pistola .380", calibre: "380", tipo: "Pistola" },
    { id: 3, nome: "Munição de Glock 9mm", calibre: "9", tipo: "Pistola" },
    { id: 4, nome: "Munição de Pistola .40", calibre: "40", tipo: "Pistola" },
    { id: 5, nome: "Munição de Pistola .45", calibre: "45", tipo: "Pistola" },
    { id: 6, nome: "Munição de Espingarda Cal. 12", calibre: "12", tipo: "Espingarda" },
    { id: 7, nome: "Munição de Rifle .22", calibre: "22", tipo: "Rifle" },
    { id: 8, nome: "Munição de AK-47", calibre: "7.62", tipo: "Fuzil" },
    { id: 9, nome: "Munição de Five Seven", calibre: "5.7", tipo: "Pistola" },
    { id: 10, nome: "Munição de MP5", calibre: "9", tipo: "Submetralhadora" },
    { id: 11, nome: "Munição de MPX", calibre: "9", tipo: "Submetralhadora" },
    { id: 12, nome: "Munição de M4A1", calibre: "5.56", tipo: "Fuzil" },
    { id: 13, nome: "Munição de AUG", calibre: "5.56", tipo: "Fuzil" },
    { id: 14, nome: "Munição de Desert Eagle", calibre: ".50", tipo: "Pistola" },
  ],
  produtos: [
    { id: 1, nome: "Celular", categoria: "Eletrônicos", valor_medio: 800 },
    { id: 2, nome: "Notebook", categoria: "Eletrônicos", valor_medio: 2500 },
    { id: 3, nome: "Televisão", categoria: "Eletrônicos", valor_medio: 1500 },
    { id: 4, nome: "Bicicleta", categoria: "Veículos", valor_medio: 600 },
    { id: 5, nome: "Motocicleta", categoria: "Veículos", valor_medio: 8000 },
    { id: 6, nome: "Automóvel", categoria: "Veículos", valor_medio: 25000 },
    { id: 7, nome: "Joias", categoria: "Objetos de valor", valor_medio: 1200 },
    { id: 8, nome: "Relógio", categoria: "Objetos de valor", valor_medio: 900 },
  ],
  armas: [
    { id: 1, nome: "Glock 9mm", categoria: "Pistola", calibre: "9mm" },
    { id: 2, nome: "Five Seven", categoria: "Pistola", calibre: "5.7mm" },
    { id: 3, nome: "Desert Eagle", categoria: "Pistola", calibre: ".50" },
    { id: 4, nome: "Revólver .38", categoria: "Revólver", calibre: "38" },
    { id: 5, nome: "MP5", categoria: "Submetralhadora", calibre: "9mm" },
    { id: 6, nome: "MPX", categoria: "Submetralhadora", calibre: "9mm" },
    { id: 7, nome: "AK-47", categoria: "Fuzil", calibre: "7.62mm" },
    { id: 8, nome: "M4A1", categoria: "Fuzil", calibre: "5.56mm" },
    { id: 9, nome: "AUG", categoria: "Fuzil", calibre: "5.56mm" },
    { id: 10, nome: "Espingarda Cal. 12", categoria: "Escopeta", calibre: "12" },
  ],
  tipos_inicio: [
    { id: "abordagem", nome: "Abordagem Policial", emoji: "🚔" },
    { id: "fuga", nome: "Tentativa de Fuga", emoji: "🏃" },
    { id: "disparo", nome: "Disparo de Arma de Fogo", emoji: "🔫" },
    { id: "denuncia", nome: "Denúncia Anônima", emoji: "📞" },
    { id: "flagrante", nome: "Flagrante Delito", emoji: "👁️" },
    { id: "corrida", nome: "Corrida Ilegal", emoji: "🏎️" },
  ],
}

export function CompactOccurrenceForm({ onFormSubmit, showResults, onCalculationUpdate }: CompactOccurrenceFormProps) {
  const { formData, setFormData, generateReport, calculatePenalty } = useOccurrenceStore()
  const { success, error, warning, info, formSaved, connectionError } = usePoliceToast()

  const [ferramentas, setFerramentas] = useState(fallbackData.ferramentas)
  const [entorpecentes, setEntorpecentes] = useState(fallbackData.entorpecentes)
  const [municoes, setMunicoes] = useState(fallbackData.municoes)
  const [produtos, setProdutos] = useState(fallbackData.produtos)
  const [armas, setArmas] = useState(fallbackData.armas)
  const [tiposInicio, setTiposInicio] = useState(fallbackData.tipos_inicio)
  const [isOnline, setIsOnline] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Accordion states
  const [openSections, setOpenSections] = useState({
    basic: true,
    people: false,
    disobedience: false,
    generic: false,
    specific: false,
    money: false,
    notes: false,
  })
  
  // New state for autocomplete data
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

  // Auto-save functionality
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()
  
  const autoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      setIsSaving(true)
      try {
        localStorage.setItem('police-form-data', JSON.stringify(formData))
        setTimeout(() => {
          setIsSaving(false)
          if (Object.keys(formData).some(key => formData[key as keyof typeof formData])) {
            formSaved()
          }
        }, 500)
      } catch (err) {
        setIsSaving(false)
        error('Erro ao salvar', 'Não foi possível salvar os dados automaticamente')
      }
    }, 2000)
  }, [formData, formSaved, error])

  useEffect(() => {
    autoSave()
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [autoSave])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Try to load saved form data
        const savedData = localStorage.getItem('police-form-data')
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData)
            setFormData(parsedData)
            info('Dados recuperados', 'Formulário restaurado automaticamente')
          } catch (err) {
            warning('Erro ao recuperar dados', 'Não foi possível restaurar o formulário salvo')
          }
        }

        const responses = await Promise.allSettled([
          fetch("/data/ferramentas.json"),
          fetch("/data/entorpecentes.json"),
          fetch("/data/municoes.json"),
          fetch("/data/produtos.json"),
          fetch("/data/armas.json"),
          fetch("/data/templates.json"),
        ])

        let hasErrors = false

        // Load data with simplified error handling
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
        if (hasErrors) {
          connectionError()
        } else {
          success('Dados carregados', 'Todas as informações foram carregadas com sucesso')
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        setIsOnline(false)
        connectionError()
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [success, connectionError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Convert counters to store format
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

    // Validate required fields
    const requiredFields = ['crime', 'local_inicio', 'local_prisao']
    const missingFields = requiredFields.filter(field => !updatedFormData[field as keyof typeof updatedFormData])
    
    if (missingFields.length > 0) {
      error('Campos obrigatórios', `Preencha: ${missingFields.join(', ')}`)
      setIsSaving(false)
      return
    }

    setFormData(updatedFormData)
    await generateReport()
    await calculatePenalty()
    
    success('Relatório gerado', 'Relatório policial gerado com sucesso!')
    onFormSubmit()
    
    } catch (err) {
      console.error('Erro ao gerar relatório:', err)
      error('Erro no sistema', 'Não foi possível gerar o relatório. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
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

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const QuickCounter = ({ category, item }: { category: keyof typeof quickCounters; item: any }) => {
    const count = quickCounters[category][item.id] || 0
    const isHoldingRef = useRef(false)
    const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const holdIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const lastClickTimeRef = useRef<number>(0)

    const startHold = (change: number, event: React.MouseEvent | React.TouchEvent) => {
      event.preventDefault()
      
      if (isHoldingRef.current) return
      
      const now = Date.now()
      if (now - lastClickTimeRef.current < 50) return
      lastClickTimeRef.current = now
      
      isHoldingRef.current = true
      updateCounter(category, item.id, change)
      
      holdTimeoutRef.current = setTimeout(() => {
        if (isHoldingRef.current) {
          holdIntervalRef.current = setInterval(() => {
            if (isHoldingRef.current) {
              updateCounter(category, item.id, change)
            }
          }, 150)
        }
      }, 500)
    }

    const stopHold = () => {
      isHoldingRef.current = false
      
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current)
        holdTimeoutRef.current = null
      }
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current)
        holdIntervalRef.current = null
      }
    }

    useEffect(() => {
      return () => {
        stopHold()
      }
    }, [])

    return (
      <div className="flex items-center justify-between p-2 dark-secondary-bg rounded border dark-border hover:bg-gray-700/50 transition-colors">
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium dark-text truncate">{item.nome}</span>
          {item.categoria && <span className="text-xs dark-text-soft ml-1">({item.categoria})</span>}
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
            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <FixedNumericInput
            value={count}
            onChange={(value) => setCounterValue(category, item.id, value)}
            min={0}
            className="w-12 h-6 text-center text-xs font-bold bg-gray-800 border-gray-600 text-white"
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
            className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/20"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  const GenericCounter = ({ category, title, emoji }: { category: keyof typeof genericCounters; title: string; emoji: string }) => {
    const count = genericCounters[category]

    return (
      <div className="flex items-center justify-between p-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded border border-indigo-500/30">
        <div className="flex items-center gap-2">
          <span className="text-sm">{emoji}</span>
          <span className="text-xs font-semibold text-indigo-300">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => updateGenericCounter(category, -1)}
            disabled={count === 0}
            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/25"
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <FixedNumericInput
            value={count}
            onChange={(value) => setGenericCounterValue(category, value)}
            min={0}
            className="w-14 h-6 text-center text-xs font-bold bg-gray-800 border-indigo-500/50 text-white"
          />
          
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => updateGenericCounter(category, 1)}
            className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/25"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full max-h-[calc(100vh-120px)] flex flex-col">
      {/* Loading State */}
      {isLoading && (
        <InlineLoader 
          message="Carregando dados da ocorrência..." 
          variant="form"
          className="mb-2"
        />
      )}

      {/* Auto-save indicator */}
      {isSaving && (
        <div className="fixed top-4 right-4 z-50 bg-green-900/90 text-green-100 px-3 py-2 rounded-lg border border-green-500/30 flex items-center gap-2">
          <Save className="h-4 w-4 animate-pulse" />
          <span className="text-sm">Salvando...</span>
        </div>
      )}

      {/* Status indicator */}
      {!isOnline && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-2 rounded mb-2">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4 text-yellow-400" />
            <p className="text-xs text-yellow-300">Modo Offline - Dados básicos</p>
          </div>
        </div>
      )}

      <Card className="police-card-dark flex-1 flex flex-col overflow-hidden">
        <CardHeader className="py-3 flex-shrink-0">
          <CardTitle className="text-lg dark-highlight font-bold flex items-center gap-2 flex-wrap">
            <Zap className="h-4 w-4" />
            {showResults ? "Editar Ocorrência" : "Nova Ocorrência"}
            {showResults && <Badge className="gradient-primary dark-cta-text text-xs">Editável</Badge>}
            {isOnline && <Wifi className="h-4 w-4 text-green-400" />}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto scrollbar-thin p-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Tipo de início - Compact grid */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold dark-text">Como iniciou?</Label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
                {tiposInicio.map((tipo) => (
                  <Button
                    key={tipo.id}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFormDataWithRegeneration("tipo_inicio", tipo.id)}
                    className={`h-10 flex flex-col items-center gap-1 text-xs transition-all ${
                      formData.tipo_inicio === tipo.id
                        ? "gradient-primary dark-cta-text shadow-md"
                        : "dark-secondary-bg dark-text hover:dark-hover"
                    }`}
                  >
                    <span className="text-sm">{tipo.emoji}</span>
                    <span className="font-medium leading-tight text-center text-xs">{tipo.nome.split(' ')[0]}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Basic Information - Accordion */}
            <Collapsible open={openSections.basic} onOpenChange={() => toggleSection('basic')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-semibold">Dados Básicos</span>
                    <Badge className="text-xs">Obrigatório</Badge>
                  </div>
                  {openSections.basic ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                    options={[]}
                    placeholder="Ex: Elegy RH5 Preto - A1BC1234"
                    label="Veículo"
                    fieldType="location"
                    allowCustom={true}
                    emptyMessage="Digite o veículo"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* People Count - Accordion */}
            <Collapsible open={openSections.people} onOpenChange={() => toggleSection('people')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-semibold">Pessoas Envolvidas</span>
                    <Badge className="text-xs">{formData.numero_pessoas_envolvidas || 1}</Badge>
                  </div>
                  {openSections.people ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <PeopleCount
                  value={formData.numero_pessoas_envolvidas}
                  onChange={(value) => updateFormDataWithRegeneration("numero_pessoas_envolvidas", value)}
                  required={true}
                  min={1}
                  max={10}
                  variant="compact"
                />
              </CollapsibleContent>
            </Collapsible>

            {/* Disobedience - Accordion */}
            <Collapsible open={openSections.disobedience} onOpenChange={() => toggleSection('disobedience')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-semibold">Desobediência</span>
                    {formData.desobediencia && <Badge className="bg-red-500 text-white text-xs">+{desobedienciaPenalty[0]}m</Badge>}
                  </div>
                  {openSections.disobedience ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className="space-y-2 p-3 bg-red-500/10 border border-red-500/30 rounded">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.desobediencia}
                      onCheckedChange={(checked) => {
                        updateFormDataWithRegeneration("desobediencia", checked)
                        if (!checked) {
                          setDesobedienciaPenalty([30])
                        }
                      }}
                      className="border-red-400"
                    />
                    <span className="text-sm font-semibold text-red-300">Desobediência</span>
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
              </CollapsibleContent>
            </Collapsible>

            {/* Generic Items - Accordion */}
            <Collapsible open={openSections.generic} onOpenChange={() => toggleSection('generic')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="text-sm font-semibold">Quantidades Genéricas</span>
                    <Badge className="bg-indigo-500/20 text-indigo-400 text-xs">Opcional</Badge>
                  </div>
                  {openSections.generic ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className="space-y-2">
                  <p className="text-xs dark-text-soft">
                    💡 Use para totais rápidos sem especificar itens exatos
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <GenericCounter 
                      category="entorpecentes_genericos" 
                      title="Entorpecentes"
                      emoji="💊"
                    />
                    <GenericCounter 
                      category="ferramentas_genericas" 
                      title="Ferramentas"
                      emoji="🔧"
                    />
                    <GenericCounter 
                      category="municoes_genericas" 
                      title="Munições"
                      emoji="🔫"
                    />
                    <GenericCounter 
                      category="produtos_genericos" 
                      title="Produtos"
                      emoji="📱"
                    />
                    <GenericCounter 
                      category="armas_genericas" 
                      title="Armas"
                      emoji="🎯"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Specific Items - Accordion with Tabs */}
            <Collapsible open={openSections.specific} onOpenChange={() => toggleSection('specific')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="text-sm font-semibold">Itens Específicos</span>
                    <Badge className="bg-gray-500/20 text-gray-400 text-xs">Detalhado</Badge>
                  </div>
                  {openSections.specific ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className="space-y-2">
                  <p className="text-xs dark-text-soft">💡 Para especificar itens exatos com quantidades</p>
                  
                  {/* Simplified tabs for items */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {/* Tools */}
                    <div className="police-card-compact">
                      <div className="p-2">
                        <div className="text-xs font-semibold dark-text flex items-center gap-1">
                          🔧 <span>Ferramentas</span>
                        </div>
                        <div className="max-h-24 overflow-y-auto scrollbar-thin mt-1 space-y-1">
                          {ferramentas.slice(0, 3).map((item) => (
                            <QuickCounter key={item.id} category="ferramentas" item={item} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Drugs */}
                    <div className="police-card-compact">
                      <div className="p-2">
                        <div className="text-xs font-semibold dark-text flex items-center gap-1">
                          💊 <span>Entorpecentes</span>
                        </div>
                        <div className="max-h-24 overflow-y-auto scrollbar-thin mt-1 space-y-1">
                          {entorpecentes.slice(0, 3).map((item) => (
                            <QuickCounter key={item.id} category="entorpecentes" item={item} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Weapons */}
                    <div className="police-card-compact">
                      <div className="p-2">
                        <div className="text-xs font-semibold dark-text flex items-center gap-1">
                          🎯 <span>Armas</span>
                        </div>
                        <div className="max-h-24 overflow-y-auto scrollbar-thin mt-1 space-y-1">
                          {armas.slice(0, 3).map((item) => (
                            <QuickCounter key={item.id} category="armas" item={item} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Ammo */}
                    <div className="police-card-compact">
                      <div className="p-2">
                        <div className="text-xs font-semibold dark-text flex items-center gap-1">
                          🔫 <span>Munições</span>
                        </div>
                        <div className="max-h-24 overflow-y-auto scrollbar-thin mt-1 space-y-1">
                          {municoes.slice(0, 3).map((item) => (
                            <QuickCounter key={item.id} category="municoes" item={item} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="police-card-compact">
                      <div className="p-2">
                        <div className="text-xs font-semibold dark-text flex items-center gap-1">
                          📱 <span>Produtos</span>
                        </div>
                        <div className="max-h-24 overflow-y-auto scrollbar-thin mt-1 space-y-1">
                          {produtos.slice(0, 3).map((item) => (
                            <QuickCounter key={item.id} category="produtos" item={item} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Money - Accordion */}
            <Collapsible open={openSections.money} onOpenChange={() => toggleSection('money')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-semibold">Valores Monetários</span>
                  </div>
                  {openSections.money ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <FixedNumericInput
                    value={formData.dinheiro_ilicito}
                    onChange={(value) => updateFormDataWithRegeneration("dinheiro_ilicito", value)}
                    label="Dinheiro Ilícito"
                    placeholder="0,00"
                    prefix="R$"
                    step={0.01}
                    min={0}
                    className="h-8"
                  />
                  
                  <FixedNumericInput
                    value={formData.multas_pendentes}
                    onChange={(value) => updateFormDataWithRegeneration("multas_pendentes", value)}
                    label="Multas Pendentes"
                    placeholder="0,00"
                    prefix="R$"
                    step={0.01}
                    min={0}
                    className="h-8"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Notes - Accordion */}
            <Collapsible open={openSections.notes} onOpenChange={() => toggleSection('notes')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-semibold">Observações</span>
                  </div>
                  {openSections.notes ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => updateFormDataWithRegeneration("observacoes", e.target.value)}
                  placeholder="Informações adicionais..."
                  rows={2}
                  className="textarea-dark"
                />
              </CollapsibleContent>
            </Collapsible>
          </form>
        </CardContent>
        
        {/* Fixed submit button */}
        <div className="p-3 border-t dark-border flex-shrink-0">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving || isLoading}
            className="w-full btn-primary-dark py-2 text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gerando...
              </div>
            ) : showResults ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                🔄 Atualizar
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                ⚡ Gerar Relatório
              </div>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}