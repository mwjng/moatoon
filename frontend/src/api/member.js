import axios from 'axios';
import { setUserInfo } from '../store/userSlice';
import store from '../store/store';

const AUTH_API_URL = 'http://localhost:8080/auth';
const MEMBERS_API_URL = 'http://localhost:8080/members';

export const login = async (loginInfo, navigate) => {
    try {
        const res = await axios.post(AUTH_API_URL + '/login', loginInfo);
        const token = res.data.accessToken;

        if (token) {
            localStorage.setItem('accessToken', token);

            const userInfo = await getUserInfo(token);
            store.dispatch(setUserInfo(userInfo));

            if (userInfo.role == 'MANAGER') {
                navigate('/main/manager');
            } else {
                navigate('/main/child');
            }
        }

        return null;
    } catch (err) {
        console.error('로그인 실패:', err);
        throw err;
    }
};

export const getUserInfo = async token => {
    try {
        const res = await axios.get(MEMBERS_API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        console.error('사용자 정보 가져오기 실패:', err);
        throw err;
    }
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
