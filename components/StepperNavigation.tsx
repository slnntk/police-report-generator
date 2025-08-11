"use client"

import type React from "react"

import { Check, FileText, Calculator, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Step {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: "completed" | "current" | "upcoming"
}

interface StepperNavigationProps {
  currentStep: string
  onStepChange: (step: string) => void
  hasReport: boolean
}

export function StepperNavigation({ currentStep, onStepChange, hasReport }: StepperNavigationProps) {
  const getSteps = (): Step[] => [
    {
      id: "form",
      title: "Dados da Ocorrência",
      description: "Preencher informações",
      icon: Edit3,
      status: currentStep === "form" ? "current" : hasReport ? "completed" : "upcoming",
    },
    {
      id: "report",
      title: "Relatório Gerado",
      description: "Visualizar documento",
      icon: FileText,
      status: !hasReport ? "upcoming" : currentStep === "report" ? "current" : "completed",
    },
    {
      id: "calculation",
      title: "Detalhamento da Pena",
      description: "Análise interativa",
      icon: Calculator,
      status: !hasReport ? "upcoming" : currentStep === "calculation" ? "current" : "completed",
    },
  ]

  const steps = getSteps()

  return (
    <div className="w-full mb-4 lg:mb-8">
      {/* Header com emblema - Hidden on mobile since it's already in mobile header */}
      <div className="hidden lg:flex items-center justify-center mb-6 p-4 dark-box-bg rounded-lg border dark-border">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image
              src="/images/emblema-policia.png"
              alt="Emblema 1º BPM-AP"
              width={40}
              height={40}
              className="rounded-lg shadow-md"
              priority
            />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold dark-highlight">1º BPM-AP</h2>
            <p className="text-sm dark-text-soft">Cidade Alta - Sistema de Relatórios</p>
          </div>
        </div>
      </div>

      {/* Desktop stepper */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Linha de conexão */}
        <div className="absolute top-6 left-0 right-0 h-0.5 dark-border bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

        {steps.map((step, index) => {
          const Icon = step.icon
          const isClickable = step.status !== "upcoming"

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <Button
                onClick={() => isClickable && onStepChange(step.id)}
                disabled={!isClickable}
                className={`
                  w-12 h-12 rounded-full p-0 mb-3 transition-all duration-300 transform hover:scale-110
                  ${
                    step.status === "completed"
                      ? "gradient-primary dark-cta-text shadow-lg"
                      : step.status === "current"
                        ? "bg-blue-500 text-white shadow-lg ring-4 ring-blue-500/30"
                        : "dark-secondary-bg dark-text-soft border dark-border"
                  }
                  ${isClickable ? "cursor-pointer hover:shadow-xl" : "cursor-not-allowed"}
                `}
              >
                {step.status === "completed" ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </Button>

              <div className="text-center max-w-32">
                <h3
                  className={`text-sm font-semibold mb-1 ${
                    step.status === "current"
                      ? "dark-highlight"
                      : step.status === "completed"
                        ? "dark-text"
                        : "dark-text-soft"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-xs dark-text-soft">{step.description}</p>
              </div>

              {step.status === "current" && (
                <div className="absolute -bottom-2 w-2 h-2 gradient-primary rounded-full animate-pulse"></div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile stepper - horizontal scrollable */}
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isClickable = step.status !== "upcoming"

            return (
              <div key={step.id} className="flex items-center gap-3 min-w-fit">
                <Button
                  onClick={() => isClickable && onStepChange(step.id)}
                  disabled={!isClickable}
                  className={`
                    w-10 h-10 rounded-full p-0 transition-all duration-300 flex-shrink-0
                    ${
                      step.status === "completed"
                        ? "gradient-primary dark-cta-text shadow-lg"
                        : step.status === "current"
                          ? "bg-blue-500 text-white shadow-lg ring-2 ring-blue-500/30"
                          : "dark-secondary-bg dark-text-soft border dark-border"
                    }
                    ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}
                  `}
                >
                  {step.status === "completed" ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </Button>

                <div className="min-w-0">
                  <h3
                    className={`text-sm font-semibold ${
                      step.status === "current"
                        ? "dark-highlight"
                        : step.status === "completed"
                          ? "dark-text"
                          : "dark-text-soft"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs dark-text-soft">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 dark-border bg-gradient-to-r from-gray-600 to-transparent flex-shrink-0"></div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}