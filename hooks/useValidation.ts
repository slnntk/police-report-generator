/**
 * Custom hooks for form validation and error handling
 * Provides easy integration of validation with React components
 */

import { useState, useCallback, useMemo } from 'react'
import type { FormData, FormFieldError } from '../lib/types'
import { 
  validateForm, 
  validateField, 
  getFieldErrorMessage, 
  hasFieldError,
  formatValidationSummary 
} from '../lib/validation'

// Hook for comprehensive form validation
export function useFormValidation(formData: FormData) {
  const [errors, setErrors] = useState<FormFieldError[]>([])
  const [touched, setTouched] = useState<Set<keyof FormData>>(new Set())

  // Validate entire form
  const validateFullForm = useCallback(() => {
    const result = validateForm(formData)
    setErrors(result.errors)
    return result.isValid
  }, [formData])

  // Validate single field
  const validateSingleField = useCallback((field: keyof FormData, value: any) => {
    const error = validateField(field, value, formData)
    
    setErrors(prev => {
      const filtered = prev.filter(e => e.field !== field)
      return error ? [...filtered, error] : filtered
    })

    return !error
  }, [formData])

  // Mark field as touched
  const touchField = useCallback((field: keyof FormData) => {
    setTouched(prev => new Set(prev).add(field))
  }, [])

  // Check if field should show error (touched and has error)
  const shouldShowError = useCallback((field: keyof FormData) => {
    return touched.has(field) && hasFieldError(field, errors)
  }, [touched, errors])

  // Get error message for field
  const getError = useCallback((field: keyof FormData) => {
    return shouldShowError(field) ? getFieldErrorMessage(field, errors) : null
  }, [shouldShowError, errors])

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors([])
    setTouched(new Set())
  }, [])

  // Clear specific field error
  const clearFieldError = useCallback((field: keyof FormData) => {
    setErrors(prev => prev.filter(e => e.field !== field))
    setTouched(prev => {
      const newTouched = new Set(prev)
      newTouched.delete(field)
      return newTouched
    })
  }, [])

  // Validation summary
  const validationSummary = useMemo(() => {
    const relevantErrors = errors.filter(e => touched.has(e.field))
    return formatValidationSummary(relevantErrors)
  }, [errors, touched])

  return {
    errors,
    touched,
    isValid: errors.length === 0,
    hasErrors: errors.length > 0,
    validateFullForm,
    validateSingleField,
    touchField,
    shouldShowError,
    getError,
    clearErrors,
    clearFieldError,
    validationSummary
  }
}

// Hook for real-time field validation
export function useFieldValidation(field: keyof FormData, formData: FormData) {
  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  const validate = useCallback(async (value: any) => {
    setIsValidating(true)
    
    // Add small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const fieldError = validateField(field, value, formData)
    setError(fieldError?.message || null)
    setIsValidating(false)
    
    return !fieldError
  }, [field, formData])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    error,
    hasError: !!error,
    isValidating,
    validate,
    clearError
  }
}

// Hook for form submission with validation
export function useFormSubmission(
  formData: FormData,
  onSubmit: (data: FormData) => Promise<void> | void
) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const validation = useFormValidation(formData)

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return false

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Mark all fields as touched to show validation errors
      const allFields: (keyof FormData)[] = [
        'tipo_crime',
        'tipo_inicio', 
        'local_inicio',
        'local_prisao',
        'veiculo',
        'numero_pessoas_envolvidas',
        'observacoes'
      ]
      
      allFields.forEach(field => validation.touchField(field))

      // Validate form
      const isValid = validation.validateFullForm()
      
      if (!isValid) {
        setSubmitError('Por favor, corrija os erros antes de continuar.')
        return false
      }

      // Submit form
      await onSubmit(formData)
      validation.clearErrors()
      return true

    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError(
        error instanceof Error 
          ? `Erro ao enviar: ${error.message}`
          : 'Erro inesperado ao enviar o formulário'
      )
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, onSubmit, isSubmitting, validation])

  return {
    ...validation,
    isSubmitting,
    submitError,
    handleSubmit,
    clearSubmitError: () => setSubmitError(null)
  }
}