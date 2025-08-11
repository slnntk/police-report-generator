/**
 * TypeScript interfaces for the Police Report Generator
 * Comprehensive type definitions for better type safety and maintainability
 */

// Base item interface for all selectable items
export interface BaseItem {
  id: number | string
  nome: string
  categoria: string
  quantidade?: number
}

// Specific item types
export interface Tool extends BaseItem {
  tipo?: string
}

export interface Drug extends BaseItem {
  unidade: string
  categoria: "Cannabis" | "Estimulante" | "Depressor" | "Alucinógeno" | "Sintético" | "Opiáceo"
}

export interface Ammunition extends BaseItem {
  calibre: string
  tipo: "Revólver" | "Pistola" | "Fuzil" | "Submetralhadora" | "Escopeta"
}

export interface Product extends BaseItem {
  valor_medio?: number
}

export interface Weapon extends BaseItem {
  tipo: "Pistola" | "Revólver" | "Fuzil" | "Submetralhadora" | "Escopeta" | "Rifle"
  calibre?: string
}

// Occurrence start types
export interface OccurrenceStartType {
  id: string
  nome: string
  descricao: string
}

// Form data structure
export interface FormData {
  tipo_crime: string
  tipo_inicio: string
  local_inicio: string
  local_prisao: string
  veiculo: string
  desobediencia: boolean
  numero_pessoas_envolvidas: number
  ferramentas_selecionadas: Tool[]
  entorpecentes_selecionados: Drug[]
  municoes_selecionadas: Ammunition[]
  produtos_selecionados: Product[]
  armas_selecionadas: Weapon[]
  dinheiro_ilicito: number
  multas_pendentes: number
  observacoes: string
}

// Penalty calculation types
export interface PenaltyDetail {
  categoria: string
  descricao: string
  meses: number
  itens?: BaseItem[]
}

export interface PenaltyCalculation {
  detalhes: PenaltyDetail[]
  total: number
}

// Report templates
export interface ReportTemplate {
  titulo: string
  template: string
}

export interface TemplateCollection {
  [key: string]: ReportTemplate
}

// Fallback data structure
export interface FallbackData {
  templates: {
    tipos_inicio: OccurrenceStartType[]
    templates: TemplateCollection
  }
}

// Store interface
export interface OccurrenceStore {
  formData: FormData
  generatedReport: string
  penaltyCalculation: PenaltyCalculation
  tiposInicio: OccurrenceStartType[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setFormData: (data: Partial<FormData>) => void
  setTiposInicio: (tipos: OccurrenceStartType[]) => void
  generateReport: () => Promise<void>
  calculatePenalty: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetForm: () => void
}

// Generic data collections
export interface DataCollections {
  ferramentas: Tool[]
  entorpecentes: Drug[]
  municoes: Ammunition[]
  produtos: Product[]
  armas: Weapon[]
}

// Form validation types
export type FormFieldError = {
  field: keyof FormData
  message: string
}

export type FormValidationResult = {
  isValid: boolean
  errors: FormFieldError[]
}

// UI State types
export type TabType = "form" | "report" | "calculation" | "settings"

export type LoadingState = "idle" | "loading" | "success" | "error"

export interface UIState {
  activeTab: TabType
  currentStep: string
  feedbackAction: "generated" | "copied" | "calculated" | null
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  disabled?: boolean
}

export interface FormSectionProps extends BaseComponentProps {
  title: string
  description?: string
  required?: boolean
}

// Autocomplete types
export interface AutocompleteOption {
  id: string
  name?: string
  crime?: string
  description: string
  category?: string
}

// Generic counter component props
export interface CounterInputProps extends BaseComponentProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label: string
  unit?: string
}