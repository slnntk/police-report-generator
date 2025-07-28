"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { LoadingSpinner } from "./LoadingSpinner"

interface ClientWrapperProps {
  children: React.ReactNode
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Pequeno delay para garantir que tudo está carregado
    const timer = setTimeout(() => {
      setMounted(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return <LoadingSpinner />
  }

  return <div className="no-flash loaded">{children}</div>
}
