import React, { useState } from 'react';
import Info from '../../components/member/Info';
import Input from '../../components/member/Input';
import AuthModal from '../../components/member/AuthModal';
import Background from '../../components/member/Backround';
import Btn from '../../components/member/Btn';
import { findPw } from '../../api/member';
import AlertModal from '../../components/common/AlertModal';

export default function FindPWPage() {
    const inputs = [
        { type: 'text', id: 'name', value: '아이디', color: '#fff', require: true },
        { type: 'text', id: 'email', value: '이메일', color: '#fff', require: true },
    ];
    const [infoState, setInfoState] = useState({
        loginId: '',
        email: '',
    });
    const [modalState, setModalState] = useState(false);
    const [mailModalState, setMailModalState] = useState(false);
    const changeValue = (key, value) => {
        setInfoState(prev => ({
            ...prev,
            [key]: value,
        }));
    };
    const findPwHandler = async () => {
        const res = await findPw(infoState);

        if (!res || res.status !== 200) {
            setModalState(true);
        } else if (res.status == 200) {
            setMailModalState(true);
        }
    };
    const closeModalHandler = () => {
        setModalState(false);
    };
    const closeMailModalHandler = () => {
        setMailModalState(false);
    };

    return (
        <>
            <div style={{ position: 'relative' }}>
                <Background />
                <AuthModal title="비밀번호 찾기">
                    <Input inputs={inputs} width="300px" changeFunction={changeValue} />
                    <Btn onClickHandler={findPwHandler} bgColor="#FFBD73" bgHoverColor="#FFB25B" text="확인" />
                </AuthModal>
                <Info message="아동 회원은 보호자의 이메일을 입력하세요." />
            </div>
            <AlertModal
                text="해당 정보와 일치하는 회원이 없습니다."
                modalState={modalState}
                closeHandler={closeModalHandler}
            />
            <AlertModal
                text="임시 비밀번호가 발송되었습니다."
                modalState={mailModalState}
                closeHandler={closeMailModalHandler}
            />
        </>
    );
}
