import React from 'react';
import BackgroundRendingBook from '../../components/member/BackgroundRendingBook';

function Background() {
    return (
        <div className="opacity-40 ">
            <div className="flex justify-center items-center w-full h-screen bg-[#FEFBEB]">
                <h2 style={{ fontSize: '180px', fontFamily: 'Ownglyph_StudyHard-Rg', color: 'black', zIndex: 333 }}>
                    모아책방
                </h2>
            </div>
            <div style={{ position: 'fixed', zIndex: 1, width: '100%', top: '-25%', left: '-25%' }}>
                <BackgroundRendingBook />
            </div>
            <div style={{ position: 'fixed', zIndex: 1, width: '100%', bottom: '-25%', right: '-25%' }}>
                <BackgroundRendingBook />
            </div>
        </div>
    );
}

export default Background;
