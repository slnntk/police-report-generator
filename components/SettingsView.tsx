"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, FileText, Database, Palette, Code } from "lucide-react"

export function SettingsView() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="police-card-dark shadow-lg">
        <CardHeader className="dark-secondary-bg border-b dark-border">
          <CardTitle className="flex items-center gap-2 dark-highlight text-2xl">
            <Settings className="h-7 w-7" />
            Configurações do Sistema
          </CardTitle>
          <p className="dark-text-soft text-sm mt-2">Informações sobre arquivos de dados, templates e personalização</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6">
            <div className="p-6 border-2 border-blue-500/30 bg-blue-500/10 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-6 w-6 text-blue-400" />
                <h3 className="font-bold text-lg text-blue-400">Arquivos de Dados</h3>
              </div>
              <p className="text-blue-300 mb-4">Os dados dos itens são carregados dos seguintes arquivos JSON:</p>
              <ul className="text-sm space-y-2 text-blue-200">
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <code className="bg-blue-500/20 px-2 py-1 rounded">/public/data/ferramentas.json</code> - Lista de
                  ferramentas ilícitas
                </li>
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <code className="bg-blue-500/20 px-2 py-1 rounded">/public/data/entorpecentes.json</code> - Lista de
                  entorpecentes
                </li>
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <code className="bg-blue-500/20 px-2 py-1 rounded">/public/data/municoes.json</code> - Lista de
                  munições
                </li>
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <code className="bg-blue-500/20 px-2 py-1 rounded">/public/data/produtos.json</code> - Lista de
                  produtos roubados
                </li>
              </ul>
            </div>

            <div className="p-6 border-2 border-green-500/30 bg-green-500/10 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-green-400" />
                <h3 className="font-bold text-lg text-green-400">Templates de Relatório</h3>
              </div>
              <p className="text-green-300 mb-4">Os templates de relatório podem ser editados no arquivo:</p>
              <ul className="text-sm space-y-2 text-green-200">
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <code className="bg-green-500/20 px-2 py-1 rounded">/public/data/templates.json</code> - Templates de
                  relatório
                </li>
              </ul>
              <p className="text-xs text-green-300 mt-3 p-3 bg-green-500/20 rounded">
                💡 Use variáveis como <code>{"{tipo_crime}"}</code>, <code>{"{local_inicio}"}</code>, etc. para dados
                dinâmicos.
              </p>
            </div>

            <div className="p-6 border-2 border-purple-500/30 bg-purple-500/10 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="h-6 w-6 text-purple-400" />
                <h3 className="font-bold text-lg text-purple-400">Paleta de Cores Dark Theme</h3>
              </div>
              <p className="text-purple-300 mb-4">Sistema configurado com paleta dark otimizada:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="h-16 dark-bg rounded-lg flex items-center justify-center text-white text-xs font-semibold border dark-border">
                  Background
                  <br />
                  #121212
                </div>
                <div className="h-16 dark-box-bg rounded-lg flex items-center justify-center text-white text-xs font-semibold border dark-border">
                  Cards
                  <br />
                  #1E1E1E
                </div>
                <div className="h-16 gradient-primary rounded-lg flex items-center justify-center dark-cta-text text-xs font-semibold">
                  Highlight
                  <br />
                  #D9C38A
                </div>
                <div className="h-16 dark-secondary-bg rounded-lg flex items-center justify-center text-white text-xs font-semibold border dark-border">
                  Secondary
                  <br />
                  #333333
                </div>
              </div>
            </div>

            <div className="p-6 border-2 border-yellow-500/30 bg-yellow-500/10 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="h-6 w-6 text-yellow-400" />
                <h3 className="font-bold text-lg text-yellow-400">Recursos do Sistema</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2 text-yellow-200">
                  <h4 className="font-semibold text-yellow-300">✅ Implementado:</h4>
                  <ul className="space-y-1">
                    <li>• Formulário dinâmico de ocorrências</li>
                    <li>• Cálculo automático de penas</li>
                    <li>• Templates personalizáveis</li>
                    <li>• Tema dark otimizado</li>
                    <li>• Interface responsiva</li>
                  </ul>
                </div>
                <div className="space-y-2 text-yellow-200">
                  <h4 className="font-semibold text-yellow-300">🔄 Próximas versões:</h4>
                  <ul className="space-y-1">
                    <li>• Exportação PDF</li>
                    <li>• Sistema de usuários</li>
                    <li>• Histórico de relatórios</li>
                    <li>• Modo offline</li>
                    <li>• Atalhos de teclado</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
