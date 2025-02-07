import React, { useState } from 'react';
import Background from '../../components/member/Backround';
import AuthModal from '../../components/member/AuthModal';
import Input from '../../components/member/Input';
import { login } from '../../api/member';

export default function LoginPage() {
    const inputs = [
        { id: 'loginId', value: '아이디', type: 'text', color: '#fff', require: true },
        { id: 'password', value: '비밀번호', type: 'password', color: '#fff', require: true },
    ];

    const [loginState, setLoginState] = useState({
        loginId: '',
        password: '',
    });

    const changeValue = (key, value) => {
        setLoginState(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const loginHandler = () => {
        login(loginState);
    };
    const registandler = () => {};
    const findInfoHandler = () => {};
    return (
        <div style={{ position: 'relative' }}>
            <Background />
            <AuthModal title="로그인">
                <Input inputs={inputs} width="300px" changeFunction={changeValue} />
                <button
                    onClick={loginHandler}
                    className="bg-[#FFBD73] rounded-3xl shadow-md p-1 pr-3 pl-3 outline-none w-full hover:bg-[#FFB25B]"
                >
                    로그인
                </button>
                <hr className="w-full border-[1px] border-white shadow-md" />
                <div className="flex gap-3 w-full">
                    <button
                        onClick={registandler}
                        className="bg-[#FEEE91] rounded-3xl shadow-md p-1 pr-3 pl-3 outline-none w-full hover:bg-[#FFEB74]"
                    >
                        회원가입
                    </button>
                    <button
                        onClick={findInfoHandler}
                        className="bg-[#FEEE91] rounded-3xl shadow-md p-1 pr-3 pl-3 outline-none w-full hover:bg-[#FFEB74]"
                    >
                        ID/PW 찾기
                    </button>
                </div>
            </AuthModal>
        </div>
    );
}
