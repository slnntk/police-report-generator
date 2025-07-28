"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOccurrenceStore } from "@/lib/store"
import { Copy, FileText, Calculator, Edit3, CheckCircle2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ResultTabsProps {
  onEditForm: () => void
}

export function ResultTabs({ onEditForm }: ResultTabsProps) {
  const { generatedReport, penaltyCalculation, formData } = useOccurrenceStore()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("report")

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Erro ao copiar:", err)
    }
  }

  const getTotalItems = () => {
    return (
      formData.ferramentas_selecionadas.length +
      formData.entorpecentes_selecionados.length +
      formData.municoes_selecionadas.length +
      formData.produtos_selecionados.length +
      (formData.dinheiro_ilicito > 0 ? 1 : 0) +
      (formData.multas_pendentes > 0 ? 1 : 0) +
      (formData.desobediencia ? 1 : 0)
    )
  }

  const getSeverityColor = () => {
    const total = penaltyCalculation.total
    if (total >= 100) return "bg-red-500"
    if (total >= 50) return "bg-orange-500"
    if (total >= 25) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case "Desobediência":
        return "bg-red-500/20 border-red-500/30 text-red-400"
      case "Ferramentas Ilícitas":
        return "bg-orange-500/20 border-orange-500/30 text-orange-400"
      case "Entorpecentes":
        return "bg-purple-500/20 border-purple-500/30 text-purple-400"
      case "Munição Ilegal":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
      case "Produtos Roubados":
        return "bg-green-500/20 border-green-500/30 text-green-400"
      case "Dinheiro Ilícito":
        return "bg-blue-500/20 border-blue-500/30 text-blue-400"
      case "Multas Pendentes":
        return "bg-cyan-500/20 border-cyan-500/30 text-cyan-400"
      default:
        return "bg-gray-500/20 border-gray-500/30 text-gray-400"
    }
  }

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case "Desobediência":
        return "🚫"
      case "Ferramentas Ilícitas":
        return "🔧"
      case "Entorpecentes":
        return "💊"
      case "Munição Ilegal":
        return "🔫"
      case "Produtos Roubados":
        return "📱"
      case "Dinheiro Ilícito":
        return "💰"
      case "Multas Pendentes":
        return "📋"
      default:
        return "⚖️"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header com resumo */}
      <Card className="police-card-dark shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 gradient-primary rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 className="h-7 w-7 dark-cta-text" />
              </div>
              <div>
                <h2 className="text-2xl font-bold dark-highlight">Relatório Gerado com Sucesso</h2>
                <div className="flex items-center gap-4 mt-1">
                  <p className="dark-text-soft">{getTotalItems()} infração(ões) identificada(s)</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor()}`}></div>
                    <span className="font-semibold dark-highlight">Pena total: {penaltyCalculation.total} meses</span>
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={onEditForm} className="btn-secondary-dark font-semibold">
              <Edit3 className="h-4 w-4 mr-2" />
              Editar Formulário
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Abas de resultados */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 h-14 items-center dark-secondary-bg border dark-border shadow-md">
          <TabsTrigger
              value="report"
              className="flex items-center gap-2 text-base font-semibold data-[state=active]:gradient-primary data-[state=active]:dark-cta-text data-[state=active]:shadow-md dark-text"
          >
            <FileText className="h-5 w-5" />
            Relatório Gerado
            <Badge className="self-center bg-green-500/20 text-green-400 border border-green-500/30 font-semibold">
              Pronto
            </Badge>
          </TabsTrigger>
          <TabsTrigger
              value="calculation"
              className="flex items-center gap-2 text-base font-semibold data-[state=active]:gradient-primary data-[state=active]:dark-cta-text data-[state=active]:shadow-md dark-text"
          >
            <Calculator className="h-5 w-5" />
            Detalhamento da Pena
            <Badge className="self-center bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
              {penaltyCalculation.detalhes.length} item(s)
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="report" className="space-y-4">
          <Card className="police-card-dark shadow-lg">
            <CardHeader className="dark-secondary-bg border-b dark-border">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 dark-highlight text-xl">
                  <FileText className="h-6 w-6" />
                  Relatório de Ocorrência Policial
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(generatedReport)}
                    className={`${
                      copied
                        ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                        : "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                    } font-semibold shadow-md transition-all duration-300`}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? "✓ Copiado!" : "Copiar Relatório"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="dark-box-bg border dark-border rounded-lg p-6 shadow-inner">
                <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed dark-text">{generatedReport}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculation" className="space-y-4">
          <Card className="police-card-dark shadow-lg">
            <CardHeader className="dark-secondary-bg border-b dark-border">
              <CardTitle className="flex items-center gap-2 dark-highlight text-xl">
                <Calculator className="h-6 w-6" />
                Cálculo Detalhado da Pena
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {penaltyCalculation.detalhes.map((detalhe, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getCategoryColor(detalhe.categoria)}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(detalhe.categoria)}</span>
                        <div>
                          <span className="font-bold text-lg">{detalhe.categoria}</span>
                          {detalhe.categoria === "Desobediência" && <AlertCircle className="inline h-4 w-4 ml-2" />}
                        </div>
                      </div>
                      <p className="text-sm mt-1 ml-11 font-medium opacity-80">{detalhe.descricao}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold">+{detalhe.meses}</span>
                      <p className="text-xs opacity-60 font-medium">meses</p>
                    </div>
                  </div>
                ))}

                <div className="border-t-2 dark-border pt-6 mt-8">
                  <div className="gradient-primary rounded-lg p-6 shadow-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold dark-cta-text">PENA TOTAL</h3>
                        <p className="dark-cta-text opacity-70 text-sm mt-1">
                          Equivalente a {Math.floor(penaltyCalculation.total / 12)} anos e{" "}
                          {penaltyCalculation.total % 12} meses
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-5xl font-bold dark-cta-text">{penaltyCalculation.total}</span>
                        <p className="dark-cta-text opacity-70 text-lg">meses</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
