"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Target, Phone, Eye } from "lucide-react"

interface OccurrenceTypeSelectorProps {
  selectedType: string
  onTypeChange: (type: string) => void
  types: any[]
}

const typeIcons = {
  abordagem: CheckCircle2,
  fuga: AlertTriangle,
  disparo: Target,
  denuncia: Phone,
  flagrante: Eye,
}

const typeColors = {
  abordagem: "border-green-500 bg-green-500/10 text-green-400",
  fuga: "border-orange-500 bg-orange-500/10 text-orange-400",
  disparo: "border-red-500 bg-red-500/10 text-red-400",
  denuncia: "border-blue-500 bg-blue-500/10 text-blue-400",
  flagrante: "border-purple-500 bg-purple-500/10 text-purple-400",
}

const typeSelectedColors = {
  abordagem: "border-green-400 bg-green-400/20 text-green-300",
  fuga: "border-orange-400 bg-orange-400/20 text-orange-300",
  disparo: "border-red-400 bg-red-400/20 text-red-300",
  denuncia: "border-blue-400 bg-blue-400/20 text-blue-300",
  flagrante: "border-purple-400 bg-purple-400/20 text-purple-300",
}

export function OccurrenceTypeSelector({ selectedType, onTypeChange, types }: OccurrenceTypeSelectorProps) {
  return (
    <Card className="police-card-dark">
      <CardHeader className="dark-secondary-bg border-b dark-border">
        <CardTitle className="text-lg dark-highlight font-bold">Como a ocorrência foi iniciada?</CardTitle>
        <p className="text-sm dark-text-soft">
          Selecione o tipo de início para personalizar o relatório automaticamente
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {types.map((type) => {
            const Icon = typeIcons[type.id as keyof typeof typeIcons] || CheckCircle2
            const isSelected = selectedType === type.id
            const colorClass = isSelected
              ? typeSelectedColors[type.id as keyof typeof typeSelectedColors] || typeSelectedColors.abordagem
              : typeColors[type.id as keyof typeof typeColors] || typeColors.abordagem

            return (
              <div
                key={type.id}
                onClick={() => onTypeChange(type.id)}
                className={`
                  relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-105
                  ${colorClass}
                  ${isSelected ? "shadow-md ring-2 ring-offset-2 ring-offset-background" : "hover:border-opacity-60"}
                `}
                style={{
                  ringColor: isSelected ? "#D9C38A" : "transparent",
                }}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-6 w-6 mt-0.5 ${isSelected ? "text-current" : "text-current opacity-70"}`} />
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm ${isSelected ? "text-current" : "text-current"}`}>
                      {type.nome}
                    </h3>
                    <p className={`text-xs mt-1 ${isSelected ? "text-current opacity-80" : "text-current opacity-60"}`}>
                      {type.descricao}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="gradient-primary dark-cta-text text-xs px-2 py-1 shadow-lg font-semibold">
                      ✓ Selecionado
                    </Badge>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {selectedType && (
          <div className="mt-4 p-3 dark-secondary-bg rounded-lg border dark-border">
            <p className="text-sm dark-text">
              <strong>Template selecionado:</strong> O relatório será gerado usando o template específico para{" "}
              <span className="dark-highlight font-semibold">{types.find((t) => t.id === selectedType)?.nome}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
