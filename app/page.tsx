"use client"

import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { MainContent } from "@/components/MainContent"
import { Footer } from "@/components/Footer"
import { ClientWrapper } from "@/components/ClientWrapper"

export default function Home() {
  const [activeTab, setActiveTab] = useState("form")

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
          <Footer />
        </div>
      </div>
    </ClientWrapper>
  )
}
