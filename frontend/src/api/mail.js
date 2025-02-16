import { authInstance } from './axios';

const MAIL_API_URL = '/mail';

export const sendReportMail = async (words) => {
    try {
        console.log("알림장 전송");
        console.log(words);
        const res = await authInstance.post(`${MAIL_API_URL}/notice`, {
            words: words  
        });
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};