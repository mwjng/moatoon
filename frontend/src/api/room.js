import axios from 'axios';

const APPLICATION_SERVER_URL = 'http://localhost:8080/schedules';

export const getSessionToken = async (scheduleId, token) => {
    try {
        const response = await axios.post(
            `${APPLICATION_SERVER_URL}/${scheduleId}/session/join`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        );
        return response.data;
    } catch (error) {
        console.error('토큰 발급 에러', error);
        throw error;
    }
};

export const closeSession = async (scheduleId, token) => {
    try {
        const response = await axios.delete(
            `${APPLICATION_SERVER_URL}/${scheduleId}/session/leave`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        );
        return response;
    } catch (error) {
        console.error('세션 종료 에러', error);
        throw error;
    }
};
