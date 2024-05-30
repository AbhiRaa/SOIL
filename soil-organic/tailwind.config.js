/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':'#207187',
        'custom-green': '#10B981'
      },
      backgroundImage: {
        'signIn': "url('./images/backgroundSignIn.jpg')",
      },
      animation: { // Adding new animations
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'glow-fade': 'glowFade 3s ease-in-out infinite',
      },
      keyframes: { // Defining the keyframes for slide-up animation
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        },
      boxShadow:{
        'special-glow':'0 0 10px #4CAF50',
      },
      borderColor: {
        'special-green': '#4CAF50',
      },
      // animation: {
        
      // },
  },
  plugins: [],
  // theme: {
  //   extend: {
  //     colors: {
  //       smoke: {
  //         light: 'rgba(0, 0, 0, 0.5)',  // Change the opacity as needed
  //       },
  //     },
  //   },
  // },
}
}
