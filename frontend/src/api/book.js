import axios from 'axios';

const APPLICATION_SERVER_URL = '/books';

export const getEBookCover = async (partyId, token) => {
    try {
        const response = await axios.get(`${APPLICATION_SERVER_URL}/ebook/${partyId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('토큰 발급 에러', error);
        throw error;
    }
};
