module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/flowbite/**/*.js'],
    theme: {
        extend: {
            keyframes: {
                'small-ping': {
                    '75%, 100%': {
                        transform: 'scale(1.1)',
                        opacity: 0,
                    },
                },
            },
            animation: {
                'small-ping':
                    'small-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
            },
        },
    },
    plugins: [require('flowbite/plugin'), require('@tailwindcss/forms')],
};
