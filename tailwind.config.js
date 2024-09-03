/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            'sans': ['ui-sans-serif', 'system-ui'],
            'serif': ['ui-serif', 'Georgia'],
            'mono': ['ui-monospace', 'SFMono-Regular'],
            'display': ['Oswald'],
            'body': ['"Open Sans"'],
            'inter': ['"Inter"', 'sans-serif'],
            'nunito-sans': ['"Nunito Sans"', 'sans-serif'],
        },
        extend: {},
    },
    plugins: [
        require('daisyui'),
    ],
}

