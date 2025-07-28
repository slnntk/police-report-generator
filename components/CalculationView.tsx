"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, AlertTriangle, Info } from "lucide-react"

export function CalculationView() {
  const penaltyRules = [
    {
      categoria: "Desobediência",
      regra: "+30 meses fixos",
      exemplo: "Desobediência = +30 meses",
      icon: "🚫",
      color: "bg-red-500/20 border-red-500/30 text-red-400",
    },
    {
      categoria: "Ferramentas Ilícitas",
      regra: "10 + (ferramentas × 10)",
      exemplo: "2 ferramentas = 10 + (2×10) = 30 meses",
      icon: "🔧",
      color: "bg-orange-500/20 border-orange-500/30 text-orange-400",
    },
    {
      categoria: "Entorpecentes",
      regra: "15 + (entorpecentes ÷ 2)",
      exemplo: "4 entorpecentes = 15 + (4÷2) = 17 meses",
      icon: "💊",
      color: "bg-purple-500/20 border-purple-500/30 text-purple-400",
    },
    {
      categoria: "Munição Ilegal",
      regra: "15 + Math.floor(munições ÷ 20) × 5",
      exemplo: "35 munições = 15 + (1×5) = 20 meses",
      icon: "🔫",
      color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
    },
    {
      categoria: "Produtos Roubados",
      regra: "10 + (produtos × 2)",
      exemplo: "3 produtos = 10 + (3×2) = 16 meses",
      icon: "📱",
      color: "bg-green-500/20 border-green-500/30 text-green-400",
    },
    {
      categoria: "Dinheiro Ilícito",
      regra: "10 + Math.floor(valor ÷ 1000)",
      exemplo: "R$3.500 = 10 + 3 = 13 meses",
      icon: "💰",
      color: "bg-blue-500/20 border-blue-500/30 text-blue-400",
    },
    {
      categoria: "Multas Pendentes",
      regra: "10 + Math.floor(valor ÷ 1000)",
      exemplo: "R$2.500 = 10 + 2 = 12 meses",
      icon: "📋",
      color: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="police-card-dark shadow-lg">
        <CardHeader className="dark-secondary-bg border-b dark-border">
          <CardTitle className="flex items-center gap-2 dark-highlight text-2xl">
            <Calculator className="h-7 w-7" />
            Regras de Cálculo de Penas
          </CardTitle>
          <p className="dark-text-soft text-sm mt-2">
            Sistema automatizado de cálculo baseado nas infrações identificadas
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            {penaltyRules.map((rule, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${rule.color}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{rule.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{rule.categoria}</h3>
                    <div className="space-y-2">
                      <p className="font-medium">
                        <strong>Regra:</strong> {rule.regra}
                      </p>
                      <p className="text-sm opacity-80">
                        <strong>Exemplo:</strong> {rule.exemplo}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-yellow-400 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-400 mb-3 text-lg">Observações Importantes:</h3>
                <ul className="text-sm text-yellow-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>As penas são cumulativas (somam-se todas as infrações)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Para entorpecentes, cada unidade conta como +0.5 meses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Para munições, a cada 20 unidades adiciona-se +5 meses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Para produtos roubados, o primeiro item já inclui os 10 meses base</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Valores monetários são arredondados para baixo (R$1.999 = R$1.000)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 gradient-primary rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 dark-cta-text" />
              <div>
                <h4 className="font-bold dark-cta-text">Sistema Automatizado</h4>
                <p className="text-sm dark-cta-text opacity-80">
                  Todos os cálculos são realizados automaticamente com base nos dados inseridos no formulário.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
