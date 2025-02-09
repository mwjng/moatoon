import React, { useState } from 'react';
import Background from '../../components/member/Backround';
import AuthModal from '../../components/member/AuthModal';
import Input from '../../components/member/Input';
import { login } from '../../api/member';
import { Link } from 'react-router';
import Btn from '../../components/member/Btn';
import { useNavigate } from 'react-router';

export default function LoginPage() {
    const navigate = useNavigate();

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

    const loginHandler = async () => {
        try {
            await login(loginState, navigate);
        } catch (error) {
            console.error('로그인 중 에러 발생:', error);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <Background />
            <AuthModal title="로그인">
                <Input inputs={inputs} width="300px" changeFunction={changeValue} />
                <Btn onClickHandler={loginHandler} bgColor="#FFBD73" bgHoverColor="#FFB25B" text="로그인" />
                <hr className="w-full border-[1px] border-white shadow-md" />
                <div className="flex gap-3 w-full">
                    <Link to="/regist" className=" w-full">
                        <Btn bgColor="#FEEE91" bgHoverColor="#FFEB74" text="회원가입" />
                    </Link>
                    <Link to="/find" className=" w-full">
                        <Btn bgColor="#FEEE91" bgHoverColor="#FFEB74" text="ID/PW 찾기" />
                    </Link>
                </div>
            </AuthModal>
        </div>
    );
}
