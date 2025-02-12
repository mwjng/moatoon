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

    const [alertModal, setAlertModal] = useState(false);
    const [checkModal, setCheckModal] = useState(false);

    const changeValue = (key, value) => {
        setLoginState(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const loginHandler = async () => {
        try {
            const res = await login(loginState, navigate);
        } catch (error) {
            if (error.status == 400) {
                setCheckModal(true);
            } else {
                setAlertModal(true);
            }
            console.error('로그인 중 에러 발생:', error);
        }
    };

    const closeAlertModal = () => {
        setAlertModal(false);
        setCheckModal(false);
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
            <AlertModal
                text="아이디 또는 비밀번호가 일치하지 않습니다."
                modalState={alertModal}
                closeHandler={closeAlertModal}
            />
            <AlertModal text="보호자 계정에서 등록해주세요" modalState={checkModal} closeHandler={closeAlertModal} />
        </div>
    );
}
