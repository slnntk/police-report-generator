/**
 * Enhanced form input components with validation support
 * Provides consistent UI patterns and error handling
 */

import React, { forwardRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

interface BaseInputProps {
  label: string
  error?: string | null
  required?: boolean
  className?: string
  helpText?: string
  loading?: boolean
}

interface ValidatedInputProps extends 
  BaseInputProps,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {}

interface ValidatedTextareaProps extends 
  BaseInputProps,
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {}

// Enhanced Input Component with Validation
export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ 
    label, 
    error, 
    required = false, 
    className, 
    helpText, 
    loading = false,
    disabled,
    ...props 
  }, ref) => {
    const hasError = !!error
    const isValid = !hasError && !loading && props.value && String(props.value).length > 0

    return (
      <div className={cn("space-y-2", className)}>
        <Label 
          htmlFor={props.id}
          className="text-sm font-medium text-slate-200 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-400">*</span>}
          {loading && <Loader2 className="h-3 w-3 animate-spin text-slate-400" />}
        </Label>
        
        <div className="relative">
          <Input
            ref={ref}
            {...props}
            disabled={disabled || loading}
            className={cn(
              "bg-slate-800/50 border-slate-600 text-slate-100 placeholder:text-slate-400",
              "focus:border-yellow-400 focus:ring-yellow-400/20",
              hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              isValid && "border-green-500",
              "transition-colors duration-200"
            )}
          />
          
          {/* Status Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
            {!loading && hasError && <AlertCircle className="h-4 w-4 text-red-400" />}
            {!loading && isValid && <CheckCircle2 className="h-4 w-4 text-green-400" />}
          </div>
        </div>

        {/* Help Text */}
        {helpText && !error && (
          <p className="text-xs text-slate-400 flex items-center gap-1">
            💡 {helpText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
    )
  }
)

ValidatedInput.displayName = "ValidatedInput"

// Enhanced Textarea Component with Validation
export const ValidatedTextarea = forwardRef<HTMLTextAreaElement, ValidatedTextareaProps>(
  ({ 
    label, 
    error, 
    required = false, 
    className, 
    helpText, 
    loading = false,
    disabled,
    ...props 
  }, ref) => {
    const hasError = !!error
    const isValid = !hasError && !loading && props.value && String(props.value).length > 0
    const [charCount, setCharCount] = useState(String(props.value || '').length)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      props.onChange?.(e)
    }

    const maxLength = props.maxLength || 1000
    const isNearLimit = charCount > maxLength * 0.8
    const isOverLimit = charCount > maxLength

    return (
      <div className={cn("space-y-2", className)}>
        <Label 
          htmlFor={props.id}
          className="text-sm font-medium text-slate-200 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-400">*</span>}
          {loading && <Loader2 className="h-3 w-3 animate-spin text-slate-400" />}
        </Label>
        
        <div className="relative">
          <Textarea
            ref={ref}
            {...props}
            onChange={handleChange}
            disabled={disabled || loading}
            className={cn(
              "bg-slate-800/50 border-slate-600 text-slate-100 placeholder:text-slate-400",
              "focus:border-yellow-400 focus:ring-yellow-400/20",
              "min-h-[100px] resize-y",
              hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              isValid && "border-green-500",
              isOverLimit && "border-red-500",
              "transition-colors duration-200"
            )}
          />
        </div>

        {/* Character Count */}
        <div className="flex justify-between items-center">
          <div>
            {/* Help Text */}
            {helpText && !error && (
              <p className="text-xs text-slate-400">
                💡 {helpText}
              </p>
            )}

            {/* Error Message */}
            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>

          {/* Character Counter */}
          <p className={cn(
            "text-xs",
            isOverLimit ? "text-red-400" : 
            isNearLimit ? "text-yellow-400" : "text-slate-400"
          )}>
            {charCount}/{maxLength}
          </p>
        </div>
      </div>
    )
  }
)

ValidatedTextarea.displayName = "ValidatedTextarea"

// Field Group Component for organizing related fields
interface FieldGroupProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  required?: boolean
}

export const FieldGroup: React.FC<FieldGroupProps> = ({
  title,
  description,
  children,
  className,
  required = false
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1">
          {title}
          {required && <span className="text-red-400">*</span>}
        </h3>
        {description && (
          <p className="text-xs text-slate-400">{description}</p>
        )}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}

// Validation Summary Component
interface ValidationSummaryProps {
  summary: string
  className?: string
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  summary,
  className
}) => {
  if (!summary) return null

  return (
    <div className={cn(
      "p-4 bg-red-900/20 border border-red-500/30 rounded-lg",
      "text-red-300 text-sm whitespace-pre-line",
      className
    )}>
      {summary}
    </div>
  )
}

// Success Message Component
interface SuccessMessageProps {
  message: string
  className?: string
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  className
}) => {
  if (!message) return null

  return (
    <div className={cn(
      "p-4 bg-green-900/20 border border-green-500/30 rounded-lg",
      "text-green-300 text-sm flex items-center gap-2",
      className
    )}>
      <CheckCircle2 className="h-4 w-4" />
      {message}
    </div>
  )
}