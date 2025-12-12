/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'paw-dark': '#2A1B4E',       // Morado Oscuro (Sidebar)
        'paw-dark-light': '#3D2C66', // Morado medio
        'paw-purple': '#875686',     // Morado Marca
        'paw-yellow': '#FFC107',     // Amarillo/Dorado (Botones)
        'paw-orange': '#FF8C42',     // Naranja (Botones Login)
        'paw-gray': '#F3F4F6',       // Gris de fondo
        'paw-text-muted': '#A0AEC0', // Texto gris suave
      }
    },
  },
  plugins: [],
}