import React, { useState } from 'react';
import Background from '../../components/member/Backround';
import AuthModal from '../../components/member/AuthModal';
import Input from '../../components/member/Input';
import { login } from '../../api/member';
import { Link } from 'react-router';
import Btn from '../../components/member/Btn';
import { useNavigate } from 'react-router';
import AlertModal from '../../components/common/AlertModal';
import { useSelector } from 'react-redux';

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

    const [modalText, setModalText] = useState('');
    const [modalState, setModalState] = useState(false);

    const changeValue = (key, value) => {
        setLoginState(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const loginHandler = async () => {
        if (!loginState.loginId || !loginState.password) {
            setModalText('입력값을 확인해주세요.');
            setModalState(true);
            return;
        }
        try {
            const res = await login(loginState, navigate);
        } catch (error) {
            if (error.response.data.code == 4018) {
                setModalText('보호자 계정에서 등록 후 로그인 해주세요');
                setModalState(true);
            } else if (error.response.data.code == 4012) {
                setModalText('유효하지 않은 회원정보입니다.');
                setModalState(true);
            } else {
                setModalText('아이디 또는 비밀번호가 일치하지 않습니다.');
                setModalState(true);
            }
            console.error('로그인 중 에러 발생:', error);
        }
    };

    const closeModal = () => {
        setModalState(false);
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

            <AlertModal text={modalText} modalState={modalState} closeHandler={closeModal} />
        </div>
    );
}
