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
      
  
    },
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

