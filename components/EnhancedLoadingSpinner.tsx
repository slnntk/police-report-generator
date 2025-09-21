"use client"

import React from 'react'
import { Loader2, Shield, FileText, Calculator } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  message?: string
  variant?: 'default' | 'form' | 'report' | 'calculation'
}

const variantConfig = {
  default: {
    icon: Loader2,
    color: 'text-blue-400',
    message: 'Carregando...'
  },
  form: {
    icon: Shield,
    color: 'text-yellow-400',
    message: 'Carregando dados da ocorrência...'
  },
  report: {
    icon: FileText,
    color: 'text-green-400',
    message: 'Gerando relatório policial...'
  },
  calculation: {
    icon: Calculator,
    color: 'text-purple-400',
    message: 'Calculando penalidades...'
  }
}

const sizeConfig = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  message,
  variant = 'default'
}: LoadingSpinnerProps) {
  const config = variantConfig[variant]
  const Icon = config.icon
  const displayMessage = message || config.message

  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-3 p-6",
      className
    )}>
      <div className="relative">
        <Icon 
          className={cn(
            sizeConfig[size],
            config.color,
            "animate-spin"
          )}
        />
        {variant !== 'default' && (
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-75 animate-pulse -z-10" />
        )}
      </div>
      
      {displayMessage && (
        <div className="text-center space-y-1">
          <p className={cn("font-medium", config.color)}>
            {displayMessage}
          </p>
          <div className="flex space-x-1 justify-center">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", config.color)} />
            <div className={cn("w-2 h-2 rounded-full animate-pulse delay-75", config.color)} />
            <div className={cn("w-2 h-2 rounded-full animate-pulse delay-150", config.color)} />
          </div>
        </div>
      )}
    </div>
  )
}

export function FullPageLoader({ message, variant }: Pick<LoadingSpinnerProps, 'message' | 'variant'>) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/90 rounded-lg border border-gray-700/50 p-8 max-w-sm w-full mx-4">
        <LoadingSpinner 
          size="xl" 
          message={message}
          variant={variant}
          className="py-4"
        />
      </div>
    </div>
  )
}

export function InlineLoader({ message, variant, className }: LoadingSpinnerProps) {
  return (
    <div className={cn(
      "flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50",
      className
    )}>
      <LoadingSpinner size="sm" variant={variant} className="p-0" />
      <span className="text-gray-300 text-sm">
        {message || variantConfig[variant || 'default'].message}
      </span>
    </div>
  )
}

export default LoadingSpinner