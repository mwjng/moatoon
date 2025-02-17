import React from 'react';
import RendingBooks from '../components/member/RendingBooks';
import { Link } from 'react-router';

function RendingPage() {
    return (
        <>
            <div className="flex items-center w-full h-screen" style={{ backgroundColor: '#FEFBEB' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: 'auto',
                        textAlign: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        top: '10px',
                    }}
                >
                    <h2
                        style={{
                            fontSize: '180px',
                            fontFamily: 'Ownglyph_StudyHard-Rg',
                            fontWeight: 'normal',
                            color: 'black',
                            zIndex: 777,
                        }}
                    >
                        모아책방
                    </h2>
                    <Link to="/login" style={{ zIndex: 777 }}>
                        <div className="bg-[#FAE34C] text-white rounded-full w-[244px] h-[80px] text-[32px] cursor-pointer flex items-center justify-center z-888">
                            시작하기
                        </div>
                    </Link>
                </div>
            </div>
            <div style={{ position: 'fixed', zIndex: 1, width: '100%', top: '-25%', left: '-25%' }}>
                <RendingBooks />
            </div>
            <div style={{ position: 'fixed', zIndex: 1, width: '100%', bottom: '-25%', right: '-25%' }}>
                <RendingBooks />
            </div>
        </>
    );
}

export default RendingPage;
