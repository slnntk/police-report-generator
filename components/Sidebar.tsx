"use client"

import { FileText, Calculator, Home, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface SidebarProps {
    activeTab: string
    setActiveTab: (tab: string) => void
    isOpen: boolean
    onClose: () => void
}

export function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
    const menuItems = [
        { id: "form", label: "Nova Ocorrência", icon: Home },
        { id: "report", label: "Relatório", icon: FileText },
        { id: "calculation", label: "Cálculo de Pena", icon: Calculator },
        { id: "settings", label: "Configurações", icon: Settings },
    ]

    const handleItemClick = (itemId: string) => {
        setActiveTab(itemId)
        onClose() // Close mobile sidebar when item is selected
    }

    return (
        <>
            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 dark-bg dark-border border-r">
                <div className="flex flex-col flex-grow">
                    {/* Header */}
                    <div className="p-6 border-b dark-border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-12 h-12 flex-shrink-0">
                                <Image
                                    src="/images/emblema-policia.png"
                                    alt="Emblema da Polícia Militar do 1º BPM-AP"
                                    width={48}
                                    height={48}
                                    className="rounded-lg shadow-lg"
                                    style={{ filter: "drop-shadow(0 4px 8px rgba(217, 195, 138, 0.3))" }}
                                    priority
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

                    {/* Navigation */}
                    <nav className="flex-1 mt-6 px-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <Button
                                    key={item.id}
                                    variant="ghost"
                                    className={`w-full justify-start px-4 py-4 mb-1 text-left rounded-lg transition-all duration-300 font-medium ${
                                        activeTab === item.id
                                            ? "gradient-primary dark-cta-text shadow-lg"
                                            : "dark-text hover:dark-secondary-hover hover:dark-text"
                                    }`}
                                    onClick={() => handleItemClick(item.id)}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.label}
                                </Button>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4">
                        <div className="text-center dark-text-soft text-xs p-3 dark-box-bg rounded-lg border dark-border">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="relative w-6 h-6">
                                    <Image 
                                        src="/images/emblema-policia.png" 
                                        alt="Emblema da Polícia Militar do 1º BPM-AP" 
                                        width={24} 
                                        height={24} 
                                        className="rounded" 
                                    />
                                </div>
                                <p className="font-semibold dark-highlight">Sistema não oficial feito com muito carinho</p>
                            </div>
                            <p>Otimizado para uso policial</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar */}
            <div className={`lg:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-y-0 left-0 w-64 dark-bg dark-border border-r shadow-xl">
                    <div className="flex flex-col h-full">
                        {/* Mobile header with close button */}
                        <div className="p-6 border-b dark-border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 flex-shrink-0">
                                        <Image
                                            src="/images/emblema-policia.png"
                                            alt="Emblema da Polícia Militar do 1º BPM-AP"
                                            width={40}
                                            height={40}
                                            className="rounded-lg shadow-lg"
                                            style={{ filter: "drop-shadow(0 4px 8px rgba(217, 195, 138, 0.3))" }}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <h1 className="text-base font-bold dark-text leading-tight">1º BPM-AP</h1>
                                        <p className="text-xs dark-highlight font-semibold">Cidade Alta</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className="dark-text hover:dark-secondary-hover"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <p className="dark-text-soft text-xs text-center bg-gray-800/30 px-3 py-2 rounded-lg">
                                Gerador de Relatórios v2.0
                            </p>
                        </div>

                        {/* Mobile navigation */}
                        <nav className="flex-1 mt-6 px-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Button
                                        key={item.id}
                                        variant="ghost"
                                        className={`w-full justify-start px-4 py-4 mb-1 text-left rounded-lg transition-all duration-300 font-medium ${
                                            activeTab === item.id
                                                ? "gradient-primary dark-cta-text shadow-lg"
                                                : "dark-text hover:dark-secondary-hover hover:dark-text"
                                        }`}
                                        onClick={() => handleItemClick(item.id)}
                                    >
                                        <Icon className="mr-3 h-5 w-5" />
                                        {item.label}
                                    </Button>
                                )
                            })}
                        </nav>

                        {/* Mobile footer */}
                        <div className="p-4">
                            <div className="text-center dark-text-soft text-xs p-3 dark-box-bg rounded-lg border dark-border">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div className="relative w-5 h-5">
                                        <Image 
                                            src="/images/emblema-policia.png" 
                                            alt="Emblema da Polícia Militar do 1º BPM-AP" 
                                            width={20} 
                                            height={20} 
                                            className="rounded" 
                                        />
                                    </div>
                                    <p className="font-semibold dark-highlight">Sistema não oficial</p>
                                </div>
                                <p>Otimizado para uso policial</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}