import axios from 'axios';

const WORD_API_URL = '/words';
const PARTY_API_URL = '/parties';

export const getLearningWords = async partyId => {
    try {
        const res = await axios.get(`${WORD_API_URL}/${partyId}`);
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getQuizs = async partyId => {
    try {
        const res = await axios.get(`${PARTY_API_URL}/${partyId}/quiz`);
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
