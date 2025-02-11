import axios from 'axios';

const WORD_API_URL = '/words';
const PARTY_API_URL = '/parties';

export const removeMyWord = async wordId => {
    try {
        const res = await axios.delete(`${WORD_API_URL}/saved-words`, {
            data: {
                wordId,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getMyWords = async (page, keyword) => {
    try {
        const res = await axios.get(`${WORD_API_URL}/saved-words`, {
            params: {
                page: page,
                keyword: keyword,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getLearningWords = async partyId => {
    try {
        const res = await axios.get(`${WORD_API_URL}/${partyId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getQuizs = async partyId => {
    try {
        const res = await axios.get(`${PARTY_API_URL}/${partyId}/quiz`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const addToMyWords = async wordIds => {
    try {
        const res = await axios.post(
            `${WORD_API_URL}/saved-words`,
            { wordIds },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            },
        );
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
