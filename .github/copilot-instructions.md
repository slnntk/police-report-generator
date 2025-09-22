# GitHub Copilot Instructions - Police Report Generator

You are working on a **Brazilian Police Report Generator** application built with Next.js, TypeScript, and Tailwind CSS. This application helps Brazilian law enforcement officers generate standardized police reports with automated penalty calculations.

## 🎯 Application Context

This is a professional law enforcement tool designed for Brazilian police officers to:
- Generate standardized police occurrence reports
- Calculate penalties automatically based on Brazilian law
- Manage evidence and seized items
- Export reports to PDF
- Provide a dark, professional theme optimized for police work

## 🔧 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with extensive custom police theme
- **State Management**: Zustand store
- **UI Components**: Radix UI with custom theming
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Language**: Brazilian Portuguese (pt-BR)

## 🎨 Design System & Theming

### Color Palette (Police Theme)
- **Primary Gold**: `#D9C38A` (police badge gold)
- **Background**: `#121212` (dark)
- **Card Background**: `#1E1E1E` to `#2A2A2A` (gradient)
- **Secondary Background**: `#333333`
- **Text**: `#EAEAEA` (primary), `#A0A0A0` (muted)
- **Borders**: `#333333`

### Custom CSS Classes
Always use these predefined classes instead of inline Tailwind:

#### Background Classes
- `.dark-bg` - Main background (#121212)
- `.dark-box-bg` - Box/container background (#1E1E1E)
- `.dark-secondary-bg` - Secondary background (#333333)

#### Text Classes
- `.dark-text` - Primary text (#EAEAEA)
- `.dark-text-soft` - Muted text (#A0A0A0)
- `.dark-highlight` - Accent text (#D9C38A)
- `.dark-cta-text` - Text on primary backgrounds (#1A160A)

#### Component Classes
- `.police-card-dark` - Main card style with hover effects
- `.police-card-compact` - Compact card for items
- `.gradient-primary` - Police gold gradient
- `.btn-primary-dark` - Primary button styling

#### Form Classes
- `.input-dark` - Dark theme inputs
- `.textarea-dark` - Dark theme textareas
- `.select-dark` - Dark theme selects

## 📁 Project Structure

```
/components/
  ├── ui/                    # Radix UI components
  ├── MainContent.tsx        # Main layout component
  ├── QuickOccurrenceForm.tsx # Main form component
  ├── ReportView.tsx         # Generated report display
  ├── SettingsView.tsx       # Configuration view
  ├── ItemSelector.tsx       # Evidence/item selection
  └── ...other components
/lib/
  ├── store.ts              # Zustand store (main app state)
  ├── autocomplete-data.ts  # Brazilian crime/location data
  └── utils.ts              # Utility functions
/public/data/
  ├── templates.json        # Report templates
  ├── crimes.json           # Brazilian crime definitions
  ├── entorpecentes.json    # Drug database
  ├── municoes.json         # Ammunition database
  ├── ferramentas.json      # Illegal tools database
  └── produtos.json         # Stolen goods database
```

## 💾 Data Handling Patterns

### Zustand Store Structure
```typescript
interface FormData {
  tipo_crime: string           // Crime type
  tipo_inicio: string         // How incident started
  local_inicio: string        // Initial location
  local_prisao: string        // Arrest location
  veiculo: string            // Vehicle involved
  desobediencia: boolean     // Disobedience charge
  numero_pessoas_envolvidas: number
  ferramentas_selecionadas: any[]    // Selected illegal tools
  entorpecentes_selecionados: any[]  // Selected drugs
  municoes_selecionadas: any[]       // Selected ammunition
  produtos_selecionados: any[]       // Selected stolen goods
  armas_selecionadas: any[]         // Selected weapons
  dinheiro_ilicito: number          // Illegal money amount
  multas_pendentes: number          // Pending fines
  observacoes: string               // Additional observations
}
```

### JSON Data Files
All data files use Brazilian Portuguese terminology:
- **crimes.json**: Brazilian criminal code definitions
- **entorpecentes.json**: Drug classifications with units (gramas, pedras, etc.)
- **municoes.json**: Ammunition calibers and types
- **ferramentas.json**: Illegal tools categories
- **produtos.json**: Common stolen goods with average values

## 🇧🇷 Brazilian Portuguese Conventions

### Terminology
- **Ocorrência**: Police occurrence/incident
- **Relato**: Report narrative
- **Apreendido**: Seized/confiscated
- **Pena**: Penalty/sentence
- **Flagrante**: Caught in the act
- **QTH**: Location (radio code)
- **Entorpecentes**: Narcotics
- **Munições**: Ammunition
- **Ferramentas Ilícitas**: Illegal tools

### Text Patterns
- Use formal police language
- Include proper legal terminology
- Maintain consistent verb conjugation based on number of people involved
- Use masculine/feminine article agreement

## 🧩 Component Patterns

### Form Components
```typescript
// Always use controlled inputs with Zustand
const { formData, setFormData } = useOccurrenceStore()

// Update patterns
const updateField = (field: string, value: any) => {
  setFormData({ ...formData, [field]: value })
}
```

### Card Components
```tsx
// Standard card pattern
<Card className="police-card-dark">
  <CardHeader className="dark-secondary-bg border-b dark-border">
    <CardTitle className="dark-highlight">Title</CardTitle>
  </CardHeader>
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>
```

### Button Patterns
```tsx
// Primary action button
<Button className="btn-primary-dark">
  <Icon className="h-4 w-4 mr-2" />
  Ação Principal
</Button>

// Secondary button
<Button className="btn-secondary-dark">
  Ação Secundária
</Button>
```

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (2-3 columns)

### Grid Classes
- `.collapsible-card-grid` - Responsive grid for cards
- `.items-grid` - Responsive grid for item selection
- Use custom responsive utilities for police theme

## ⚡ Performance & UX

### Loading States
- Use `InlineLoader` for form operations
- Implement skeleton loading with `.loading-skeleton`
- Provide user feedback for all async operations

### Local Storage
- Auto-save form data as `police-form-data`
- Persist user preferences
- Handle offline scenarios gracefully

### Accessibility
- Support high contrast mode
- Respect `prefers-reduced-motion`
- Maintain keyboard navigation
- Use semantic HTML elements

## 🔧 Code Style Guidelines

### TypeScript
- Use strict type checking
- Define interfaces for all data structures
- Prefer `const` assertions for immutable data
- Use proper Brazilian Portuguese in type names when relevant

### Component Structure
```tsx
"use client"

import { /* imports */ } from "..."

interface ComponentProps {
  // Props with clear Brazilian context when relevant
}

export function Component({ prop }: ComponentProps) {
  // Zustand store access
  const { formData, setFormData } = useOccurrenceStore()
  
  // Component logic
  
  return (
    <div className="police-card-dark">
      {/* Component JSX with proper police theme classes */}
    </div>
  )
}
```

### File Naming
- PascalCase for components: `QuickOccurrenceForm.tsx`
- camelCase for utilities: `autocomplete-data.ts`
- kebab-case for JSON data: `entorpecentes.json`

## 🚨 Law Enforcement Specific Guidelines

### Report Generation
- Always include proper legal disclaimers
- Maintain formal police report structure
- Include all required fields per Brazilian law
- Ensure penalty calculations follow current legislation

### Data Sensitivity
- Never log sensitive police data
- Implement proper data sanitization
- Respect privacy in development tools
- Follow Brazilian data protection laws (LGPD)

### Template Variables
When working with report templates, use these variables:
- `{tipo_crime}` - Crime type
- `{local_inicio}` - Initial location  
- `{local_prisao}` - Arrest location
- `{itens_apreendidos}` - Seized items
- `{calculo_pena}` - Penalty calculation
- `{pena_total}` - Total penalty in months

## 🎯 Key Features to Maintain

1. **Penalty Calculator**: Automatic Brazilian law-based calculations
2. **Template System**: Flexible report templates
3. **Evidence Management**: Comprehensive item tracking
4. **PDF Export**: Professional report formatting
5. **Responsive Design**: Mobile-friendly for field use
6. **Dark Theme**: Optimized for police work environment
7. **Offline Support**: Works without internet connection
8. **Data Persistence**: Auto-save functionality

## ⚠️ Important Notes

- Always test with Brazilian crime data
- Verify penalty calculations against current law
- Maintain professional police terminology
- Ensure responsive design works on mobile devices
- Test PDF export functionality
- Validate all form inputs for legal compliance
- Consider performance on lower-end police equipment

Remember: This is a professional law enforcement tool. Maintain high standards for accuracy, security, and usability.