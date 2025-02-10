import axios from 'axios';

// 인증이 필요한 요청을 위한 axios 인스턴스 생성
const authInstance = axios.create();

// 요청 인터셉터 추가
authInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

// 인증이 필요없는 요청을 위한 axios 인스턴스 생성 
const publicInstance = axios.create();

export { authInstance, publicInstance };