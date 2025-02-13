import React, { useState } from 'react';
import AuthModal from './AuthModal';
import Btn from './Btn';
import { authInstance } from '../../api/axios';
import AlertModal from '../common/AlertModal';

export default function CheckPw(props) {
    const [password, setPassword] = useState('');
    const [modalState, setModalState] = useState(false);
    const [modalText, setModalText] = useState('');
    const closeModal = () => {
        setModalState(false);
        setModalText('');
    };
    const checkPwHandler = async () => {
        try {
            const res = await authInstance.post(`/auth/pw/check`, { password });
            if (res.status == 204) {
                props.changeState();
            }
        } catch (err) {
            console.error(err);
            if (err.response.data.code == 4003) {
                setModalText('잘못된 비밀번호입니다.');
                setModalState(true);
            }
        }
    };
    const changeVal = e => {
        setPassword(e.target.value);
    };
    return (
        <>
            {' '}
            <AuthModal title="비밀번호 확인">
                <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요."
                    className="rounded-3xl shadow-md p-1 pr-3 pl-3 outline-none border-[2px] bg-[white]"
                    onChange={changeVal}
                />
                <Btn bgColor="#FFBD73" bgHoverColor="#FFB25B" text="확인하기" onClickHandler={checkPwHandler} />
            </AuthModal>
            <AlertModal text={modalText} modalState={modalState} closeHandler={closeModal} />
        </>
    );
}
