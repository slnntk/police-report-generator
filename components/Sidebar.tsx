"use client"

import { FileText, Calculator, Home, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface SidebarProps {
    activeTab: string
    setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const menuItems = [
        { id: "form", label: "Nova Ocorrência", icon: Home },
        { id: "report", label: "Relatório", icon: FileText },
        { id: "calculation", label: "Cálculo de Pena", icon: Calculator },
        { id: "settings", label: "Configurações", icon: Settings },
    ]

    return (
        <div className="w-64 dark-bg text-white h-screen fixed left-0 top-0 shadow-2xl border-r dark-border">
            <div className="p-6 border-b dark-border">
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                            src="/images/emblema-policia.png"
                            alt="Emblema 1º BPM-AP"
                            width={48}
                            height={48}
                            className="rounded-lg shadow-lg"
                            style={{ filter: "drop-shadow(0 4px 8px rgba(217, 195, 138, 0.3))" }}
                        />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-lg font-bold dark-text leading-tight">1º BPM-AP</h1>
                        <p className="text-sm dark-highlight font-semibold">Cidade Alta</p>
                    </div>
                </div>
                <p className="dark-text-soft text-sm text-center bg-gray-800/30 px-3 py-2 rounded-lg">
                    Gerador de Relatórios v2.0
                </p>
            </div>

            <nav className="mt-6">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <Button
                            key={item.id}
                            variant="ghost"
                            className={`w-full justify-start px-6 py-4 text-left rounded-none transition-all duration-300 font-medium border-none ${
                                activeTab === item.id
                                    ? "gradient-primary dark-cta-text shadow-lg border-r-4 border-yellow-400"
                                    : "dark-text hover:dark-secondary-hover hover:dark-text"
                            }`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <Icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Button>
                    )
                })}
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
                <div className="text-center dark-text-soft text-xs p-3 dark-box-bg rounded-lg border dark-border">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="relative w-6 h-6">
                            <Image src="/images/emblema-policia.png" alt="Emblema" width={24} height={24} className="rounded" />
                        </div>
                        <p className="font-semibold dark-highlight">Sistema não oficial feito com muito carinho</p>
                    </div>
                    <p>Otimizado para uso policial</p>
                </div>
            </div>
        </div>
    )
}