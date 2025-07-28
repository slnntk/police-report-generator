"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, AlertTriangle, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PenaltyDetail {
  categoria: string
  descricao: string
  meses: number
  items?: Array<{
    nome: string
    quantidade: number
    unidade?: string
    valorUnitario?: number
  }>
}

interface InteractivePenaltyCardProps {
  detail: PenaltyDetail
  index: number
}

export function InteractivePenaltyCard({ detail, index }: InteractivePenaltyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getCategoryConfig = (categoria: string) => {
    const configs = {
      Desobediência: {
        color: "bg-red-500/20 border-red-500/30 text-red-400",
        icon: "🚫",
        bgGradient: "from-red-500/10 to-red-600/5",
      },
      "Ferramentas Ilícitas": {
        color: "bg-orange-500/20 border-orange-500/30 text-orange-400",
        icon: "🔧",
        bgGradient: "from-orange-500/10 to-orange-600/5",
      },
      Entorpecentes: {
        color: "bg-purple-500/20 border-purple-500/30 text-purple-400",
        icon: "💊",
        bgGradient: "from-purple-500/10 to-purple-600/5",
      },
      "Munição Ilegal": {
        color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
        icon: "🔫",
        bgGradient: "from-yellow-500/10 to-yellow-600/5",
      },
      "Produtos Roubados": {
        color: "bg-green-500/20 border-green-500/30 text-green-400",
        icon: "📱",
        bgGradient: "from-green-500/10 to-green-600/5",
      },
      "Dinheiro Ilícito": {
        color: "bg-blue-500/20 border-blue-500/30 text-blue-400",
        icon: "💰",
        bgGradient: "from-blue-500/10 to-blue-600/5",
      },
      "Multas Pendentes": {
        color: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400",
        icon: "📋",
        bgGradient: "from-cyan-500/10 to-cyan-600/5",
      },
    }
    return configs[categoria as keyof typeof configs] || configs["Desobediência"]
  }

  const config = getCategoryConfig(detail.categoria)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card
        className={`
          border-2 transition-all duration-300 cursor-pointer hover:shadow-lg transform hover:scale-[1.02]
          ${config.color} bg-gradient-to-br ${config.bgGradient}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl">{config.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{detail.categoria}</h3>
                  {detail.categoria === "Desobediência" && <AlertTriangle className="h-4 w-4" />}
                </div>
                <p className="text-sm opacity-80 font-medium">{detail.descricao}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold">+{detail.meses}</div>
                <div className="text-xs opacity-60">meses</div>
              </div>

              {detail.items && detail.items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(!isExpanded)
                  }}
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && detail.items && detail.items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-current/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-4 w-4" />
                  <span className="text-sm font-semibold">Itens Detalhados:</span>
                </div>

                <div className="grid gap-2">
                  {detail.items.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIndex * 0.05 }}
                      className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                        <span className="text-sm font-medium">{item.nome}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-current/30">
                          {item.quantidade} {item.unidade || "un"}
                        </Badge>
                        {item.valorUnitario && (
                          <span className="text-xs opacity-60">R$ {item.valorUnitario.toFixed(2)}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
