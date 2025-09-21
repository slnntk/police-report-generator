"use client"

import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { MainContent } from "@/components/MainContent"
import { Footer } from "@/components/Footer"
import { ClientWrapper } from "@/components/ClientWrapper"
import ErrorBoundary from "@/components/ErrorBoundary"
import { Toaster } from "@/components/ui/enhanced-toast"

export default function Home() {
  const [activeTab, setActiveTab] = useState("form")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ErrorBoundary>
      <ClientWrapper>
        <div className="min-h-screen dark-bg flex">
          {/* Mobile backdrop */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-200"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
            <MainContent 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              onOpenSidebar={() => setSidebarOpen(true)}
            />
            <Footer />
          </div>
        </div>
        
        {/* Global Toast Notifications */}
        <Toaster />
      </ClientWrapper>
    </ErrorBoundary>
  )
}
