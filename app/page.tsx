"use client"

import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { MainContent } from "@/components/MainContent"
import { Footer } from "@/components/Footer"
import { ClientWrapper } from "@/components/ClientWrapper"

export default function Home() {
  const [activeTab, setActiveTab] = useState("form")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ClientWrapper>
      <div className="min-h-screen h-screen dark-bg flex overflow-hidden">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
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
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 lg:ml-64">
          <MainContent 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
          <Footer />
        </div>
      </div>
    </ClientWrapper>
  )
}
