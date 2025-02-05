module.exports = {
    content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
    theme: {
        extend: {
            animation: {
                scrollLeft: 'scrollLeft 50s linear infinite',
                scrollRight: 'scrollRight 50s linear infinite',
            },
            keyframes: {
                scrollLeft: {
                    from: { transform: 'translateX(0%)' },
                    to: { transform: 'translateX(-85.8%)' },
                },
                scrollRight: {
                    from: { transform: 'translateX(-85.8%)' },
                    to: { transform: 'translateX(0%)' },
                },
            },
            colors: {
                'custom-blue': '#CAE0F4', // 여기에 커스텀 색상을 추가
            },
        },
    },
    plugins: [require('daisyui')],
};
