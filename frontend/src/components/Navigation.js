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
import { logout } from '../api/member';
import bbi from '../assets/bbi.png';
import duck from '../assets/duckduck.png';
import AudioPlayer from './audio/AudioPlayer';

// stage: waiting, learning, picking, drawing, endDrawing, quiz
function Navigation({
    stage,
    leaveSession,
    stageDuration = 60,
    sessionStartTime,
    serverTime,
    bookTitle,
    onTimeOut,
    onTenSecondLeft,  // 새로 추가된 prop
    onTimeNotification
}) {
    // console.log('Navigation 렌더링:', {
    //     stage,
    //     stageDuration,
    //     sessionStartTime,
    //     serverTime,
    //     currentTime: Date.now()
    // });

    const userInfo = useSelector(state => state.user.userInfo);

    const SECOND = 1000; //초
    const MINUTE = 60 * SECOND; //분

    const [timeOffset, setTimeOffset] = useState(0); // 시간 오차 - serverTime과 현재시간의 차이
    const [remainTime, setRemainTime] = useState(50); //현재 단계의 남은 시간
    const [remainTimePercent, setRemainTimePercent] = useState(100); //현재 단계의 남은 시간 퍼센트

    const [logoutModal, setLogoutModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(userInfo.imageUrl);
    const cutsState = useSelector(state => state.cuts);

    // tts 관련 10분, 5분, 1분전 체크
    const [timeThresholds, setTimeThresholds] = useState({
        tenMinutes: false,
        fiveMinutes: false,
        oneMinute: false,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setPreviewUrl(userInfo.imageUrl); // userInfo가 변경될 때 previewUrl 업데이트
    }, [userInfo.imageUrl]);

    // 서버와 클라이언트의 시간 차이 계산
    useEffect(() => {
        if (serverTime) {
            const serverTimestamp = new Date(serverTime).getTime();
            const offset = serverTimestamp - Date.now();
            setTimeOffset(offset);
        }
    }, [serverTime]);

    // 현재 서버 시간 추정
    const getServerNow = () => {
        return Date.now() + timeOffset;
    };

    const handleBackClick = () => {
        if (stage === 'waiting') {
            leaveSession(); // 세션에서 나가기
            navigate('/home'); // 메인 페이지로 이동 (필요에 따라 경로 수정 가능)
        }
    };

    //페이지 이동 핸들러
    const navigationHandler = path => {
        navigate(`/${path}`);
    };

    //로그아웃 핸들러
    const logoutHandler = async () => {
        setLogoutModal(false);
        try {
            const res = await logout();
            if (res.status == 200) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('guideEnabled'); // 로그아웃 시 tts 설정 초기화
                navigate('/login', { state: { fromLogout: true } });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const logoutConfirmHandler = () => {
        setLogoutModal(true);
    };

    const cancelModal = () => {
        setLogoutModal(false);
    };

    // 시간 더하기 함수 (분 단위로 처리)
    const addMinutes = (timestamp, minutes = 0) => {
        const time = new Date(timestamp);
        return new Date(time.getTime() + minutes * 60000);
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
        if (cutsState.cuts.length > 0) {
            getLearningWords(cutsState.cuts[0].partyId).then(response => {
                setWords(response.data.words);
            });
        }
    }, [cutsState.cuts.length]);

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
        if (stage && sessionStartTime) {
            let timeoutNotEvented = true;
            let tenSecondNotified = false;  // 새로 추가

            // 타이머 초기화
            const updateRemainTime = () => {
                const sessionStartTimestamp = new Date(sessionStartTime).getTime();
                const elapsedTime = getServerNow() - sessionStartTimestamp; // 서버 시간 기준으로 경과 시간 계산
                const totalDuration = (stageDuration / 60) * MINUTE; // 현재 스테이지에 주어진 전체 시간
                let remaining = totalDuration - elapsedTime; // 남은 시간 계산

                // 새로 추가된 1분 알림 로직
                if (stage === 'waiting' && remaining <= 10* SECOND && remaining > 10*SECOND - 1000 && !tenSecondNotified) {
                    onTenSecondLeft && onTenSecondLeft();
                    tenSecondNotified = true;
                }

                if (remaining <= 0) {
                    remaining = 0;
                    if (timeoutNotEvented) {
                        onTimeOut && onTimeOut();
                        timeoutNotEvented = false;
                    }
                }
                let percent = (remaining / (stageDuration * MINUTE)) * 100;

                setRemainTime(remaining);
                setRemainTimePercent(percent);

                // tts 설정
                if (stage === 'drawing') {
                    const remainingMinutes = remaining / MINUTE;

                    if (remainingMinutes <= 10 && remainingMinutes > 9.9 && !timeThresholds.tenMinutes) {
                        setTimeThresholds(prev => ({ ...prev, tenMinutes: true }));
                        onTimeNotification && onTimeNotification('TEN_LEFT');
                    }

                    if (remainingMinutes <= 5 && remainingMinutes > 4.9 && !timeThresholds.fiveMinutes) {
                        setTimeThresholds(prev => ({ ...prev, fiveMinutes: true }));
                        onTimeNotification && onTimeNotification('FIVE_LEFT');
                    }

                    if (remainingMinutes <= 1 && remainingMinutes > 0.9 && !timeThresholds.oneMinute) {
                        setTimeThresholds(prev => ({ ...prev, oneMinute: true }));
                        onTimeNotification && onTimeNotification('ONE_LEFT');
                    }
                }
            };

            // 1초마다 갱신
            const interval = setInterval(updateRemainTime, SECOND);

            // 컴포넌트 언마운트 시 타이머 클리어
            return () => clearInterval(interval);
        }
    }, [stage, sessionStartTime, stageDuration, onTimeOut, onTenSecondLeft, onTimeNotification]);

    return (
        <>
            <ConfirmModal
                modalState={logoutModal}
                text="로그아웃 하시겠습니까?"
                cancelHandler={cancelModal}
                confirmHandler={logoutHandler}
            />
            {stage === 'drawing' && (
                <>
                    {timeThresholds.tenMinutes && <AudioPlayer audioType="TEN_LEFT" />}
                    {timeThresholds.fiveMinutes && <AudioPlayer audioType="FIVE_LEFT" />}
                    {timeThresholds.oneMinute && <AudioPlayer audioType="ONE_LEFT" />}
                </>
            )}
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
                                    {/*이거 sessionStartTime이 대기방 시작시간이라 10분, 70분 더하는게 맞습니다!*/}
                                    <span>
                                        오늘의 일정 : {getTimeFormatted(addMinutes(sessionStartTime, 10))} ~{' '}
                                        {getTimeFormatted(addMinutes(sessionStartTime, 70))}
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
                    <div className="flex flex-row justify-between py-4 px-10 items-center ">
                        <div className="flex flex-row justify-around items-center gap-20">
                            <div className="w-14 h-14 bg-[#ddd5] rounded-full">
                                <img
                                    src={previewUrl || (userInfo.role === 'CHILD' ? bbi : duck)}
                                    alt="프로필 이미지"
                                    className="w-full h-full object-cover rounded-3xl"
                                />
                            </div>
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
                            {userInfo.role === 'MANAGER' ? (
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
