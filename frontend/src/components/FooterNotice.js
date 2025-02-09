import React from 'react';
<<<<<<< Updated upstream
import bbi from '../assets/bbi.png';
=======
>>>>>>> Stashed changes

function FooterNotice() {
    return (
        <div
<<<<<<< Updated upstream
            className="flex flex-row shadow-md rounded-full p-4 items-center justify-center w-[500px] h-[80px]"
            style={{ backgroundColor: '#FDFCDC' }}
        >
            <div className="flex flex-col items-center justify-center gap-3">
                <div className="text-black font-medium">잠시 후에 세션이 시작됩니다!</div>
                <div className="text-black font-medium">마이크와 카메라를 켜고 준비해주세요!</div>
            </div>
            <img src={`${bbi}`} className="w-[80px] h-[80px]" />
=======
            className="shadow-md rounded-full p-4 flex items-center justify-center space-x-2"
            style={{ backgroundColor: '#FDFCDC' }}
        >
            <span className="text-black font-medium">잠시 후에 세션이 시작됩니다!</span>
            <span className="text-black font-medium">마이크와 카메라를 켜고 준비해주세요!</span>
            <span role="img" aria-label="chick"></span>
>>>>>>> Stashed changes
        </div>
    );
}

export default FooterNotice;
