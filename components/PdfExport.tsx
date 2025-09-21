"use client"

import { Button } from "@/components/ui/button"
import { Download, FileText, Printer } from "lucide-react"
import { useOccurrenceStore } from "@/lib/store"
import { usePoliceToast } from "@/components/ui/enhanced-toast"

interface PdfExportProps {
  className?: string
}

export function PdfExport({ className }: PdfExportProps) {
  const { generatedReport, formData } = useOccurrenceStore()
  const { success, error, warning } = usePoliceToast()

  const generatePdf = async () => {
    if (!generatedReport) {
      warning('Sem relatório', 'Generate um relatório primeiro antes de exportar')
      return
    }

    try {
      // Create a printable version of the report
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        error('Bloqueio de pop-up', 'Permita pop-ups para exportar PDF')
        return
      }

      const printContent = generatePrintableHtml(generatedReport, formData)
      
      printWindow.document.write(printContent)
      printWindow.document.close()
      
      // Wait for content to load then trigger print
      printWindow.addEventListener('load', () => {
        printWindow.print()
        success('PDF gerado', 'Use Ctrl+P ou Cmd+P para salvar como PDF')
      })
      
    } catch (err) {
      console.error('Erro ao gerar PDF:', err)
      error('Erro na exportação', 'Não foi possível gerar o PDF')
    }
  }

  const generatePrintableHtml = (report: string, data: any) => {
    const currentDate = new Date().toLocaleDateString('pt-BR')
    const currentTime = new Date().toLocaleTimeString('pt-BR')
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório Policial - ${currentDate}</title>
        <style>
          @page {
            margin: 2cm;
            size: A4;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 20px;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .header h1 {
            font-size: 18pt;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
          }
          
          .header h2 {
            font-size: 14pt;
            margin: 5px 0;
            font-weight: normal;
          }
          
          .document-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            font-size: 10pt;
          }
          
          .content {
            text-align: justify;
            margin-bottom: 40px;
          }
          
          .content p {
            margin: 15px 0;
            text-indent: 2cm;
          }
          
          .signature-section {
            margin-top: 60px;
            page-break-inside: avoid;
          }
          
          .signature-line {
            border-top: 1px solid #000;
            width: 300px;
            margin: 40px auto 10px auto;
            text-align: center;
          }
          
          .signature-text {
            text-align: center;
            font-size: 10pt;
            margin-top: 5px;
          }
          
          .footer {
            position: fixed;
            bottom: 2cm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8pt;
            color: #666;
          }
          
          @media print {
            body {
              background: none;
              -webkit-print-color-adjust: exact;
            }
            
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>1º Batalhão de Polícia Militar</h1>
          <h2>Alta Paradise - Cidade Alta</h2>
          <h2>Relatório de Ocorrência Policial</h2>
        </div>
        
        <div class="document-info">
          <div>
            <strong>Data de Elaboração:</strong> ${currentDate}
          </div>
          <div>
            <strong>Horário:</strong> ${currentTime}
          </div>
        </div>
        
        <div class="content">
          ${formatReportForPrint(report)}
        </div>
        
        <div class="signature-section">
          <div class="signature-line"></div>
          <div class="signature-text">
            Assinatura do Policial Responsável
          </div>
        </div>
        
        <div class="footer">
          Documento gerado automaticamente pelo Sistema de Relatórios v2.0 - ${currentDate} ${currentTime}
        </div>
        
        <script>
          window.addEventListener('load', function() {
            // Auto-focus print dialog
            setTimeout(function() {
              window.print();
            }, 500);
          });
        </script>
      </body>
      </html>
    `
  }

  const formatReportForPrint = (report: string) => {
    // Convert markdown-style formatting to HTML
    return report
      .split('\n\n')
      .filter(paragraph => paragraph.trim())
      .map(paragraph => {
        // Convert bold text
        let formatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        
        // Convert bullet points to proper paragraphs
        if (formatted.startsWith('•') || formatted.startsWith('-')) {
          formatted = formatted.replace(/^[•-]\s*/, '')
          return `<p style="margin-left: 1cm;">• ${formatted}</p>`
        }
        
        // Convert headers
        if (formatted.includes('📍') || formatted.includes('⚖️') || formatted.includes('📦')) {
          return `<p style="font-weight: bold; margin-top: 20px; margin-bottom: 10px; text-indent: 0;">${formatted}</p>`
        }
        
        return `<p>${formatted}</p>`
      })
      .join('')
  }

  const printReport = () => {
    if (!generatedReport) {
      warning('Sem relatório', 'Generate um relatório primeiro antes de imprimir')
      return
    }

    try {
      window.print()
      success('Imprimindo', 'Enviando para impressora...')
    } catch (err) {
      error('Erro na impressão', 'Não foi possível imprimir o relatório')
    }
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        onClick={generatePdf}
        disabled={!generatedReport}
        className="btn-secondary-dark hover-lift"
        size="sm"
      >
        <Download className="h-4 w-4 mr-2" />
        Exportar PDF
      </Button>
      
      <Button
        onClick={printReport}
        disabled={!generatedReport}
        className="btn-secondary-dark hover-lift"
        size="sm"
      >
        <Printer className="h-4 w-4 mr-2" />
        Imprimir
      </Button>
    </div>
  )
}

export default PdfExport