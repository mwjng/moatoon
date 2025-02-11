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
                orange1: '#FE9134',
                orange2: '#FC852B', // 좀 더 진한 오렌지
                'light-cream': '#FDFFE9', // 아동 메인 배경색
                seashell: '#F8EDEB', // 단어 학습 페이지 배경
                'butter-cream': '#FFF8CF',
                'lime-cream': '#F3F8C0',
                gray1: '#444444',
                blue1: '#D9F0FE',
                'light-blue1': '#EDF7FF',
                'dark-yellow': '#FAE34C',
                'light-cream-yellow': '#FEFBEB',
                'light-orange': '#F5BD40',
                'light-yellow': '#FBEF9D',
                'burnt-sienna': '#F07167',
            },
        },
    },
    plugins: [require('daisyui')],
};
