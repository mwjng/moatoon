import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

export const login = async loginInfo => {
    await axios
        .post(API_URL + '/login', { loginInfo })
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
};
