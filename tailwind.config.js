/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette basée sur #282c34 (hsl(210 14% 20%))
        background: "hsl(210 14% 12%)",       // Base très sombre
        foreground: "hsl(210 8% 92%)",        // Texte clair avec teinte subtile

        card: {
          DEFAULT: "hsl(210 14% 20%)",        // #282c34 - Couleur de base
          foreground: "hsl(210 8% 92%)",
        },

        primary: {
          DEFAULT: "hsl(265 50% 65%)",        // Violet pour unifier le thème
          foreground: "hsl(0 0% 100%)",
        },

        secondary: {
          DEFAULT: "hsl(210 14% 25%)",        // Variation plus claire de la base
          foreground: "hsl(210 8% 85%)",
        },

        // Couleurs sémantiques (adaptées à la palette)
        success: "hsl(140 45% 50%)",          // Vert désaturé
        warning: "hsl(35 85% 55%)",           // Orange
        error: "hsl(0 65% 55%)",              // Rouge
        info: "hsl(265 50% 65%)",             // Violet cohérent

        // Accents spéciaux
        seo: "hsl(265 50% 65%)",              // Violet désaturé
        sea: "hsl(210 50% 60%)",              // Bleu principal

        muted: {
          DEFAULT: "hsl(210 14% 25%)",
          foreground: "hsl(210 10% 55%)",
        },

        accent: {
          DEFAULT: "hsl(210 50% 60%)",        // Bleu accent principal
          foreground: "hsl(0 0% 100%)",
        },

        destructive: {
          DEFAULT: "hsl(0 65% 55%)",
          foreground: "hsl(0 0% 98%)",
        },

        border: "hsl(210 14% 30%)",           // Bordures cohérentes
        input: "hsl(210 14% 25%)",
        ring: "hsl(210 50% 60%)",             // Focus bleu
      },

      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
}
