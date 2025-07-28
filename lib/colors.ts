// Nova Paleta Dark Theme para Sistema Policial
export const darkThemeColors = {
  // Cores principais do tema escuro
  bg: "#121212",
  bgSoft: "#1A1A1A",
  text: "#EAEAEA",
  textSoft: "#A0A0A0",
  boxBg: "#1E1E1E",
  boxBorder: "#333333",
  hover: "#2A2A2A",
  secondaryBg: "#333333",
  secondaryText: "#EAEAEA",
  secondaryHoverBg: "#404040",
  highlight: "#D9C38A",
  ctaBg: "#D9C38A",
  highlightSoft: "#3A3423",
  ctaText: "#1A160A",
}

// Gradientes para elementos especiais
export const gradients = {
  primary: "linear-gradient(135deg, #D9C38A 0%, #B8A572 100%)",
  secondary: "linear-gradient(135deg, #333333 0%, #404040 100%)",
  background: "linear-gradient(135deg, #121212 0%, #1A1A1A 100%)",
  card: "linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)",
  highlight: "linear-gradient(135deg, #D9C38A 0%, #E6D49B 100%)",
}

// Mapeamento semântico
export const semanticColors = {
  // Backgrounds
  background: darkThemeColors.bg,
  backgroundSoft: darkThemeColors.bgSoft,
  surface: darkThemeColors.boxBg,
  surfaceHover: darkThemeColors.hover,

  // Textos
  textPrimary: darkThemeColors.text,
  textSecondary: darkThemeColors.textSoft,

  // Elementos interativos
  primary: darkThemeColors.highlight,
  primaryHover: "#E6D49B",
  secondary: darkThemeColors.secondaryBg,
  secondaryHover: darkThemeColors.secondaryHoverBg,

  // Borders
  border: darkThemeColors.boxBorder,
  borderHover: "#404040",

  // Estados
  success: "#4ADE80",
  warning: "#FBBF24",
  error: "#F87171",
}
