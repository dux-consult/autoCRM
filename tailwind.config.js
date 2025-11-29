/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['LINE Seed Sans TH', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#0052FF',
                    foreground: '#FFFFFF',
                },
                background: '#F4F6F8',
                card: '#FFFFFF',
                border: '#E2E8F0',
            },
            borderRadius: {
                DEFAULT: '0.5rem',
                xl: '0.75rem',
                '2xl': '1rem',
            }
        },
    },
    plugins: [],
}
