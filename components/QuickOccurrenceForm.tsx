"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useOccurrenceStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, Wifi, WifiOff, Plus, Minus, Zap } from "lucide-react"

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

  // Estados para contadores rápidos
  const [quickCounters, setQuickCounters] = useState({
    ferramentas: {} as Record<number, number>,
    entorpecentes: {} as Record<number, number>,
    municoes: {} as Record<number, number>,
    produtos: {} as Record<number, number>,
    armas: {} as Record<number, number>,
  })

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

    const updatedFormData = {
      ...formData,
      ferramentas_selecionadas: convertCountersToItems(quickCounters.ferramentas, ferramentas),
      entorpecentes_selecionados: convertCountersToItems(quickCounters.entorpecentes, entorpecentes),
      municoes_selecionadas: convertCountersToItems(quickCounters.municoes, municoes),
      produtos_selecionados: convertCountersToItems(quickCounters.produtos, produtos),
      armas_selecionadas: convertCountersToItems(quickCounters.armas, armas),
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
            onClick={() => updateCounter(category, item.id, -1)}
            disabled={count === 0}
            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm font-bold dark-highlight">{count}</span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => updateCounter(category, item.id, 1)}
            className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Indicador de status */}
      {!isOnline && (
        <Card className="bg-yellow-500/10 border border-yellow-500/30">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-yellow-400" />
              <p className="text-sm text-yellow-300">Modo Offline - Dados básicos</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="police-card-dark">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl dark-highlight font-bold flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {showResults ? "Editar Ocorrência" : "Nova Ocorrência"}
            {showResults && <Badge className="gradient-primary dark-cta-text text-xs">Editável</Badge>}
            {isOnline && <Wifi className="h-4 w-4 text-green-400" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de início - Grid de 6 colunas para acomodar todos os tipos */}
            <div className="space-y-2">
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

            {/* Dados básicos - Grid compacto */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-semibold dark-text">Crime</Label>
                <Input
                  value={formData.tipo_crime}
                  onChange={(e) => updateFormDataWithRegeneration("tipo_crime", e.target.value)}
                  placeholder="Ex: Tráfico"
                  className="input-dark h-9"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-semibold dark-text">Local Início</Label>
                <Input
                  value={formData.local_inicio}
                  onChange={(e) => updateFormDataWithRegeneration("local_inicio", e.target.value)}
                  placeholder="Ex: Rua A, 123"
                  className="input-dark h-9"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-semibold dark-text">Local Prisão</Label>
                <Input
                  value={formData.local_prisao}
                  onChange={(e) => updateFormDataWithRegeneration("local_prisao", e.target.value)}
                  placeholder="Ex: Av. B, 456"
                  className="input-dark h-9"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-semibold dark-text">Veículo</Label>
                <Input
                  value={formData.veiculo}
                  onChange={(e) => updateFormDataWithRegeneration("veiculo", e.target.value)}
                  placeholder="Ex: Civic ABC-1234"
                  className="input-dark h-9"
                />
              </div>
            </div>

            {/* Desobediência - Inline */}
            <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded">
              <Checkbox
                checked={formData.desobediencia}
                onCheckedChange={(checked) => updateFormDataWithRegeneration("desobediencia", checked)}
                className="border-red-400"
              />
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <div className="flex-1">
                <span className="text-sm font-semibold text-red-300">Desobediência (+30 meses)</span>
              </div>
              {formData.desobediencia && <Badge className="bg-red-500 text-white text-xs">+30</Badge>}
            </div>

            {/* Itens Apreendidos - Contadores Rápidos com Scroll */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold dark-highlight">Itens Apreendidos (clique +/-)</h3>
              <p className="text-xs dark-text-soft">💡 Role dentro dos cards para ver mais opções</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ferramentas */}
                <Card className="police-card-compact">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm dark-text flex items-center gap-2">
                      🔧 Ferramentas
                      <span className="text-xs dark-text-soft">(10 + itens×10)</span>
                      <Badge className="bg-blue-500/20 text-blue-400 text-xs">{ferramentas.length} opções</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
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
                <Card className="police-card-compact">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm dark-text flex items-center gap-2">
                      💊 Entorpecentes
                      <span className="text-xs dark-text-soft">(15 + itens÷2)</span>
                      <Badge className="bg-purple-500/20 text-purple-400 text-xs">{entorpecentes.length} opções</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
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
                <Card className="police-card-compact">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm dark-text flex items-center gap-2">
                      🔫 Munições
                      <span className="text-xs dark-text-soft">(15 + grupos/20×5)</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">{municoes.length} opções</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
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
                <Card className="police-card-compact">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm dark-text flex items-center gap-2">
                      🎯 Armas
                      <span className="text-xs dark-text-soft">(20 + armas×15)</span>
                      <Badge className="bg-red-500/20 text-red-400 text-xs">{armas.length} opções</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
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
                <Card className="police-card-compact">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm dark-text flex items-center gap-2">
                      📱 Produtos
                      <span className="text-xs dark-text-soft">(10 + itens×2)</span>
                      <Badge className="bg-green-500/20 text-green-400 text-xs">{produtos.length} opções</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 px-3 pb-3">
                      <div className="space-y-1">
                        {produtos.map((item) => (
                          <QuickCounter key={item.id} category="produtos" item={item} />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card placeholder para layout balanceado quando necessário */}
                <div className="md:block hidden"></div>
              </div>
            </div>

            {/* Valores monetários - Inline */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-semibold dark-text">Dinheiro Ilícito (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.dinheiro_ilicito}
                  onChange={(e) =>
                    updateFormDataWithRegeneration("dinheiro_ilicito", Number.parseFloat(e.target.value) || 0)
                  }
                  placeholder="0,00"
                  className="input-dark h-9"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold dark-text">Multas Pendentes (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.multas_pendentes}
                  onChange={(e) =>
                    updateFormDataWithRegeneration("multas_pendentes", Number.parseFloat(e.target.value) || 0)
                  }
                  placeholder="0,00"
                  className="input-dark h-9"
                />
              </div>
            </div>

            {/* Observações - Compacto */}
            <div>
              <Label className="text-sm font-semibold dark-text">Observações</Label>
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
              className="w-full btn-primary-dark py-3 text-base font-bold transition-all duration-300 transform hover:scale-105"
            >
              {showResults ? "🔄 Atualizar" : "⚡ Gerar Relatório"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
