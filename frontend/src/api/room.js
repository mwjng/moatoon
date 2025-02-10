import axios from 'axios';

const APPLICATION_SERVER_URL = 'http://localhost:8080/schedule';

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
