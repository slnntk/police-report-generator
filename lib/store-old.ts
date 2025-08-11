"use client"

import { create } from "zustand"
import type { 
  FormData, 
  PenaltyCalculation, 
  OccurrenceStore, 
  OccurrenceStartType, 
  FallbackData 
} from "./types"

const initialFormData: FormData = {
  tipo_crime: "",
  tipo_inicio: "",
  local_inicio: "",
  local_prisao: "",
  veiculo: "",
  desobediencia: false,
  numero_pessoas_envolvidas: 1,
  ferramentas_selecionadas: [],
  entorpecentes_selecionados: [],
  municoes_selecionadas: [],
  produtos_selecionados: [],
  armas_selecionadas: [],
  dinheiro_ilicito: 0,
  multas_pendentes: 0,
  observacoes: "",
}

// Dados de fallback caso os arquivos JSON não sejam encontrados
const fallbackData: FallbackData = {
  templates: {
    tipos_inicio: [
      {
        id: "abordagem",
        nome: "Abordagem Policial",
        descricao: "Ocorrência iniciada através de abordagem policial",
      },
      {
        id: "fuga",
        nome: "Tentativa de Fuga",
        descricao: "Ocorrência iniciada com tentativa de fuga do suspeito",
      },
      {
        id: "disparo",
        nome: "Disparo de Arma de Fogo",
        descricao: "Ocorrência iniciada com disparo de arma de fogo",
      },
      {
        id: "denuncia",
        nome: "Denúncia Anônima",
        descricao: "Ocorrência iniciada através de denúncia",
      },
      {
        id: "flagrante",
        nome: "Flagrante Delito",
        descricao: "Ocorrência iniciada em flagrante delito",
      },
      {
        id: "corrida",
        nome: "Corrida Ilegal",
        descricao: "Ocorrência iniciada durante corrida ilegal de veículos",
      },
    ],
    templates: {
      abordagem: {
        titulo: "Pena",
        template:
          "🛡️ 1º Batalhão de Polícia Militar - Cidade Alta (1ºBPM-AP) 🛡️\n\n📝 Relato: Recebemos uma denúncia (via central), de uma QRU de {tipo_crime} na região do {local_inicio}. Ao se deslocar para o referido local, encontramos {article} {individuo} cometendo {article} referid{article === 'os' ? 'os' : 'o'} delit{article === 'os' ? 'os' : 'o'}. Após aviso sonoro, luminoso e verbal, {article} {suspeito} {empreendeu_empreenderam} fuga. Minutos depois, {article === 'os' ? 'os mesmos ficaram' : 'o mesmo ficou'} inoperante{article === 'os' ? 's' : ''} em seu veículo {veiculo}, na região do {local_prisao}. {tentou_tentaram} tentativa de fuga a pé, porém {foi_foram} capturad{article === 'os' ? 'os' : 'o'} e {conduzido_conduzidos} até o departamento policial para prisão.\n\n📦 Itens apreendidos: {itens_apreendidos}\n\n⚖️ Detalhamento da Pena:\n{calculo_pena}\n\nPena Total: {pena_total} meses",
      },
      corrida: {
        titulo: "Pena",
        template:
          "🛡️ 1º Batalhão de Polícia Militar - Cidade Alta (1ºBPM-AP) 🛡️\n\n📝 Relato: Durante patrulhamento, as equipes identificaram uma corrida ilegal de veículos na região do {local_inicio}, envolvendo {tipo_crime}. Foi realizada operação para interceptar os participantes, resultando na apreensão do veículo {veiculo} e prisão d{article} {envolvido_envolvidos} na região do {local_prisao}. {articleCap} {individuo} {foi_foram} {conduzido_conduzidos} ao departamento policial para as devidas providências.\n\n📦 Itens apreendidos: {itens_apreendidos}\n\n⚖️ Detalhamento da Pena:\n{calculo_pena}\n\nPena Total: {pena_total} meses",
      },
    },
  },
}

// Função auxiliar para fazer fetch com tratamento de erro
const safeFetch = async (url: string) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const text = await response.text()
    if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
      throw new Error("Response is not valid JSON")
    }
    return JSON.parse(text)
  } catch (error) {
    console.warn(`Failed to fetch ${url}:`, error)
    return null
  }
}

// Helper function for pluralization in reports
const pluralize = (word: string, count: number, pluralForm?: string): string => {
  if (count === 1) return word
  
  if (pluralForm) return pluralForm
  
  // Portuguese pluralization rules (simplified)
  const lastChar = word.slice(-1).toLowerCase()
  const lastTwoChars = word.slice(-2).toLowerCase()
  
  if (lastChar === 'm') {
    return word.slice(0, -1) + 'ns'  // homem -> homens
  } else if (lastTwoChars === 'ão') {
    return word.slice(0, -2) + 'ões'  // suspeição -> suspeições (rare case)
  } else if (lastChar === 'l') {
    return word.slice(0, -1) + 'is'   // animal -> animais
  } else if (lastChar === 'r' || lastChar === 's' || lastChar === 'z') {
    return word + 'es'  // suspeitor -> suspeitores
  } else {
    return word + 's'   // suspeito -> suspeitos
  }
}

// Helper to get conjugated verbs based on number of people
const getConjugatedText = (count: number) => {
  const isPlural = count > 1
  return {
    article: isPlural ? 'os' : 'o',
    articleCap: isPlural ? 'Os' : 'O',
    suspeito: pluralize('suspeito', count),
    individuo: pluralize('indivíduo', count),
    foi_foram: isPlural ? 'foram' : 'foi',
    detido_detidos: isPlural ? 'detidos' : 'detido',
    conduzido_conduzidos: isPlural ? 'conduzidos' : 'conduzido',
    tentou_tentaram: isPlural ? 'tentaram' : 'tentou',
    empreendeu_empreenderam: isPlural ? 'empreenderam' : 'empreendeu',
    fugiu_fugiram: isPlural ? 'fugiram' : 'fugiu',
    envolvido_envolvidos: isPlural ? 'envolvidos' : 'envolvido'
  }
}

export const useOccurrenceStore = create<OccurrenceStore>((set, get) => ({
  formData: initialFormData,
  generatedReport: "",
  penaltyCalculation: { detalhes: [], total: 0 },
  tiposInicio: fallbackData.templates.tipos_inicio,
  isLoading: false,
  error: null,

  setFormData: (data: Partial<FormData>) => {
    set((state) => ({ 
      formData: { ...state.formData, ...data },
      error: null // Clear any previous errors
    }))
  },

  setTiposInicio: (tipos: OccurrenceStartType[]) => set({ tiposInicio: tipos }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  resetForm: () => set({ 
    formData: initialFormData, 
    generatedReport: "", 
    penaltyCalculation: { detalhes: [], total: 0 },
    error: null 
  }),

  generateReport: async () => {
    const { formData } = get()
    set({ isLoading: true, error: null })

    try {

    try {
      // Tentar carregar template, usar fallback se falhar
      let templateData = await safeFetch("/data/templates.json")
      if (!templateData) {
        console.warn("Using fallback template data")
        templateData = fallbackData.templates
      }

      // Selecionar template baseado no tipo de início
      const tipoTemplate = formData.tipo_inicio || "abordagem"
      const templateConfig = templateData.templates?.[tipoTemplate] ||
        templateData.templates?.abordagem || {
          template:
            "🛡️ 1º Batalhão de Polícia Militar - Cidade Alta (1ºBPM-AP) 🛡️\n\n📝 Relato: {tipo_crime} em {local_inicio}.\n\n📦 Itens apreendidos: {itens_apreendidos}\n\n⚖️ Detalhamento da Pena:\n{calculo_pena}\n\nPena Total: {pena_total} meses",
        }

      let template = templateConfig.template

      // Get pluralization helpers
      const conjugated = getConjugatedText(formData.numero_pessoas_envolvidas)

      // Substituir variáveis no template
      template = template
        .replace("{tipo_crime}", formData.tipo_crime || "Não informado")
        .replace(/\{local_inicio\}/g, formData.local_inicio || "Não informado")
        .replace(/\{local_prisao\}/g, formData.local_prisao || "Não informado")
        .replace("{veiculo}", formData.veiculo || "Não informado")
        .replace("{data_hora}", new Date().toLocaleString("pt-BR"))
        // Pluralization replacements
        .replace(/\{article\}/g, conjugated.article)
        .replace(/\{articleCap\}/g, conjugated.articleCap)
        .replace(/\{suspeito\}/g, conjugated.suspeito)
        .replace(/\{individuo\}/g, conjugated.individuo)
        .replace(/\{foi_foram\}/g, conjugated.foi_foram)
        .replace(/\{detido_detidos\}/g, conjugated.detido_detidos)
        .replace(/\{conduzido_conduzidos\}/g, conjugated.conduzido_conduzidos)
        .replace(/\{tentou_tentaram\}/g, conjugated.tentou_tentaram)
        .replace(/\{empreendeu_empreenderam\}/g, conjugated.empreendeu_empreenderam)
        .replace(/\{fugiu_fugiram\}/g, conjugated.fugiu_fugiram)
        .replace(/\{envolvido_envolvidos\}/g, conjugated.envolvido_envolvidos)

      // Gerar lista de itens apreendidos no formato compacto
      const itensCompactos = []

      // Ferramentas - formato: Nome(quantidade)
      if (formData.ferramentas_selecionadas.length > 0) {
        formData.ferramentas_selecionadas.forEach((item) => {
          const nomeItem = item.nome || "Item não identificado"
          itensCompactos.push(`${nomeItem}(${item.quantidade})`)
        })
      }

      // Entorpecentes - formato: Nome(quantidade)
      if (formData.entorpecentes_selecionados.length > 0) {
        formData.entorpecentes_selecionados.forEach((item) => {
          const nomeItem = item.nome || "Item não identificado"
          itensCompactos.push(`${nomeItem}(${item.quantidade})`)
        })
      }

      // Munições - formato: Nome(quantidade)
      if (formData.municoes_selecionadas.length > 0) {
        formData.municoes_selecionadas.forEach((item) => {
          const nomeItem = item.nome || "Item não identificado"
          itensCompactos.push(`${nomeItem}(${item.quantidade})`)
        })
      }

      // Armas - formato: Nome(quantidade)
      if (formData.armas_selecionadas.length > 0) {
        formData.armas_selecionadas.forEach((item) => {
          const nomeItem = item.nome || "Item não identificado"
          itensCompactos.push(`${nomeItem}(${item.quantidade})`)
        })
      }

      // Produtos - formato: Nome(quantidade)
      if (formData.produtos_selecionados.length > 0) {
        formData.produtos_selecionados.forEach((item) => {
          const nomeItem = item.nome || "Item não identificado"
          itensCompactos.push(`${nomeItem}(${item.quantidade})`)
        })
      }

      // Dinheiro ilícito - formato: Dinheiro Ilícito(R$ valor)
      if (formData.dinheiro_ilicito > 0) {
        itensCompactos.push(`Dinheiro Ilícito(R$ ${formData.dinheiro_ilicito.toFixed(2)})`)
      }

      // Multas pendentes - formato: Multas Pendentes(R$ valor)
      if (formData.multas_pendentes > 0) {
        itensCompactos.push(`Multas Pendentes(R$ ${formData.multas_pendentes.toFixed(2)})`)
      }

      const itensApreendidos = itensCompactos.length > 0 ? itensCompactos.join(", ") : "Nenhum item apreendido"

      template = template.replace("{itens_apreendidos}", itensApreendidos)

      // Adicionar cálculo da pena
      const { penaltyCalculation } = get()
      let calculoPena = ""
      penaltyCalculation.detalhes.forEach((detalhe) => {
        calculoPena += `• ${detalhe.categoria}: ${detalhe.descricao} = +${detalhe.meses} meses\n`
      })

      template = template
        .replace("{calculo_pena}", calculoPena || "Nenhuma infração calculada")
        .replace("{pena_total}", penaltyCalculation.total.toString())
        .replace("{observacoes}", formData.observacoes || "Nenhuma observação adicional.")
        .replace("{responsavel}", "Sistema Automatizado")
        .replace("{data_relatorio}", new Date().toLocaleDateString("pt-BR"))

      set({ generatedReport: template, isLoading: false })
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      set({
        error: `Erro ao gerar relatório: ${errorMessage}`,
        isLoading: false,
        generatedReport: `🛡️ 1º Batalhão de Polícia Militar - Cidade Alta (1ºBPM-AP) 🛡️

📝 Relato: ${formData.tipo_crime || "Não informado"} em ${formData.local_inicio || "Não informado"}.

📦 Itens apreendidos: Erro ao carregar dados

⚖️ Detalhamento da Pena: Erro no cálculo

Pena Total: 0 meses

[Relatório gerado em modo de emergência devido a erro no sistema]`,
      })
    }
  },

  calculatePenalty: () => {
    const { formData } = get()
    set({ isLoading: true, error: null })
    
    const detalhes = []
    let total = 0

    try {
      // Calcular pena para desobediência (+30 meses)
      if (formData.desobediencia) {
        detalhes.push({
          categoria: "Desobediência",
          descricao: "Desobediência à autoridade policial",
          meses: 30,
        })
        total += 30
      }

      // Calcular pena para ferramentas (10 + ferramentas * 10)
      if (formData.ferramentas_selecionadas.length > 0) {
        let totalFerramentas = 0
        formData.ferramentas_selecionadas.forEach((item) => {
          totalFerramentas += item.quantidade
        })

        const mesesFerramentas = 10 + totalFerramentas * 10
        detalhes.push({
          categoria: "Ferramentas Ilícitas",
          descricao: `10 meses base + ${totalFerramentas} × 10 meses`,
          meses: mesesFerramentas,
        })
        total += mesesFerramentas
      }

      // Calcular pena para entorpecentes (15 + entorpecentes / 2)
      if (formData.entorpecentes_selecionados.length > 0) {
        let totalEntorpecentes = 0
        formData.entorpecentes_selecionados.forEach((item) => {
          totalEntorpecentes += item.quantidade
        })

        const mesesEntorpecentes = 15 + totalEntorpecentes / 2
        detalhes.push({
          categoria: "Entorpecentes",
          descricao: `15 meses base + ${totalEntorpecentes} ÷ 2`,
          meses: mesesEntorpecentes,
        })
        total += mesesEntorpecentes
      }

      // Calcular pena para munições (15 + Math.floor(municao / 20) * 5)
      if (formData.municoes_selecionadas.length > 0) {
        let totalMunicoes = 0
        formData.municoes_selecionadas.forEach((item) => {
          totalMunicoes += item.quantidade
        })

        const adicionalMunicoes = Math.floor(totalMunicoes / 20) * 5
        const mesesMunicoes = 15 + adicionalMunicoes
        detalhes.push({
          categoria: "Munição Ilegal",
          descricao: `15 meses base + ${Math.floor(totalMunicoes / 20)} grupos de 20 × 5 meses`,
          meses: mesesMunicoes,
        })
        total += mesesMunicoes
      }

      // Calcular pena para armas (20 + armas * 15)
      if (formData.armas_selecionadas.length > 0) {
        let totalArmas = 0
        formData.armas_selecionadas.forEach((item) => {
          totalArmas += item.quantidade
        })

        const mesesArmas = 20 + totalArmas * 15
        detalhes.push({
          categoria: "Porte Ilegal de Arma",
          descricao: `20 meses base + ${totalArmas} × 15 meses`,
          meses: mesesArmas,
        })
        total += mesesArmas
      }

      // Calcular pena para produtos roubados (10 + produtos * 2)
      if (formData.produtos_selecionados.length > 0) {
        let totalProdutos = 0
        formData.produtos_selecionados.forEach((item) => {
          totalProdutos += item.quantidade
        })

        const mesesProdutos = 10 + totalProdutos * 2
        detalhes.push({
          categoria: "Produtos Roubados",
          descricao: `10 meses base + ${totalProdutos} × 2 meses`,
          meses: mesesProdutos,
        })
        total += mesesProdutos
      }

      // Calcular pena para dinheiro ilícito (10 + Math.floor(dinheiro / 1000))
      if (formData.dinheiro_ilicito > 0) {
        const adicionalDinheiro = Math.floor(formData.dinheiro_ilicito / 1000)
        const mesesDinheiro = 10 + adicionalDinheiro
        detalhes.push({
          categoria: "Dinheiro Ilícito",
          descricao: `10 meses base + ${adicionalDinheiro} × R$1.000`,
          meses: mesesDinheiro,
        })
        total += mesesDinheiro
      }

      // Calcular pena para multas pendentes (10 + Math.floor(multas / 1000))
      if (formData.multas_pendentes > 0) {
        const adicionalMultas = Math.floor(formData.multas_pendentes / 1000)
        const mesesMultas = 10 + adicionalMultas
        detalhes.push({
          categoria: "Multas Pendentes",
          descricao: `10 meses base + ${adicionalMultas} × R$1.000`,
          meses: mesesMultas,
        })
        total += mesesMultas
      }

      set({ penaltyCalculation: { detalhes, total }, isLoading: false })
    } catch (error) {
      console.error("Erro ao calcular pena:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      set({ 
        penaltyCalculation: { detalhes: [], total: 0 }, 
        error: `Erro ao calcular pena: ${errorMessage}`,
        isLoading: false
      })
    }
  },
}))
