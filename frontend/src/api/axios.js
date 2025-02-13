import axios from 'axios';
import { refreshAccessToken } from './member';
import store from '../store/store';

// 인증이 필요한 요청을 위한 axios 인스턴스 생성
const authInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    withCredentials: true,
});

// 요청 인터셉터 추가
authInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 응답 인터셉터: AccessToken 자동 갱신
authInstance.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            // AccessToken이 만료되었을 경우
            try {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    localStorage.setItem('accessToken', newAccessToken);
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return authInstance(error.config); // 기존 요청 재시도
                }
            } catch (refreshError) {
                console.error('토큰 갱신 실패:', refreshError);
                localStorage.removeItem('accessToken');
                store.dispatch(clearUserInfo());
            }
        }
        return Promise.reject(error);
    },
);

// 인증이 필요없는 요청을 위한 axios 인스턴스 생성
const publicInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    withCredentials: true,
});

export { authInstance, publicInstance };
