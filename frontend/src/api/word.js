import { authInstance } from './axios';

const WORD_API_URL = '/words';
const PARTY_API_URL = '/parties';

export const removeMyWord = async wordId => {
    try {
        const res = await authInstance.delete(`${WORD_API_URL}/saved-words`, {
            data: {
                wordId,
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
        const res = await authInstance.get(`${WORD_API_URL}/saved-words`, {
            params: {
                page: page,
                keyword: keyword,
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
        const res = await authInstance.get(`${WORD_API_URL}/${partyId}`, {});
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getQuizs = async partyId => {
    try {
        const res = await authInstance.get(`${PARTY_API_URL}/${partyId}/quiz`, {});
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const addToMyWords = async wordIds => {
    try {
        const res = await authInstance.post(`${WORD_API_URL}/saved-words`, { wordIds }, {});
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
