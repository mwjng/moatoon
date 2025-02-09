import React from 'react';
import Background from '../../components/member/Backround';
import AuthModal from '../../components/member/AuthModal';
import { Link } from 'react-router';
import Btn from '../../components/member/Btn';
import bbi_normal from '../../assets/bbi_normal.png';
import duck from '../../assets/duckduck.png';

export default function RegistPage() {
    return (
        <div style={{ position: 'relative' }}>
            <Background />
            <AuthModal title="나는 누구일까요?">
                <div className="flex flex-row items-end gap-10">
                    <Link to="/regist/child" className="p-3 w-full flex flex-col rounded-2xl hover:bg-[#B4B4B433]">
                        <img src={bbi_normal} className="w-40" />
                        <Btn bgColor="#FFBD73" bgHoverColor="#FFB25B" text="아동" />
                    </Link>
                    <Link to="/regist/menager" className="p-3  w-full flex flex-col rounded-2xl hover:bg-[#B4B4B433]">
                        <img src={duck} className="w-40" />
                        <Btn bgColor="#FFBD73" bgHoverColor="#FFB25B" text="보호자" />
                    </Link>
                </div>
            </AuthModal>
        </div>
    );
}
