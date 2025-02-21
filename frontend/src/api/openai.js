import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/images/generations';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY; // 환경 변수에서 API 키 로드

export const generateImage = async prompt => {
    try {
        const response = await axios.post(
            API_URL,
            {
                prompt: prompt,
                n: 1, // 생성할 이미지 개수
                size: '512x512', // 이미지 크기
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        return response.data.data[0].url; // 생성된 이미지 URL 반환
    } catch (error) {
        console.error('이미지 생성 오류:', error);
        return null;
    }
};
