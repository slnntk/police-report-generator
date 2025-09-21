"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useOccurrenceStore } from "@/lib/store"
import { Copy, FileText, Edit3, Download, Share, CheckCircle } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import PdfExport from "@/components/PdfExport"
import { usePoliceToast } from "@/components/ui/enhanced-toast"

interface ReportViewProps {
  onEditForm: () => void
  onCopyFeedback: () => void
}

export function ReportView({ onEditForm, onCopyFeedback }: ReportViewProps) {
  const { generatedReport } = useOccurrenceStore()
  const [copied, setCopied] = useState(false)
  const { success, error } = usePoliceToast()

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopyFeedback()
      success('Relatório copiado', 'Texto copiado para a área de transferência')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Erro ao copiar:", err)
      error('Erro ao copiar', 'Não foi possível copiar o texto')
    }
  }

  const shareReport = async () => {
    if (!generatedReport) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Relatório de Ocorrência Policial',
          text: generatedReport,
        })
        success('Compartilhado', 'Relatório compartilhado com sucesso')
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          error('Erro ao compartilhar', 'Não foi possível compartilhar o relatório')
        }
      }
    } else {
      // Fallback to copy
      copyToClipboard(generatedReport)
    }
  }

  if (!generatedReport) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
        <Card className="police-card-dark">
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto dark-text-soft mb-4" />
            <h3 className="text-lg font-semibold dark-text mb-2">Nenhum relatório gerado</h3>
            <p className="dark-text-soft">Preencha o formulário de ocorrência para gerar um relatório.</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <Card className="police-card-dark shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 gradient-primary rounded-full flex items-center justify-center shadow-lg">
                <FileText className="h-7 w-7 dark-cta-text" />
              </div>
              <div>
                <h2 className="text-2xl font-bold dark-highlight">Relatório Gerado</h2>
                <p className="dark-text-soft">Documento oficial da ocorrência policial</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onEditForm} className="btn-secondary-dark">
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relatório */}
      <Card className="police-card-dark shadow-lg">
        <CardHeader className="dark-secondary-bg border-b dark-border">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 dark-highlight text-xl">
              <FileText className="h-6 w-6" />
              Relatório de Ocorrência Policial
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => copyToClipboard(generatedReport)}
                className={`${
                  copied
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                } font-semibold shadow-md transition-all duration-300 hover-lift`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    ✓ Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
              
              <PdfExport />
              
              <Button 
                onClick={shareReport}
                className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 hover-lift"
              >
                <Share className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="dark-box-bg border dark-border rounded-lg p-6 shadow-inner">
            <div className="space-y-4">
              {generatedReport.split('\n\n').map((paragraph, index) => {
                if (!paragraph.trim()) return null
                
                // Check if it's a header (contains emojis or bold markers)
                const isHeader = paragraph.includes('📍') || paragraph.includes('⚖️') || paragraph.includes('📦') || paragraph.startsWith('**')
                
                if (isHeader) {
                  return (
                    <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-500/10 rounded-r">
                      <h3 className="font-bold text-yellow-400 text-sm">
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    </div>
                  )
                }
                
                return (
                  <p key={index} className="text-sm leading-relaxed dark-text text-justify">
                    {paragraph}
                  </p>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
