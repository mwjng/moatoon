import { authInstance } from './axios';

const APPLICATION_SERVER_URL = '/books';

export const getEBookCover = async (partyId) => {
    try {
        const response = await authInstance.get(`${APPLICATION_SERVER_URL}/ebook/${partyId}`);
        return response.data;
    } catch (error) {
        console.error('토큰 발급 에러', error);
        throw error;
    }
};
