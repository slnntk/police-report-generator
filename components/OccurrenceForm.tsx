"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CollapsibleItemCard } from "./CollapsibleItemCard"
import { useOccurrenceStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { OccurrenceTypeSelector } from "./OccurrenceTypeSelector"
import { Checkbox } from "@/components/ui/checkbox"
import { IntelligentAutocomplete } from "./IntelligentAutocomplete"
import { NumericInput } from "./NumericInput"
import { CRIMES_LIST, QTH_LIST } from "@/lib/autocomplete-data"
import { AlertTriangle, Wifi, WifiOff, Wrench, Pill, Zap, Smartphone, Target, Package2 } from "lucide-react"

interface OccurrenceFormProps {
  onFormSubmit: () => void
  showResults: boolean
  onCalculationUpdate?: () => void
}

// Dados de fallback para quando os arquivos JSON não estão disponíveis
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
    {
      id: "abordagem",
      nome: "Abordagem Policial",
      descricao: "Ocorrência iniciada através de abordagem policial",
    },
    {
      id: "fuga",
      nome: "Tentativa de Fuga",
      descricao: "Ocorrência iniciada com tentativa de fuga do suspeito",
    },
    {
      id: "disparo",
      nome: "Disparo de Arma de Fogo",
      descricao: "Ocorrência iniciada com disparo de arma de fogo",
    },
    {
      id: "denuncia",
      nome: "Denúncia Anônima",
      descricao: "Ocorrência iniciada através de denúncia",
    },
    {
      id: "flagrante",
      nome: "Flagrante Delito",
      descricao: "Ocorrência iniciada em flagrante delito",
    },
  ],
}

export function OccurrenceForm({ onFormSubmit, showResults, onCalculationUpdate }: OccurrenceFormProps) {
  const { formData, setFormData, generateReport, calculatePenalty } = useOccurrenceStore()

  const [ferramentas, setFerramentas] = useState(fallbackData.ferramentas)
  const [entorpecentes, setEntorpecentes] = useState(fallbackData.entorpecentes)
  const [municoes, setMunicoes] = useState(fallbackData.municoes)
  const [produtos, setProdutos] = useState(fallbackData.produtos)
  const [armas, setArmas] = useState(fallbackData.armas)
  const [tiposInicio, setTiposInicio] = useState(fallbackData.tipos_inicio)
  const [isOnline, setIsOnline] = useState(true)

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

        // Ferramentas
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

        // Entorpecentes
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

        // Munições
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

        // Produtos
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

        // Armas
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

        // Templates
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
          console.warn("Alguns arquivos de dados não puderam ser carregados. Usando dados de fallback.")
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setIsOnline(false)
        // Usar dados de fallback já definidos no useState
      }
    }

    loadData()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    generateReport()
    calculatePenalty()
    onFormSubmit()
  }

  // Função para atualizar dados do formulário sem regenerar automaticamente
  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  // Função específica para atualizar dados que devem regenerar o relatório
  const updateFormDataWithRegeneration = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })

    // Se já tiver resultados, recalcular automaticamente apenas para mudanças importantes
    if (showResults) {
      setTimeout(() => {
        generateReport()
        calculatePenalty()
        onCalculationUpdate?.()
      }, 100)
    }
  }

  // Função específica para itens que devem regenerar o relatório
  const updateItemsWithRegeneration = (field: string, items: any[]) => {
    setFormData({ ...formData, [field]: items })

    // Se já tiver resultados, recalcular automaticamente
    if (showResults) {
      setTimeout(() => {
        generateReport()
        calculatePenalty()
        onCalculationUpdate?.()
      }, 100)
    }
  }

  // Calcular total de itens selecionados
  const getTotalSelectedItems = () => {
    return (
      formData.ferramentas_selecionadas.length +
      formData.entorpecentes_selecionados.length +
      formData.municoes_selecionadas.length +
      formData.armas_selecionadas.length +
      formData.produtos_selecionados.length
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3 p-3 min-h-[90vh] flex flex-col">
      {/* Indicador de status */}
      {!isOnline && (
        <Card className="bg-yellow-500/10 border-2 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <WifiOff className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm font-bold text-yellow-300">Modo Offline</p>
                <p className="text-xs text-yellow-400">
                  Usando dados básicos. Algumas funcionalidades podem estar limitadas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="police-card-dark">
        <CardHeader className="dark-secondary-bg border-b dark-border">
          <CardTitle className="text-2xl dark-highlight font-bold flex items-center gap-2">
            {showResults ? "Editar Ocorrência Policial" : "Nova Ocorrência Policial"}
            {showResults && <Badge className="gradient-primary dark-cta-text font-semibold">Editável</Badge>}
            {isOnline && <Wifi className="h-5 w-5 text-green-400" />}
          </CardTitle>
          {showResults && (
            <p className="text-sm dark-text-soft">
              Faça alterações nos campos abaixo. Os resultados serão atualizados automaticamente.
            </p>
          )}
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <form onSubmit={handleSubmit} className="space-y-3 flex-1">
            {/* Tipo de início da ocorrência */}
            <OccurrenceTypeSelector
              selectedType={formData.tipo_inicio}
              onTypeChange={(type) => updateFormDataWithRegeneration("tipo_inicio", type)}
              types={tiposInicio}
            />

            {/* Dados básicos da ocorrência */}
            <Card className="police-card-dark">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg dark-highlight">Dados da Ocorrência</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="tipo_crime" className="dark-text font-semibold">
                      Tipo de Crime *
                    </Label>
                    <IntelligentAutocomplete
                      value={formData.tipo_crime}
                      onChange={(value) => updateFormDataWithRegeneration("tipo_crime", value)}
                      options={CRIMES_LIST}
                      placeholder="Digite para buscar crimes..."
                      required
                      fieldType="crime"
                      label=""
                      className="input-dark mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="local_inicio" className="dark-text font-semibold">
                      Local de Início *
                    </Label>
                    <IntelligentAutocomplete
                      value={formData.local_inicio}
                      onChange={(value) => updateFormDataWithRegeneration("local_inicio", value)}
                      options={QTH_LIST}
                      placeholder="Digite para buscar locais..."
                      required
                      fieldType="location"
                      label=""
                      className="input-dark mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="local_prisao" className="dark-text font-semibold">
                      Local de Prisão *
                    </Label>
                    <IntelligentAutocomplete
                      value={formData.local_prisao}
                      onChange={(value) => updateFormDataWithRegeneration("local_prisao", value)}
                      options={QTH_LIST}
                      placeholder="Digite para buscar locais..."
                      required
                      fieldType="location"
                      label=""
                      className="input-dark mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="veiculo" className="dark-text font-semibold">
                      Veículo Envolvido
                    </Label>
                    <Input
                      id="veiculo"
                      value={formData.veiculo}
                      onChange={(e) => updateFormDataWithRegeneration("veiculo", e.target.value)}
                      placeholder="Ex: Elegy RH5 Preto - A1BC1234"
                      className="input-dark mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checkbox de desobediência */}
            <Card className="bg-red-500/10 border-2 border-red-500/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="desobediencia"
                    checked={formData.desobediencia}
                    onCheckedChange={(checked) => updateFormDataWithRegeneration("desobediencia", checked)}
                    className="border-2 border-red-400"
                  />
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <div className="flex-1">
                    <Label htmlFor="desobediencia" className="text-sm font-bold text-red-300 cursor-pointer">
                      Desobediência à Autoridade Policial
                    </Label>
                    <p className="text-xs text-red-400 mt-1 font-medium">
                      Marque se houve desobediência durante a ocorrência (+30 meses)
                    </p>
                  </div>
                  {formData.desobediencia && (
                    <Badge className="bg-red-500 text-white font-bold shadow-md">+30 meses</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Itens apreendidos com cards colapsáveis */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold dark-highlight flex items-center gap-2">
                  <Package2 className="h-6 w-6" />
                  Itens Apreendidos
                </h3>
                {getTotalSelectedItems() > 0 && (
                  <Badge className="gradient-primary dark-cta-text font-bold text-sm px-3 py-1">
                    {getTotalSelectedItems()} categoria(s) com itens
                  </Badge>
                )}
              </div>

              <p className="text-sm dark-text-soft mb-4">
                Clique nos cards abaixo para expandir e selecionar os itens apreendidos em cada categoria:
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4">
                <CollapsibleItemCard
                  title="Ferramentas Ilícitas"
                  items={ferramentas}
                  selectedItems={formData.ferramentas_selecionadas}
                  onItemsChange={(items) => updateItemsWithRegeneration("ferramentas_selecionadas", items)}
                  penaltyFormula="10 + (itens × 10)"
                  icon={Wrench}
                />

                <CollapsibleItemCard
                  title="Entorpecentes"
                  items={entorpecentes}
                  selectedItems={formData.entorpecentes_selecionados}
                  onItemsChange={(items) => updateItemsWithRegeneration("entorpecentes_selecionados", items)}
                  penaltyFormula="15 + (itens ÷ 2)"
                  showUnit={true}
                  icon={Pill}
                />

                <CollapsibleItemCard
                  title="Munição Ilegal"
                  items={municoes}
                  selectedItems={formData.municoes_selecionadas}
                  onItemsChange={(items) => updateItemsWithRegeneration("municoes_selecionadas", items)}
                  penaltyFormula="15 + (grupos/20 × 5)"
                  icon={Zap}
                />

                <CollapsibleItemCard
                  title="Armas de Fogo"
                  items={armas}
                  selectedItems={formData.armas_selecionadas}
                  onItemsChange={(items) => updateItemsWithRegeneration("armas_selecionadas", items)}
                  penaltyFormula="20 + (armas × 15)"
                  icon={Target}
                />

                <CollapsibleItemCard
                  title="Produtos Roubados"
                  items={produtos}
                  selectedItems={formData.produtos_selecionados}
                  onItemsChange={(items) => updateItemsWithRegeneration("produtos_selecionados", items)}
                  penaltyFormula="10 + (itens × 2)"
                  icon={Smartphone}
                />
              </div>
            </div>

            {/* Valores monetários */}
            <Card className="dark-secondary-bg border dark-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg dark-highlight">Valores Monetários</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="dinheiro_ilicito" className="text-sm font-bold dark-text">
                      Dinheiro Ilícito (R$)
                    </Label>
                    <NumericInput
                      id="dinheiro_ilicito"
                      value={formData.dinheiro_ilicito}
                      onChange={(value) => updateFormDataWithRegeneration("dinheiro_ilicito", value)}
                      placeholder="0,00"
                      className="input-dark"
                      min={0}
                      step={0.01}
                      decimalPlaces={2}
                    />
                    <p className="text-xs dark-highlight font-medium">+10 meses, +1 a cada R$1.000</p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="multas_pendentes" className="text-sm font-bold dark-text">
                      Multas Pendentes (R$)
                    </Label>
                    <NumericInput
                      id="multas_pendentes"
                      value={formData.multas_pendentes}
                      onChange={(value) => updateFormDataWithRegeneration("multas_pendentes", value)}
                      placeholder="0,00"
                      className="input-dark"
                      min={0}
                      step={0.01}
                      decimalPlaces={2}
                    />
                    <p className="text-xs dark-highlight font-medium">+10 meses, +1 a cada R$1.000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="observacoes" className="dark-text font-bold text-lg">
                Observações
              </Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => updateFormDataWithRegeneration("observacoes", e.target.value)}
                placeholder="Informações adicionais sobre a ocorrência..."
                rows={3}
                className="textarea-dark"
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-primary-dark py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              {showResults ? "🔄 Atualizar Relatório e Cálculo" : "📋 Gerar Relatório e Calcular Pena"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
