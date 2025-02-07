import React from 'react';
import RendingBooks from '../components/member/RendingBooks';
import { Link } from 'react-router';

function RendingPage() {
    return (
        <>
            <div className="flex items-center w-full h-screen">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: 'auto',
                        textAlign: 'center',
                        gap: '30px',
                        alignItems: 'center',
                        position: 'relative',
                        top: '10px',
                    }}
                >
                    <h2 style={{ fontSize: '180px', fontFamily: 'Ownglyph_StudyHard-Rg', color: 'black' }}>모아책방</h2>
                    <Link to="/login">
                        <div
                            style={{
                                backgroundColor: '#FAE34C',
                                color: 'white',
                                borderRadius: '50px',
                                width: '244px',
                                height: '80px',
                                fontSize: '32px',
                                cursor: 'pointer',
                                padding: '20px',
                            }}
                        >
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
