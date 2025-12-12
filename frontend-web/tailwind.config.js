/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'paw-dark': '#2A1B4E',      // El morado oscuro del sidebar
        'paw-dark-light': '#3D2C66', // Un tono más claro para items activos
        'paw-purple': '#875686',    // Tu morado de marca original (botones acciones)
        'paw-yellow': '#FFC107',    // El amarillo/dorado de los botones
        'paw-gray': '#F3F4F6',      // Fondo gris claro
        'paw-text-muted': '#A0AEC0', // Texto gris en fondo oscuro
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Recomendado (puedes dejar el default)
      }
    },
  },
  plugins: [],
}