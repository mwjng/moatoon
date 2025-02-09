import axios from 'axios';

const AUTH_API_URL = 'http://localhost:8080/auth';
const MEMBERS_API_URL = 'http://localhost:8080/members';

export const login = async loginInfo => {
    await axios
        .post(AUTH_API_URL + '/login', loginInfo)
        .then(res => {
            const token = res.data.accessToken;
            if (token) {
                localStorage.setItem('accessToken', token);
            }
        })
        .catch(err => console.error(err));
};

export const findId = async userInfo => {
    try {
        const res = await axios.post(MEMBERS_API_URL + '/managers/id', userInfo);
        return res;
    } catch (err) {
        console.error(err);
        return err.response;
    }
};
export const findPw = async userInfo => {
    try {
        const res = await axios.post(MEMBERS_API_URL + '/password', userInfo);
        return res;
    } catch (err) {
        console.error(err);
        return err.response;
    }
};
