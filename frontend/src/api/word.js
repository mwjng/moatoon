import axios from 'axios';

const WORD_API_URL = '/words';

export const getLearningWords = async partyId => {
    try {
        const res = await axios.get(`${WORD_API_URL}/${partyId}`);
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
