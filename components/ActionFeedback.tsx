"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy, FileText, Calculator } from "lucide-react"

interface ActionFeedbackProps {
  action: "generated" | "copied" | "calculated" | null
  onComplete: () => void
}

export function ActionFeedback({ action, onComplete }: ActionFeedbackProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (action) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 300)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [action, onComplete])

  const getActionConfig = () => {
    switch (action) {
      case "generated":
        return {
          icon: FileText,
          message: "Relatório gerado com sucesso!",
          color: "from-green-500 to-emerald-500",
        }
      case "copied":
        return {
          icon: Copy,
          message: "Relatório copiado!",
          color: "from-blue-500 to-cyan-500",
        }
      case "calculated":
        return {
          icon: Calculator,
          message: "Pena calculada!",
          color: "from-purple-500 to-violet-500",
        }
      default:
        return null
    }
  }

  const config = getActionConfig()
  if (!config) return null

  const Icon = config.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div
            className={`
            bg-gradient-to-r ${config.color} text-white px-6 py-4 rounded-lg shadow-2xl
            flex items-center gap-3 min-w-64
          `}
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold">{config.message}</p>
              <div className="flex items-center gap-1 mt-1">
                <Check className="h-3 w-3" />
                <span className="text-xs opacity-90">Concluído</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
