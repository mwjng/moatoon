import homeIcon from '../assets/icon-home.png';
import booksIcon from '../assets/icon-books.png';
import magnifyIcon from '../assets/icon-magnify.png';
import pencilIcon from '../assets/icon-pencil.png';
import createIcon from '../assets/icon-create.png';
import logoutIcon from '../assets/icon-logout.svg';
import accountCircle from '../assets/account-circle.svg';
import arrowBack from '../assets/arrow-back.svg';
import wordIcon from '../assets/icon-word.png';
import { useState } from 'react';
import { NavLink } from 'react-router';

function Navigation({ stage }) {
    const [user, setUser] = useState({
        userName: '김싸피',
        userIcon:
            'https://i.namu.wiki/i/KUM2tQX1XioB6nLXb1hNgb47SQkzckA4LAbfCUWej7_opVso4ebnkijBdglFek7Dn2FzcKoGgOjOlm_UeIAYdQ3_i-CmhnnYc-PiI3erJmqqWI03S5ci3WZBbaqENJ90FcL3FtIjpnxFB8kNEynbag.webp',
        role: 'parent',
    });
    const [book, setBook] = useState({
        title: '사과와 생쥐',
    });
    stage = 'waiting'; //waiting, learning, picking, drawing, endDrawing, quiz

    const navigationHandler = path => {
        navigate(`/${path}`);
    };

    const logoutHandler = () => {
        console.log('logout');
    };

    return (
        <header>
            {stage ? (
                <div className="flex flew-row justify-between py-4 px-10 items-center">
                    {stage === 'waiting' ? (
                        <>
                            <NavLink to="/">
                                <img src={`${arrowBack}`} alt="back" width="50"></img>
                            </NavLink>
                            <div className="flex flex-col text-center gap-4">
                                <span className="text-2xl font-bold">{book.title}</span>
                                <span>오늘의 일정 : 9:00 ~ 10:00</span>
                            </div>
                            <div className="flex flex-col text-center gap-4">
                                <span>남은 시간 10:00</span>
                                <progress value={0.75}></progress>
                            </div>
                        </>
                    ) : stage === 'learning' ? (
                        <>
                            <div></div>
                            <div className="flex flex-col text-center gap-4">
                                <span className="text-2xl font-bold">오늘의 단어 학습</span>
                            </div>
                            <div className="flex flex-col text-center gap-4">
                                <span>남은 시간 10:00</span>
                                <progress value={0.75}></progress>
                            </div>
                        </>
                    ) : stage === 'picking' ? (
                        <>
                            <div></div>
                            <div className="flex flex-col text-center gap-4">
                                <span className="text-2xl font-bold">내가 그리게 될 컷은 몇번일까요?</span>
                            </div>
                            <div></div>
                        </>
                    ) : stage === 'drawing' ? (
                        <>
                            <div className="flex items-center gap-8">
                                <span className="text-2xl font-bold">오늘의 단어</span>
                                <div className="flex gap-8">
                                    <button className="px-8 py-4">단어1</button>
                                    <button className="px-8 py-4">단어2</button>
                                    <button className="px-8 py-4">단어3</button>
                                    <button className="px-8 py-4">단어4</button>
                                </div>
                            </div>
                            <div></div>
                            <div className="flex flex-col text-center gap-4">
                                <span>남은 시간 10:00</span>
                                <progress value={0.75}></progress>
                            </div>
                        </>
                    ) : stage === 'endDrawing' ? (
                        <>
                            <div className="flex flex-col text-center gap-4">
                                <span className="text-2xl font-bold">오늘의 그림</span>
                            </div>
                            <div></div>
                            <div></div>
                        </>
                    ) : stage === 'quiz' ? (
                        <>
                            <div></div>
                            <div className="flex flex-col text-center gap-4">
                                <span className="text-2xl font-bold">오늘의 단어 학습</span>
                            </div>
                            <div className="flex flex-col text-center gap-4">
                                <span>남은 시간 10:00</span>
                                <progress value={0.75}></progress>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <div className="flex flex-row justify-between py-4 px-10 items-center">
                    <div className="flex flex-row justify-around items-center gap-20">
                        <img
                            src={`${user.userIcon == '' ? accountCircle : user.userIcon}`}
                            alt="user-icon"
                            width="50"
                            height="50"
                            className="w-12 h-12 rounded-full object-cover border-2"
                        ></img>
                        <button
                            className="flex flex-col text-center gap-3 items-center"
                            onClick={() => navigationHandler('')}
                        >
                            <img src={`${homeIcon}`} alt="home" width="50"></img>
                            <span>홈</span>
                        </button>
                        <button
                            className="flex flex-col text-center gap-3 items-center"
                            onClick={() => navigationHandler('library')}
                        >
                            <img src={`${booksIcon}`} alt="library" width="50"></img>
                            <span>도서관</span>
                        </button>
                        <button
                            className="flex flex-col text-center gap-3 items-center"
                            onClick={() => navigationHandler('word')}
                        >
                            <img src={`${wordIcon}`} alt="words" width="50"></img>
                            <span>단어장</span>
                        </button>
                        <button
                            className="flex flex-col text-center gap-3 items-center"
                            onClick={() => navigationHandler('session/search')}
                        >
                            <img src={`${magnifyIcon}`} alt="search" width="50"></img>
                            <span>방 탐색</span>
                        </button>
                        <button
                            className="flex flex-col text-centerv gap-3 items-center"
                            onClick={() => navigationHandler('session/create')}
                        >
                            <img src={`${createIcon}`} alt="create" width="50"></img>
                            <span>방 생성</span>
                        </button>
                        <button
                            className="flex flex-col text-centerv gap-3 items-center"
                            onClick={() => navigationHandler('user')}
                        >
                            <img src={`${pencilIcon}`} alt="user" width="50"></img>
                            <span>회원정보 수정</span>
                        </button>
                    </div>
                    <button className="flex flex-col text-centerv gap-3 items-center" onClick={logoutHandler}>
                        <img src={`${logoutIcon}`} alt="logout" width="50"></img>
                        <span>로그아웃</span>
                    </button>
                </div>
            )}
        </header>
    );
}

export default Navigation;
