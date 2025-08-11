/**
 * Enhanced Occurrence Form with comprehensive validation
 * Replaces QuickOccurrenceForm with better UX and type safety
 */

"use client"

import React, { useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useOccurrenceStore } from '@/lib/store'
import { useFormSubmission } from '@/hooks/useValidation'
import { 
  ValidatedInput, 
  ValidatedTextarea, 
  FieldGroup, 
  ValidationSummary,
  SuccessMessage 
} from '@/components/ui/validated-inputs'
import { Badge } from '@/components/ui/badge'
import { Zap, Loader2, AlertTriangle } from 'lucide-react'
import { OccurrenceTypeSelector } from './OccurrenceTypeSelector'
import { PeopleCount } from './PeopleCount'
import { crimeTypes, locationSuggestions, vehicleSuggestions } from '@/lib/data'

interface ValidatedOccurrenceFormProps {
  onFormSubmit: () => void
  showResults: boolean
  onCalculationUpdate?: () => void
}

export function ValidatedOccurrenceForm({ 
  onFormSubmit, 
  showResults, 
  onCalculationUpdate 
}: ValidatedOccurrenceFormProps) {
  const { 
    formData, 
    setFormData, 
    generateReport, 
    calculatePenalty, 
    isLoading, 
    error: storeError,
    tiposInicio 
  } = useOccurrenceStore()

  const handleSubmit = useCallback(async (data: typeof formData) => {
    try {
      // Calculate penalty first
      calculatePenalty()
      if (onCalculationUpdate) {
        onCalculationUpdate()
      }
      
      // Generate report
      await generateReport()
      
      // Notify parent component
      onFormSubmit()
    } catch (error) {
      console.error('Error during form submission:', error)
      throw error
    }
  }, [calculatePenalty, generateReport, onFormSubmit, onCalculationUpdate])

  const {
    errors,
    isSubmitting,
    submitError,
    handleSubmit: submitForm,
    clearSubmitError,
    getError,
    shouldShowError,
    touchField,
    validationSummary
  } = useFormSubmission(formData, handleSubmit)

  const updateField = useCallback((field: keyof typeof formData, value: any) => {
    setFormData({ [field]: value })
    touchField(field)
  }, [setFormData, touchField])

  const handleInputChange = (field: keyof typeof formData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateField(field, e.target.value)
    }

  const isFormLoading = isLoading || isSubmitting

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <Card className="police-card-dark shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 dark-text">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-black" />
            </div>
            Nova Ocorrência
            {isFormLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Validation Summary */}
      {validationSummary && (
        <ValidationSummary summary={validationSummary} />
      )}

      {/* Submit Error */}
      {submitError && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {submitError}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearSubmitError}
            className="ml-auto text-red-300 hover:text-red-100"
          >
            ✕
          </Button>
        </div>
      )}

      {/* Store Error */}
      {storeError && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {storeError}
        </div>
      )}

      {/* Main Form */}
      <Card className="police-card-dark">
        <CardContent className="p-6 space-y-8">
          
          {/* Occurrence Type Selection */}
          <FieldGroup 
            title="Como iniciou a ocorrência?"
            description="Selecione o tipo de abordagem inicial"
            required
          >
            <OccurrenceTypeSelector 
              selectedType={formData.tipo_inicio}
              onTypeChange={(value) => updateField('tipo_inicio', value)}
              types={tiposInicio}
            />
            {getError('tipo_inicio') && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-2">
                <AlertTriangle className="h-3 w-3" />
                {getError('tipo_inicio')}
              </p>
            )}
          </FieldGroup>

          {/* Basic Information */}
          <FieldGroup 
            title="Informações Básicas"
            description="Dados essenciais da ocorrência"
            required
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                id="tipo_crime"
                label="Tipo de Crime"
                value={formData.tipo_crime}
                onChange={handleInputChange('tipo_crime')}
                placeholder="Ex: Tráfico de Drogas"
                error={getError('tipo_crime')}
                helpText="Descreva o crime principal"
                required
                disabled={isFormLoading}
                list="crimes-datalist"
              />
              
              <ValidatedInput
                id="veiculo"
                label="Veículo"
                value={formData.veiculo}
                onChange={handleInputChange('veiculo')}
                placeholder="Ex: Elegy RH5 Preto - A1BC1234"
                error={getError('veiculo')}
                helpText="Modelo e placa (opcional)"
                disabled={isFormLoading}
                list="vehicles-datalist"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                id="local_inicio"
                label="Local de Início"
                value={formData.local_inicio}
                onChange={handleInputChange('local_inicio')}
                placeholder="Ex: Los Santos Central"
                error={getError('local_inicio')}
                helpText="Onde começou a ocorrência"
                required
                disabled={isFormLoading}
                list="locations-datalist"
              />
              
              <ValidatedInput
                id="local_prisao"
                label="Local de Prisão"
                value={formData.local_prisao}
                onChange={handleInputChange('local_prisao')}
                placeholder="Ex: Próximo ao Arcadius"
                error={getError('local_prisao')}
                helpText="Onde foi efetuada a prisão"
                required
                disabled={isFormLoading}
                list="locations-datalist"
              />
            </div>
          </FieldGroup>

          {/* People Count */}
          <FieldGroup
            title="Pessoas Envolvidas"
            description="Número de suspeitos na ocorrência"
            required
          >
            <PeopleCount
              value={formData.numero_pessoas_envolvidas}
              onChange={(value) => updateField('numero_pessoas_envolvidas', value)}
              error={getError('numero_pessoas_envolvidas')}
              disabled={isFormLoading}
            />
          </FieldGroup>

          {/* Additional Information */}
          <FieldGroup
            title="Informações Complementares"
            description="Detalhes adicionais da ocorrência"
          >
            <ValidatedTextarea
              id="observacoes"
              label="Observações"
              value={formData.observacoes}
              onChange={handleInputChange('observacoes')}
              placeholder="Informações adicionais sobre a ocorrência..."
              error={getError('observacoes')}
              helpText="Descreva detalhes relevantes"
              maxLength={1000}
              disabled={isFormLoading}
              rows={4}
            />
          </FieldGroup>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-600">
            <Button
              onClick={submitForm}
              disabled={isFormLoading}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 flex items-center gap-2"
            >
              {isFormLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Gerar Relatório
                </>
              )}
            </Button>

            {showResults && (
              <SuccessMessage message="Relatório gerado com sucesso!" />
            )}
          </div>

        </CardContent>
      </Card>

      {/* Datalists for autocomplete */}
      <datalist id="crimes-datalist">
        {crimeTypes.map(crime => (
          <option key={crime} value={crime} />
        ))}
      </datalist>

      <datalist id="locations-datalist">
        {locationSuggestions.map(location => (
          <option key={location} value={location} />
        ))}
      </datalist>

      <datalist id="vehicles-datalist">
        {vehicleSuggestions.map(vehicle => (
          <option key={vehicle} value={vehicle} />
        ))}
      </datalist>
    </div>
  )
}