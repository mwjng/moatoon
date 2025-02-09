import React, { useState } from 'react';
import Info from '../../components/member/Info';
import Input from '../../components/member/Input';
import AuthModal from '../../components/member/AuthModal';
import Background from '../../components/member/Backround';
import Btn from '../../components/member/Btn';
import { findId } from '../../api/member';
import AlertModal from '../../components/common/AlertModal';

export default function FindIdPage() {
    const inputs = [
        { type: 'text', id: 'name', value: '이름', color: '#fff', require: true },
        { type: 'text', id: 'email', value: '이메일', color: '#fff', require: true },
    ];
    const [infoState, setInfoState] = useState({
        name: '',
        email: '',
    });
    const [modalState, setModalState] = useState(false);
    const changeValue = (key, value) => {
        setInfoState(prev => ({
            ...prev,
            [key]: value,
        }));
    };
    const findIdHandler = async () => {
        const res = await findId(infoState);

        if (!res || res.status !== 200) {
            setModalState(true);
        }
    };
    const closeModalHandler = () => {
        setModalState(false);
    };
    return (
        <>
            <div style={{ position: 'relative' }}>
                <Background />
                <AuthModal title="보호자 아이디 찾기">
                    <Input inputs={inputs} width="300px" changeFunction={changeValue} />
                    <Btn onClickHandler={findIdHandler} bgColor="#FFBD73" bgHoverColor="#FFB25B" text="확인" />
                </AuthModal>
                <Info message="아동 ID는 보호자의 회원 정보 수정 Tab에서 확인 가능합니다." />
            </div>
            <AlertModal
                text="해당 정보와 일치하는 회원이 없습니다."
                modalState={modalState}
                closeHandler={closeModalHandler}
            />
        </>
    );
}
