import React from 'react';
import Background from '../../components/member/Backround';
import AuthModal from '../../components/member/AuthModal';
import Btn from '../../components/member/Btn';

export default function MenagerRegistPage() {
    return (
        <div style={{ position: 'relative' }}>
            <Background />
            <AuthModal title="보호자 회원가입">
                <Btn bgColor="#FFBD73" bgHoverColor="#FFB25B" text="가입하기" />
            </AuthModal>
        </div>
    );
}
