"use client"

import Image from "next/image"

export function LoadingSpinner() {
  return (
      <div className="min-h-screen gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center shadow-2xl animate-pulse p-2">
              <Image
                  src="/images/emblema-policia.png"
                  alt="Emblema 1º BPM-AP"
                  width={80}
                  height={80}
                  className="rounded-lg"
              />
            </div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold dark-highlight mb-2">1º BPM-AP</h2>
          <p className="dark-text font-semibold mb-1">Cidade Alta</p>
          <p className="dark-text-soft">Carregando gerador de relatórios...</p>
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        </div>
      </div>
  )
}