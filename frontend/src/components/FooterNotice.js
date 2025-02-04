import React from 'react';
import bbi from '../assets/bbi.png';

function FooterNotice() {
    return (
        <div
            className="flex flex-row shadow-md rounded-full p-4 items-center justify-center w-[500px] h-[80px]"
            style={{ backgroundColor: '#FDFCDC' }}
        >
            <div className="flex flex-col items-center justify-center gap-3">
                <div className="text-black font-medium">잠시 후에 세션이 시작됩니다!</div>
                <div className="text-black font-medium">마이크와 카메라를 켜고 준비해주세요!</div>
            </div>
            <img src={`${bbi}`} className="w-[80px] h-[80px]" />
        </div>
    );
}

export default FooterNotice;
