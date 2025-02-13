import homeIcon from '../assets/icon-home.png';
import booksIcon from '../assets/icon-books.png';
import magnifyIcon from '../assets/icon-magnify.png';
import pencilIcon from '../assets/icon-pencil.png';
import createIcon from '../assets/icon-create.png';
import logoutIcon from '../assets/icon-logout.svg';
import accountCircle from '../assets/account-circle.svg';
import arrowBack from '../assets/arrow-back.svg';
import wordIcon from '../assets/icon-word.png';
import { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import WordButton from './WordButton';
import ConfirmModal from './common/ConfirmModal';
import { getLearningWords } from '../api/word';
import WordModal from './WordModal';

// stage: waiting, learning, picking, drawing, endDrawing, quiz
function Navigation({ stage, leaveSession, stageTime = 1, sessionTime, bookTitle, onTimeOut }) {
    const SECOND = 1000; //초
    const MINUTE = 60 * SECOND; //분
    const targetTime = Date.now() + stageTime * MINUTE;
    const [remainTime, setRemainTime] = useState(50); //현재 단계의 남은 시간
    const [remainTimePercent, setRemainTimePercent] = useState(100); //현재 단계의 남은 시간 퍼센트
    const [logoutModal, setLogoutModal] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    let timeoutNotEvented = true;

    const handleBackClick = () => {
        if (stage === 'waiting') {
            leaveSession(); // 세션에서 나가기
            navigate('/home'); // 메인 페이지로 이동 (필요에 따라 경로 수정 가능)
        }
    };

    //사용자 정보
    const [user, setUser] = useState({
        userName: '김싸피',
        userIcon:
            'https://i.namu.wiki/i/KUM2tQX1XioB6nLXb1hNgb47SQkzckA4LAbfCUWej7_opVso4ebnkijBdglFek7Dn2FzcKoGgOjOlm_UeIAYdQ3_i-CmhnnYc-PiI3erJmqqWI03S5ci3WZBbaqENJ90FcL3FtIjpnxFB8kNEynbag.webp',
        role: 'manager',
    });

    //페이지 이동 핸들러
    const navigationHandler = path => {
        navigate(`/${path}`);
    };

    //로그아웃 핸들러
    const logoutHandler = useCallback(() => {
        setLogoutModal(false);
        localStorage.removeItem('accessToken');

        navigate('/login', { state: { fromLogout: true } });
    }, [dispatch, navigate]);

    const logoutConfirmHandler = () => {
        setLogoutModal(true);
    };

    const cancelModal = () => {
        setLogoutModal(false);
    };

    //시간 더하기
    const addTime = (timestamp, addHour = 0) => {
        const time = new Date(timestamp);
        return time.setHours(time.getHours() + addHour);
    };

    //hh:mm 형식 반환
    const getTimeFormatted = timestamp => {
        const now = new Date(timestamp);
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    //단어 불러오기
    const [words, setWords] = useState([]);

    const [selectedWord, setSelectedWord] = useState(null);

    useEffect(() => {
        getLearningWords(1).then(response => {
            setWords(response.data.words);
        });
    }, []);

    // 남은 시간 형식 변환
    const getRemainingTimeFormatted = () => {
        if (remainTime <= 0) return '00:00'; // 시간이 지났다면 "00:00" 반환

        const minutes = Math.floor(remainTime / MINUTE);
        const seconds = Math.floor((remainTime % MINUTE) / SECOND);

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleWordClick = wordData => {
        setSelectedWord(wordData); // 단어를 클릭하면 해당 단어 정보를 설정
    };

    const handleCloseModal = () => {
        setSelectedWord(null); // 모달 닫을 때 selectedWord를 null로 설정
    };

    useEffect(() => {
        if (stage) {
            // 타이머 초기화
            const updateRemainTime = () => {
                let remaining = targetTime - Date.now();
                if (remaining <= 0) {
                    remaining = 0;
                    if (timeoutNotEvented) {
                        onTimeOut();
                        timeoutNotEvented = false;
                    }
                }
                let percent = (remaining / (stageTime * MINUTE)) * 100;

                setRemainTime(remaining);
                setRemainTimePercent(percent);
            };

            // 1초마다 갱신
            const interval = setInterval(updateRemainTime, SECOND);

            // 컴포넌트 언마운트 시 타이머 클리어
            return () => clearInterval(interval);
        }
    }, []);

    return (
        <>
            <ConfirmModal
                modalState={logoutModal}
                text="로그아웃 하시겠습니까?"
                cancelHandler={cancelModal}
                confirmHandler={logoutHandler}
            />
            <header className="shadow-lg rounded-b-3xl bg-white w-full">
                {stage ? (
                    <div className="flex flew-row justify-between py-4 px-10 items-center">
                        {stage === 'waiting' ? (
                            <>
                                <button onClick={handleBackClick}>
                                    <img src={`${arrowBack}`} alt="back" width="50"></img>
                                </button>
                                <div className="flex flex-col text-center gap-4">
                                    <span className="text-2xl font-bold">{bookTitle}</span>
                                    <span>
                                        오늘의 일정 : {getTimeFormatted(sessionTime)} ~{' '}
                                        {getTimeFormatted(addTime(sessionTime, 1))}
                                    </span>
                                </div>
                                <div className="flex flex-col text-center gap-4">
                                    <span>남은 시간 {getRemainingTimeFormatted()}</span>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 rotate-180">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${remainTimePercent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </>
                        ) : stage === 'learning' ? (
                            <>
                                <div></div>
                                <div className="flex flex-col text-center gap-4">
                                    <span className="text-2xl font-bold">오늘의 단어 학습</span>
                                </div>
                                <div className="flex flex-col text-center gap-4">
                                    <span>남은 시간 {getRemainingTimeFormatted()}</span>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 rotate-180">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${remainTimePercent}%` }}
                                        ></div>
                                    </div>
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
                                        {words.map(wordData => (
                                            <WordButton
                                                key={wordData.wordId}
                                                color="bg-dark-yellow"
                                                size="large"
                                                onClick={() => handleWordClick(wordData)}
                                            >
                                                {wordData.word}
                                            </WordButton>
                                        ))}
                                        {selectedWord && <WordModal word={selectedWord} onClose={handleCloseModal} />}
                                    </div>
                                </div>
                                <div></div>
                                <div className="flex flex-col text-center gap-4">
                                    <span>남은 시간 {getRemainingTimeFormatted()}</span>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 rotate-180">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${remainTimePercent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </>
                        ) : stage === 'endDrawing' ? (
                            <>
                                <div className="flex flex-col text-center gap-4">
                                    <span className="text-2xl font-bold">오늘의 그림</span>
                                </div>
                                <div></div>
                                <div className="flex flex-col text-center gap-4">
                                    <span>남은 시간 {getRemainingTimeFormatted()}</span>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 rotate-180">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${remainTimePercent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </>
                        ) : stage === 'quiz' ? (
                            <>
                                <div></div>
                                <div className="flex flex-col text-center gap-4">
                                    <span className="text-2xl font-bold">오늘의 단어 학습</span>
                                </div>
                                <div className="flex flex-col text-center gap-4">
                                    <span>남은 시간 {getRemainingTimeFormatted()}</span>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 rotate-180">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${remainTimePercent}%` }}
                                        ></div>
                                    </div>
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
                                onClick={() => navigationHandler('home')}
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
                            {user.role === 'manager' ? (
                                <>
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
                                </>
                            ) : (
                                <>
                                    <button
                                        className="flex flex-col text-center gap-3 items-center"
                                        onClick={() => navigationHandler('word')}
                                    >
                                        <img src={`${wordIcon}`} alt="words" width="50"></img>
                                        <span>단어장</span>
                                    </button>
                                </>
                            )}
                            <button
                                className="flex flex-col text-centerv gap-3 items-center"
                                onClick={() => navigationHandler('user')}
                            >
                                <img src={`${pencilIcon}`} alt="user" width="50"></img>
                                <span>회원정보 수정</span>
                            </button>
                        </div>
                        <button
                            className="flex flex-col text-centerv gap-3 items-center"
                            onClick={logoutConfirmHandler}
                        >
                            <img src={`${logoutIcon}`} alt="logout" width="50"></img>
                            <span>로그아웃</span>
                        </button>
                    </div>
                )}
            </header>
        </>
    );
}

export default Navigation;
