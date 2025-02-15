import { setUserInfo } from '../store/userSlice';
import store from '../store/store';
import { authInstance, publicInstance } from './axios';

const AUTH_API_URL = '/auth';
const MEMBERS_API_URL = '/members';

export const logout = async () => {
    try {
        const res = await authInstance.post(`${AUTH_API_URL}/logout`);
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const removeMember = async () => {
    try {
        const res = await authInstance.delete(MEMBERS_API_URL);
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const modify = async modifyInfo => {
    try {
        const res = await authInstance.patch(MEMBERS_API_URL, modifyInfo);
        store.dispatch(setUserInfo(res.data));
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const refreshAccessToken = async () => {
    try {
        const res = await publicInstance.post(AUTH_API_URL + '/refresh', {}, { withCredentials: true });
        return res.data.accessToken;
    } catch (err) {
        console.error('토큰 갱신 실패:', err);
        return null;
    }
};

export const searchChildById = async childId => {
    try {
        const res = await publicInstance.get(`${MEMBERS_API_URL}/search`, {
            params: {
                loginId: childId,
            },
        });
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const checkEmailCode = async (email, code) => {
    try {
        const res = await publicInstance.post(`${AUTH_API_URL}/email/code`, { email, code });
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const sendEmailCode = async email => {
    try {
        const res = await publicInstance.post(`${AUTH_API_URL}/email/check`, { email });
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const uploadImage = async file => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await publicInstance.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status != 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(response);
        const img = await response.data;
        return img;
    } catch (error) {
        console.error('이미지 업로드 실패', error);
        return null;
    }
};

export const regist = async (registInfo, navigate) => {
    try {
        const res = await publicInstance.post(MEMBERS_API_URL, registInfo);
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const loginIdCheck = async loginId => {
    try {
        const res = await publicInstance.get(`${AUTH_API_URL}/id/check/${loginId}`);
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const login = async (loginInfo, navigate) => {
    try {
        const res = await publicInstance.post(AUTH_API_URL + '/login', loginInfo);
        const token = res.data.accessToken;

        if (token) {
            localStorage.setItem('accessToken', token);

            const userInfo = await getUserInfo();
            if (userInfo.role == 'CHILD' && userInfo.managerId == null) {
                localStorage.setItem('accessToken', null);
                return null;
            }
            store.dispatch(setUserInfo(userInfo));

            navigate('/home');
        }

        return null;
    } catch (err) {
        console.error('로그인 실패:', err);
        throw err;
    }
};

export const getUserInfo = async () => {
    try {
        const res = await authInstance.get(MEMBERS_API_URL);
        return res.data;
    } catch (err) {
        console.error('사용자 정보 가져오기 실패:', err);
        throw err;
    }
};

export const findId = async userInfo => {
    try {
        const res = await publicInstance.post(MEMBERS_API_URL + '/managers/id', userInfo);
        return res;
    } catch (err) {
        console.error(err);
        return err.response;
    }
};
export const findPw = async userInfo => {
    try {
        const res = await publicInstance.post(MEMBERS_API_URL + '/password', userInfo);
        return res;
    } catch (err) {
        console.error(err);
        return err.response;
    }
};
