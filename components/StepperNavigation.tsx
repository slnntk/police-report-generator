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
    <div className="w-full mb-3">
      {/* Compact desktop stepper */}
      <div className="hidden md:flex items-center justify-between relative px-4 py-3 dark-box-bg rounded-lg border dark-border">
        {/* Connection line */}
        <div className="absolute top-1/2 left-8 right-8 h-0.5 dark-border bg-gradient-to-r from-transparent via-gray-600 to-transparent transform -translate-y-1/2"></div>

        {steps.map((step, index) => {
          const Icon = step.icon
          const isClickable = step.status !== "upcoming"

          return (
            <div key={step.id} className="flex items-center gap-3 relative z-10 bg-gray-900 px-2">
              <Button
                onClick={() => isClickable && onStepChange(step.id)}
                disabled={!isClickable}
                className={`
                  w-8 h-8 rounded-full p-0 transition-all duration-200 flex-shrink-0
                  ${
                    step.status === "completed"
                      ? "gradient-primary dark-cta-text shadow-md"
                      : step.status === "current"
                        ? "bg-blue-500 text-white shadow-md"
                        : "dark-secondary-bg dark-text-soft border dark-border"
                  }
                  ${isClickable ? "cursor-pointer hover:shadow-lg" : "cursor-not-allowed"}
                `}
              >
                {step.status === "completed" ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </Button>
              
              <div className="text-left flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${
                  step.status === "current" ? "dark-highlight" : 
                  step.status === "completed" ? "text-green-400" : "dark-text-soft"
                }`}>
                  {step.title}
                </p>
                <p className="text-xs dark-text-soft truncate">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile stepper - horizontal scrollable */}
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin px-2">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isClickable = step.status !== "upcoming"

            return (
              <div key={step.id} className="flex items-center gap-3 min-w-fit">
                <Button
                  onClick={() => isClickable && onStepChange(step.id)}
                  disabled={!isClickable}
                  className={`
                    w-8 h-8 rounded-full p-0 transition-all duration-200 flex-shrink-0
                    ${
                      step.status === "completed"
                        ? "gradient-primary dark-cta-text shadow-md"
                        : step.status === "current"
                          ? "bg-blue-500 text-white shadow-md"
                          : "dark-secondary-bg dark-text-soft border dark-border"
                    }
                    ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}
                  `}
                >
                  {step.status === "completed" ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </Button>

                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${
                    step.status === "current"
                      ? "dark-highlight"
                      : step.status === "completed"
                        ? "text-green-400"
                        : "dark-text-soft"
                  }`}>
                    {step.title}
                  </p>
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