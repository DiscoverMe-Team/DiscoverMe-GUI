/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class', '[class*="app-dark"]'], // Custom dark mode configuration
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'], // File paths
    plugins: [require('tailwindcss-primeui')], // PrimeUI plugin
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
                    light: '#a3d8f4',
                    DEFAULT: '#9C27B0', // Default primary color (Blue)
                    dark: '#8369a1',
                },
                secondary: {
                    light: '#fbcfe8',
                    DEFAULT: '#ec4899', // Default secondary color (Pink)
                    dark: '#db2777',
                },
                neutral: {
                    light: '#e5e7eb',
                    DEFAULT: '#6b7280', // Default neutral color (Gray)
                    dark: '#374151',
                },
                danger: '#dc2626', // Custom color for danger actions
                success: '#16a34a', // Custom color for success actions
                warning: '#facc15', // Custom color for warnings
            },
        },
    },
};
