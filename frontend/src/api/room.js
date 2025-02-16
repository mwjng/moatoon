import { authInstance } from './axios';

export const getSessionToken = async (scheduleId, token) => {
    try {
        const response = await authInstance.post(`/schedules/${scheduleId}/session/join`, {});
        return response.data;
    } catch (error) {
        console.error('토큰 발급 에러', error);
        throw error;
    }
};

export const closeSession = async (scheduleId, token) => {
    try {
        const response = await authInstance.delete(`/schedules/${scheduleId}/session/leave`, {});
        return response;
    } catch (error) {
        console.error('세션 종료 에러', error);
        throw error;
    }
};

export const getEnterSession = async pinNumber => {
    try {
        const response = await authInstance.get(`/session/pinNumber/${pinNumber}`); // ✅ 올바른 URL 확인
        return response.data;
    } catch (error) {
        console.error('세션 정보 가져오기 실패:', error);
        throw error;
    }
};
