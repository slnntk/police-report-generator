"use client"

import Image from "next/image"

export function Footer() {
  return (
      <footer className="dark-bg border-t dark-border p-4 mt-auto">
        <div className="flex items-center justify-center gap-4">
          <div className="relative w-12 h-12 gradient-primary rounded-full flex items-center justify-center shadow-lg p-1">
            <Image
                src="/images/emblema-policia.png"
                alt="Emblema 1º BPM-AP"
                width={40}
                height={40}
                className="rounded-lg"
            />
          </div>
          <div className="text-center">
              <p className="text-sm font-bold dark-highlight">1º Batalhão de Polícia Militar - Alta Paradise</p>
            <p className="text-xs dark-text-soft">Sistema de Geração de Relatórios Policiais v2.0</p>
            <p className="text-xs dark-text-soft mt-1">Desenvolvido por Tiago Holanda</p>
          </div>
        </div>
      </footer>
  )
}
