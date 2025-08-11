/**
 * Centralized data management for the Police Report Generator
 * Contains all fallback data with proper TypeScript types
 */

import type { Tool, Drug, Ammunition, Product, Weapon, DataCollections } from "./types"

// Fallback data collections with proper typing
export const fallbackCollections: DataCollections = {
  ferramentas: [
    { id: 1, nome: "Lockpick", categoria: "Arrombamento" },
    { id: 2, nome: "Chave Micha", categoria: "Arrombamento" },
    { id: 3, nome: "Furadeira", categoria: "Arrombamento" },
    { id: 4, nome: "Alicate", categoria: "Corte" },
    { id: 5, nome: "Lima", categoria: "Corte" },
    { id: 6, nome: "Pé de cabra", categoria: "Arrombamento" },
    { id: 7, nome: "Chave de fenda", categoria: "Ferramentas" },
    { id: 8, nome: "Martelo", categoria: "Ferramentas" },
  ],

  entorpecentes: [
    { id: 1, nome: "Maconha", unidade: "gramas", categoria: "Cannabis" },
    { id: 2, nome: "Cocaína", unidade: "gramas", categoria: "Estimulante" },
    { id: 3, nome: "Metanfetamina", unidade: "gramas", categoria: "Sintético" },
    { id: 4, nome: "Crack", unidade: "pedras", categoria: "Estimulante" },
    { id: 5, nome: "Heroína", unidade: "gramas", categoria: "Opiáceo" },
    { id: 6, nome: "LSD", unidade: "papéis", categoria: "Alucinógeno" },
  ],

  municoes: [
    { id: 1, nome: "Munição de Revólver .38", calibre: "38", tipo: "Revólver" },
    { id: 2, nome: "Munição de Pistola .380", calibre: "380", tipo: "Pistola" },
    { id: 3, nome: "Munição de Glock 9mm", calibre: "9", tipo: "Pistola" },
    { id: 4, nome: "Munição de Pistola .40", calibre: "40", tipo: "Pistola" },
    { id: 5, nome: "Munição de Pistola .45", calibre: "45", tipo: "Pistola" },
    { id: 6, nome: "Munição de Espingarda Cal. 12", calibre: "12", tipo: "Escopeta" },
    { id: 7, nome: "Munição de Rifle .22", calibre: "22", tipo: "Rifle" },
    { id: 8, nome: "Munição de AK-47", calibre: "7.62", tipo: "Fuzil" },
    { id: 9, nome: "Munição de Five Seven", calibre: "5.7", tipo: "Pistola" },
    { id: 10, nome: "Munição de MP5", calibre: "9", tipo: "Submetralhadora" },
    { id: 11, nome: "Munição de MPX", calibre: "9", tipo: "Submetralhadora" },
    { id: 12, nome: "Munição de M4A1", calibre: "5.56", tipo: "Fuzil" },
    { id: 13, nome: "Munição de AUG", calibre: "5.56", tipo: "Fuzil" },
    { id: 14, nome: "Munição de Desert Eagle", calibre: ".50", tipo: "Pistola" },
  ],

  produtos: [
    { id: 1, nome: "Celular", categoria: "Eletrônicos", valor_medio: 800 },
    { id: 2, nome: "Notebook", categoria: "Eletrônicos", valor_medio: 2500 },
    { id: 3, nome: "Televisão", categoria: "Eletrônicos", valor_medio: 1500 },
    { id: 4, nome: "Bicicleta", categoria: "Veículos", valor_medio: 600 },
    { id: 5, nome: "Motocicleta", categoria: "Veículos", valor_medio: 8000 },
    { id: 6, nome: "Automóvel", categoria: "Veículos", valor_medio: 25000 },
    { id: 7, nome: "Joias", categoria: "Objetos de valor", valor_medio: 1200 },
    { id: 8, nome: "Relógio", categoria: "Objetos de valor", valor_medio: 500 },
  ],

  armas: [
    { id: 1, nome: "Glock 9mm", categoria: "Pistola", tipo: "Pistola", calibre: "9mm" },
    { id: 2, nome: "Five Seven", categoria: "Pistola", tipo: "Pistola", calibre: "5.7mm" },
    { id: 3, nome: "Desert Eagle", categoria: "Pistola", tipo: "Pistola", calibre: ".50" },
    { id: 4, nome: "Revólver .38", categoria: "Revólver", tipo: "Revólver", calibre: ".38" },
    { id: 5, nome: "MP5", categoria: "Submetralhadora", tipo: "Submetralhadora", calibre: "9mm" },
    { id: 6, nome: "MPX", categoria: "Submetralhadora", tipo: "Submetralhadora", calibre: "9mm" },
    { id: 7, nome: "AK-47", categoria: "Fuzil", tipo: "Fuzil", calibre: "7.62mm" },
    { id: 8, nome: "M4A1", categoria: "Fuzil", tipo: "Fuzil", calibre: "5.56mm" },
    { id: 9, nome: "AUG", categoria: "Fuzil", tipo: "Fuzil", calibre: "5.56mm" },
    { id: 10, nome: "Espingarda Cal. 12", categoria: "Escopeta", tipo: "Escopeta", calibre: "12" },
  ],
}

// Crime type suggestions for autocomplete
export const crimeTypes = [
  "Tráfico de Drogas",
  "Porte Ilegal de Arma",
  "Roubo",
  "Furto",
  "Receptação",
  "Corrupção Ativa",
  "Corrupção Passiva", 
  "Lavagem de Dinheiro",
  "Estelionato",
  "Falsificação de Documentos",
  "Contrabando",
  "Descaminho",
  "Resistência à Prisão",
  "Desacato",
  "Direção Perigosa",
  "Corrida Ilegal",
  "Associação Criminosa",
]

// Location suggestions for autocomplete
export const locationSuggestions = [
  // Main areas
  "Los Santos Central",
  "Cidade Alta",
  "Baixa da Égua",
  "Periferia",
  "Centro",
  "Zona Norte",
  "Zona Sul",
  "Zona Leste",
  "Zona Oeste",
  
  // Specific landmarks
  "Banco Central",
  "Hospital Público",
  "Delegacia Central",
  "Prefeitura",
  "Arcadius Business Center",
  "Terminal Rodoviário",
  "Porto de Los Santos",
  "Aeroporto Internacional",
  "Shopping Center",
  "Universidade Estadual",
  
  // Streets and neighborhoods
  "Rua das Flores",
  "Avenida Principal",
  "Vila Nova",
  "Conjunto Habitacional",
  "Residencial Paradise",
  "Bairro Industrial",
]

// Vehicle suggestions for autocomplete
export const vehicleSuggestions = [
  "Elegy RH5 Preto",
  "Sultan Classic Azul",
  "Kuruma Blindado",
  "Adder Dourado",
  "Zentorno Verde",
  "T20 Vermelho",
  "Insurgent Pick-Up",
  "Rhino Tank",
  "Buzzard Helicóptero",
  "Maverick Helicóptero",
  "Sanchez Motocicleta",
  "Bagger Motocicleta",
  "BMX Bicicleta",
  "Cruiser Bicicleta",
]

// Helper function to get data by category
export function getDataByCategory<T extends keyof DataCollections>(category: T): DataCollections[T] {
  return fallbackCollections[category]
}

// Helper function to find item by id
export function findItemById<T extends keyof DataCollections>(
  category: T, 
  id: number | string
): DataCollections[T][number] | undefined {
  return fallbackCollections[category].find(item => item.id === id)
}

// Helper function to filter items by search term
export function filterItems<T extends keyof DataCollections>(
  category: T, 
  searchTerm: string
): DataCollections[T] {
  if (!searchTerm) return fallbackCollections[category]
  
  const term = searchTerm.toLowerCase()
  return fallbackCollections[category].filter(item => 
    item.nome.toLowerCase().includes(term) ||
    item.categoria.toLowerCase().includes(term)
  ) as DataCollections[T]
}