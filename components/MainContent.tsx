"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { QuickOccurrenceForm } from "./QuickOccurrenceForm"
import { ReportView } from "./ReportView"
import { InteractivePenaltyView } from "./InteractivePenaltyView"
import { StepperNavigation } from "./StepperNavigation"
import { ActionFeedback } from "./ActionFeedback"
import { useOccurrenceStore } from "@/lib/store"

interface MainContentProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onOpenSidebar: () => void
}

export function MainContent({ activeTab, setActiveTab, onOpenSidebar }: MainContentProps) {
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
            className="flex-1 flex flex-col min-h-0"
          >
            <QuickOccurrenceForm
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
            className="flex-1 flex flex-col min-h-0"
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
            className="flex-1 flex flex-col min-h-0"
          >
            <InteractivePenaltyView onEditForm={() => setCurrentStep("form")} />
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex-1 flex flex-col gradient-background overflow-hidden">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b dark-border dark-bg">
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenSidebar}
          className="dark-text hover:dark-secondary-hover"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/images/emblema-policia.png"
              alt="Emblema 1º BPM-AP"
              width={32}
              height={32}
              className="rounded shadow-sm"
              priority
            />
          </div>
          <div>
            <h1 className="text-sm font-bold dark-text">1º BPM-AP</h1>
            <p className="text-xs dark-highlight">Cidade Alta</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 lg:p-6">
        <div className="max-w-6xl mx-auto flex-1 flex flex-col h-full w-full">
          {/* Navegação por etapas */}
          <div className="mb-4 lg:mb-6">
            <StepperNavigation 
              currentStep={currentStep} 
              onStepChange={handleStepChange} 
              hasReport={!!generatedReport} 
            />
          </div>

          {/* Conteúdo da etapa atual */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
          </div>

          {/* Feedback de ações */}
          <ActionFeedback action={feedbackAction} onComplete={() => setFeedbackAction(null)} />
        </div>
      </div>
    </div>
  )
}
