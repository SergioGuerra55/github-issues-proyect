/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/**/*.{html,ts}",
    "./libs/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'github': {
          'bg-primary': '#0d1117',      // 60% - Fondo principal
          'bg-secondary': '#161b22',    // 60% - Fondo secundario
          'bg-tertiary': '#21262d',     // 30% - Cards principales
          'bg-canvas': '#1c2128',       // 30% - Canvas elementos
          'border-default': '#30363d',  // 30% - Bordes principales
          'border-muted': '#21262d',    // 30% - Bordes suaves
          'text-primary': '#f0f6fc',    // Texto principal
          'text-secondary': '#8b949e',  // Texto secundario
          'text-muted': '#6e7681',      // Texto deshabilitado
          'accent-primary': '#238636',  // 10% - Verde GitHub
          'accent-blue': '#1f6feb',     // 10% - Azul GitHub
          'accent-danger': '#da3633',   // 10% - Rojo GitHub
          'accent-warning': '#fb8500',  // 10% - Naranja GitHub
        }
      },
      fontFamily: {
        'github': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif']
      },
      boxShadow: {
        'github': '0 8px 24px rgba(140, 149, 159, 0.2)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}