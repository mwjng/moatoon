import { authInstance } from './axios';

const APPLICATION_SERVER_URL = 'http://localhost:8080/schedules';

export const getSessionToken = async (scheduleId, token) => {
    try {
        const response = await authInstance.post(`${APPLICATION_SERVER_URL}/${scheduleId}/session/join`, {});
        return response.data;
    } catch (error) {
        console.error('토큰 발급 에러', error);
        throw error;
    }
};

export const closeSession = async (scheduleId, token) => {
    try {
        const response = await authInstance.delete(`${APPLICATION_SERVER_URL}/${scheduleId}/session/leave`, {});
        return response;
    } catch (error) {
        console.error('세션 종료 에러', error);
        throw error;
    }
};
