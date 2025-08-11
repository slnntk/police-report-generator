/**
 * Form validation utilities for the Police Report Generator
 * Provides comprehensive validation with user-friendly error messages in Portuguese
 */

import type { FormData, FormFieldError, FormValidationResult } from "./types"

// Validation rules for each field
export const validationRules = {
  tipo_crime: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: "Tipo de crime é obrigatório e deve ter entre 3 e 100 caracteres"
  },
  tipo_inicio: {
    required: true,
    message: "Selecione como a ocorrência foi iniciada"
  },
  local_inicio: {
    required: true,
    minLength: 3,
    maxLength: 200,
    message: "Local de início é obrigatório e deve ter entre 3 e 200 caracteres"
  },
  local_prisao: {
    required: true,
    minLength: 3,
    maxLength: 200,
    message: "Local de prisão é obrigatório e deve ter entre 3 e 200 caracteres"
  },
  veiculo: {
    required: false,
    maxLength: 100,
    message: "Veículo deve ter no máximo 100 caracteres"
  },
  numero_pessoas_envolvidas: {
    required: true,
    min: 1,
    max: 50,
    message: "Número de pessoas deve estar entre 1 e 50"
  },
  observacoes: {
    required: false,
    maxLength: 1000,
    message: "Observações devem ter no máximo 1000 caracteres"
  }
} as const

// Individual field validators
export const validators = {
  validateRequired: (value: string | number | boolean): boolean => {
    if (typeof value === "string") return value.trim().length > 0
    if (typeof value === "number") return !isNaN(value) && value > 0
    return value !== null && value !== undefined
  },

  validateLength: (value: string, min?: number, max?: number): boolean => {
    const length = value.trim().length
    if (min && length < min) return false
    if (max && length > max) return false
    return true
  },

  validateRange: (value: number, min?: number, max?: number): boolean => {
    if (isNaN(value)) return false
    if (min && value < min) return false
    if (max && value > max) return false
    return true
  },

  validateCrimeType: (value: string): boolean => {
    const crimeType = value.trim()
    if (crimeType.length < 3) return false
    // Check for common crime patterns
    const validPatterns = [
      /tráfico/i,
      /roubo/i,
      /furto/i,
      /porte/i,
      /corrupção/i,
      /lavagem/i,
      /estelionato/i,
      /falsificação/i,
      /receptação/i,
      /contrabando/i,
      /descaminho/i,
      /resistência/i,
      /desacato/i,
      /direção/i,
      /corrida/i,
      /associação/i
    ]
    return validPatterns.some(pattern => pattern.test(crimeType)) || crimeType.length >= 10
  },

  validateLocation: (value: string): boolean => {
    const location = value.trim()
    if (location.length < 3) return false
    // Basic location validation - should have some structure
    return /^[A-Za-zÀ-ÿ0-9\s\-,.()]+$/.test(location)
  },

  validateVehicle: (value: string): boolean => {
    if (!value || value.trim().length === 0) return true // Optional field
    const vehicle = value.trim()
    // Should contain vehicle name and potentially license plate
    return vehicle.length >= 5 && /^[A-Za-zÀ-ÿ0-9\s\-]+$/.test(vehicle)
  },

  validateItemQuantities: (formData: FormData): boolean => {
    // At least one item should be selected for a meaningful report
    const hasItems = 
      formData.ferramentas_selecionadas.some(item => (item.quantidade || 0) > 0) ||
      formData.entorpecentes_selecionados.some(item => (item.quantidade || 0) > 0) ||
      formData.municoes_selecionadas.some(item => (item.quantidade || 0) > 0) ||
      formData.produtos_selecionados.some(item => (item.quantidade || 0) > 0) ||
      formData.armas_selecionadas.some(item => (item.quantidade || 0) > 0) ||
      formData.dinheiro_ilicito > 0 ||
      formData.multas_pendentes > 0
    
    return hasItems
  }
}

// Main validation function
export function validateForm(formData: FormData): FormValidationResult {
  const errors: FormFieldError[] = []

  // Validate tipo_crime
  const rule = validationRules.tipo_crime
  if (rule.required && !validators.validateRequired(formData.tipo_crime)) {
    errors.push({ field: "tipo_crime", message: rule.message })
  } else if (formData.tipo_crime && !validators.validateLength(formData.tipo_crime, rule.minLength, rule.maxLength)) {
    errors.push({ field: "tipo_crime", message: rule.message })
  } else if (formData.tipo_crime && !validators.validateCrimeType(formData.tipo_crime)) {
    errors.push({ 
      field: "tipo_crime", 
      message: "Tipo de crime deve ser mais específico (ex: 'Tráfico de Drogas', 'Roubo à Mão Armada')" 
    })
  }

  // Validate tipo_inicio
  if (validationRules.tipo_inicio.required && !validators.validateRequired(formData.tipo_inicio)) {
    errors.push({ field: "tipo_inicio", message: validationRules.tipo_inicio.message })
  }

  // Validate local_inicio
  const inicioRule = validationRules.local_inicio
  if (inicioRule.required && !validators.validateRequired(formData.local_inicio)) {
    errors.push({ field: "local_inicio", message: inicioRule.message })
  } else if (formData.local_inicio && !validators.validateLength(formData.local_inicio, inicioRule.minLength, inicioRule.maxLength)) {
    errors.push({ field: "local_inicio", message: inicioRule.message })
  } else if (formData.local_inicio && !validators.validateLocation(formData.local_inicio)) {
    errors.push({ 
      field: "local_inicio", 
      message: "Local de início deve conter um endereço válido" 
    })
  }

  // Validate local_prisao
  const prisaoRule = validationRules.local_prisao
  if (prisaoRule.required && !validators.validateRequired(formData.local_prisao)) {
    errors.push({ field: "local_prisao", message: prisaoRule.message })
  } else if (formData.local_prisao && !validators.validateLength(formData.local_prisao, prisaoRule.minLength, prisaoRule.maxLength)) {
    errors.push({ field: "local_prisao", message: prisaoRule.message })
  } else if (formData.local_prisao && !validators.validateLocation(formData.local_prisao)) {
    errors.push({ 
      field: "local_prisao", 
      message: "Local de prisão deve conter um endereço válido" 
    })
  }

  // Validate veiculo (optional)
  if (formData.veiculo && !validators.validateVehicle(formData.veiculo)) {
    errors.push({ 
      field: "veiculo", 
      message: "Veículo deve conter modelo e/ou placa válidos" 
    })
  }

  // Validate numero_pessoas_envolvidas
  const pessoasRule = validationRules.numero_pessoas_envolvidas
  if (!validators.validateRange(formData.numero_pessoas_envolvidas, pessoasRule.min, pessoasRule.max)) {
    errors.push({ field: "numero_pessoas_envolvidas", message: pessoasRule.message })
  }

  // Validate observacoes (optional)
  if (formData.observacoes && !validators.validateLength(formData.observacoes, undefined, validationRules.observacoes.maxLength)) {
    errors.push({ field: "observacoes", message: validationRules.observacoes.message })
  }

  // Validate that at least some items are selected
  if (!validators.validateItemQuantities(formData)) {
    errors.push({ 
      field: "ferramentas_selecionadas", 
      message: "Adicione pelo menos um item apreendido (drogas, armas, ferramentas, produtos, dinheiro ou multas)" 
    })
  }

  // Cross-field validations
  if (formData.local_inicio.trim().toLowerCase() === formData.local_prisao.trim().toLowerCase()) {
    errors.push({ 
      field: "local_prisao", 
      message: "Local de prisão deve ser diferente do local de início da ocorrência" 
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validate single field
export function validateField(field: keyof FormData, value: any, formData?: FormData): FormFieldError | null {
  const partialForm = formData || {} as FormData
  const testForm = { ...partialForm, [field]: value }
  const result = validateForm(testForm)
  
  return result.errors.find(error => error.field === field) || null
}

// Get user-friendly error messages
export function getFieldErrorMessage(field: keyof FormData, errors: FormFieldError[]): string | null {
  const error = errors.find(e => e.field === field)
  return error ? error.message : null
}

// Check if field has error
export function hasFieldError(field: keyof FormData, errors: FormFieldError[]): boolean {
  return errors.some(e => e.field === field)
}

// Format validation summary for display
export function formatValidationSummary(errors: FormFieldError[]): string {
  if (errors.length === 0) return ""
  
  if (errors.length === 1) {
    return `❌ ${errors[0].message}`
  }
  
  const summary = errors.map(error => `• ${error.message}`).join('\n')
  return `❌ Corrija os seguintes erros:\n${summary}`
}