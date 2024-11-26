/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class', '[class*="app-dark"]'], 
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'], 
    plugins: [require('tailwindcss-primeui')], 
    theme: {
        screens: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1920px',
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#8A2BE2', // Main purple
                    light: '#A779E9',  // Lighter purple
                },
                background: {
                    gradientStart: '#F8E8F2', // Pink
                    gradientEnd: '#E3DFF5',   // Lavender
                },
                neutral: {
                    dark: '#4B4B4B', // Dark text
                    light: '#B3B3B3', // Light text
                },
                card: {
                    bg: '#FFFFFF', // White background for cards
                },
                danger: '#dc2626', // Custom color for danger actions
                success: '#16a34a', // Custom color for success actions
                warning: '#facc15', // Custom color for warnings
            },
        },
        backgroundImage: {
            'custom-gradient': 'linear-gradient(to bottom, #F8E8F2, #E3DFF5)',
        },
    },
};
