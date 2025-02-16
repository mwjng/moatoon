import React from 'react';
import Info from '../../components/member/Info';
import Background from '../../components/member/Backround';
import AuthModal from '../../components/member/AuthModal';
import Btn from '../../components/member/Btn';
import { Link } from 'react-router';

export default function FindInfo() {
    return (
        <div style={{ position: 'relative' }}>
            <Background />
            <AuthModal>
                <div className="w-[340px] flex flex-col gap-5">
                    <Link to="/find/id" className=" w-full">
                        <Btn bgColor="#FEEE91" bgHoverColor="#FFEB74" text="보호자 ID 찾기" />
                    </Link>
                    <Link to="/find/pw" className="w-full">
                        <Btn bgColor="#FEEE91" bgHoverColor="#FFEB74" text="PW 찾기" />
                    </Link>
                </div>
            </AuthModal>
            <Info message="아동 ID는 보호자의 회원 정보 수정 Tab에서 확인 가능합니다." />
        </div>
    );
}
