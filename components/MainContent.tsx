"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { OccurrenceForm } from "./OccurrenceForm"
import { ReportView } from "./ReportView"
import { InteractivePenaltyView } from "./InteractivePenaltyView"
import { StepperNavigation } from "./StepperNavigation"
import { ActionFeedback } from "./ActionFeedback"
import { useOccurrenceStore } from "@/lib/store"

interface MainContentProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function MainContent({ activeTab, setActiveTab }: MainContentProps) {
  const { generatedReport } = useOccurrenceStore()
  const [currentStep, setCurrentStep] = useState("form")
  const [feedbackAction, setFeedbackAction] = useState<"generated" | "copied" | "calculated" | null>(null)

  const handleFormSubmit = () => {
    setFeedbackAction("generated")
    setCurrentStep("report")
  }

  const handleStepChange = (step: string) => {
    setCurrentStep(step)
    setActiveTab(step)
  }

  const handleCopyFeedback = () => {
    setFeedbackAction("copied")
  }

  const handleCalculationFeedback = () => {
    setFeedbackAction("calculated")
  }

  const renderCurrentStep = () => {
    const pageVariants = {
      initial: { opacity: 0, x: 20 },
      in: { opacity: 1, x: 0 },
      out: { opacity: 0, x: -20 },
    }

    const pageTransition = {
      type: "tween",
      ease: "anticipate",
      duration: 0.4,
    }

    switch (currentStep) {
      case "form":
        return (
          <motion.div
            key="form"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <OccurrenceForm
              onFormSubmit={handleFormSubmit}
              showResults={!!generatedReport}
              onCalculationUpdate={handleCalculationFeedback}
            />
          </motion.div>
        )
      case "report":
        return (
          <motion.div
            key="report"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ReportView onEditForm={() => setCurrentStep("form")} onCopyFeedback={handleCopyFeedback} />
          </motion.div>
        )
      case "calculation":
        return (
          <motion.div
            key="calculation"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <InteractivePenaltyView onEditForm={() => setCurrentStep("form")} />
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="ml-64 flex-1 p-6 gradient-background min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Navegação por etapas */}
        <StepperNavigation currentStep={currentStep} onStepChange={handleStepChange} hasReport={!!generatedReport} />

        {/* Conteúdo da etapa atual */}
        <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>

        {/* Feedback de ações */}
        <ActionFeedback action={feedbackAction} onComplete={() => setFeedbackAction(null)} />
      </div>
    </div>
  )
}
