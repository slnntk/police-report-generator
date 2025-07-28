"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOccurrenceStore } from "@/lib/store"
import { InteractivePenaltyCard } from "./InteractivePenaltyCard"
import { Calculator, Edit3, TrendingUp, Award } from "lucide-react"
import { motion } from "framer-motion"

interface InteractivePenaltyViewProps {
  onEditForm: () => void
}

export function InteractivePenaltyView({ onEditForm }: InteractivePenaltyViewProps) {
  const { penaltyCalculation, formData } = useOccurrenceStore()

  const getSeverityLevel = () => {
    const total = penaltyCalculation.total
    if (total >= 100) return { level: "Muito Alta", color: "from-red-500 to-red-600", icon: "🔴" }
    if (total >= 50) return { level: "Alta", color: "from-orange-500 to-orange-600", icon: "🟠" }
    if (total >= 25) return { level: "Média", color: "from-yellow-500 to-yellow-600", icon: "🟡" }
    return { level: "Baixa", color: "from-green-500 to-green-600", icon: "🟢" }
  }

  const severity = getSeverityLevel()

  // Enriquecer detalhes com itens específicos
  const enrichedDetails = penaltyCalculation.detalhes.map((detail) => {
    let items: any[] = []

    switch (detail.categoria) {
      case "Ferramentas Ilícitas":
        items = formData.ferramentas_selecionadas.map((item) => ({
          nome: item.nome || "Ferramenta não identificada",
          quantidade: item.quantidade,
          unidade: "un",
        }))
        break
      case "Entorpecentes":
        items = formData.entorpecentes_selecionados.map((item) => ({
          nome: item.nome || "Entorpecente não identificado",
          quantidade: item.quantidade,
          unidade: item.unidade || "un",
        }))
        break
      case "Munição Ilegal":
        items = formData.municoes_selecionadas.map((item) => ({
          nome: item.nome || "Munição não identificada",
          quantidade: item.quantidade,
          unidade: "un",
        }))
        break
      case "Produtos Roubados":
        items = formData.produtos_selecionados.map((item) => ({
          nome: item.nome || "Produto não identificado",
          quantidade: item.quantidade,
          unidade: "un",
        }))
        break
      case "Dinheiro Ilícito":
        if (formData.dinheiro_ilicito > 0) {
          items = [
            {
              nome: "Dinheiro em espécie",
              quantidade: 1,
              unidade: "lote",
              valorUnitario: formData.dinheiro_ilicito,
            },
          ]
        }
        break
      case "Multas Pendentes":
        if (formData.multas_pendentes > 0) {
          items = [
            {
              nome: "Multas em aberto",
              quantidade: 1,
              unidade: "lote",
              valorUnitario: formData.multas_pendentes,
            },
          ]
        }
        break
    }

    return { ...detail, items }
  })

  return (
    <div className="space-y-6">
      {/* Header com resumo */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="police-card-dark shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 gradient-primary rounded-full flex items-center justify-center shadow-lg">
                  <Calculator className="h-7 w-7 dark-cta-text" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold dark-highlight">Análise Detalhada da Pena</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="dark-text-soft">{penaltyCalculation.detalhes.length} categoria(s) de infração</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{severity.icon}</span>
                      <span className="font-semibold dark-text">Severidade: {severity.level}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={onEditForm} className="btn-secondary-dark font-semibold">
                <Edit3 className="h-4 w-4 mr-2" />
                Editar Dados
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Cards interativos de detalhamento */}
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 dark-highlight" />
            <h3 className="text-lg font-bold dark-text">Clique nos cards para ver detalhes:</h3>
          </div>
        </motion.div>

        {enrichedDetails.map((detail, index) => (
          <InteractivePenaltyCard key={index} detail={detail} index={index} />
        ))}
      </div>

      {/* Total da pena com animação */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
        <Card className="police-card-dark shadow-xl border-2 border-yellow-500/30">
          <CardContent className="p-6">
            <div className={`bg-gradient-to-r ${severity.color} rounded-lg p-6 text-white shadow-lg`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8" />
                  <div>
                    <h3 className="text-2xl font-bold">PENA TOTAL</h3>
                    <p className="opacity-80 text-sm mt-1">
                      Equivalente a {Math.floor(penaltyCalculation.total / 12)} anos e {penaltyCalculation.total % 12}{" "}
                      meses
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold">{penaltyCalculation.total}</div>
                  <p className="opacity-80 text-lg">meses</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <span>Nível de Severidade:</span>
                  <Badge className="bg-white/20 text-white border-white/30 font-semibold">{severity.level}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
