import { useDispatch, useSelector } from 'react-redux';
import RendingPage from './pages/RendingPage';
import { setUserInfo, clearUserInfo } from './store/userSlice';
import { getUserInfo } from './api/member';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router';

import BookGeneratorPage from './pages/BookGeneratorPage';
import LoginPage from './pages/member/LoginPage';

import WaitingRoom from './pages/session/WaitingRoom';
import MainPage from './pages/main/MainPage';
import LibraryPage from './pages/ChildLibraryPage';
import WordLearning from './pages/session/WordLearning';
import RegistPage from './pages/member/RegistPage';
import ManagerRegistPage from './pages/member/ManagerRegistPage';
import ChildRegistPage from './pages/member/ChildRegistPage';
import FindInfo from './pages/member/FindInfo';
import FindIdPage from './pages/member/FindIdPage';
import FindPWPage from './pages/member/FindPWPage';
import MyWordPage from './pages/MywordPage';
import QuizPage from './pages/session/QuizPage';
import ChangeUserInfoPage from './pages/member/ChangeUserInfoPage';

function App() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector(state => state.user.userInfo);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let token = localStorage.getItem('accessToken');

        const fetchUserInfo = async () => {
            if (!token) {
                setLoading(false);
                if (location.pathname !== '/login') {
                    navigate('/login');
                }
                return;
            }

            try {
                const fetchedUserInfo = await getUserInfo(token);
                dispatch(setUserInfo(fetchedUserInfo));
                setLoading(false);
            } catch (error) {
                console.error('accessToken 만료됨, refreshToken 확인 중...' + error);

                try {
                    const newAccessToken = await refreshAccessToken();

                    if (newAccessToken) {
                        localStorage.setItem('accessToken', newAccessToken);
                        const userInfo = await getUserInfo(newAccessToken);
                        dispatch(setUserInfo(userInfo));
                        setLoading(false);
                    } else {
                        throw new Error('refreshToken 만료됨');
                    }
                } catch (err) {
                    console.log('인증 실패, 로그아웃 처리');
                    localStorage.removeItem('accessToken');
                    dispatch(clearUserInfo());
                    setLoading(false); // 로딩 완료
                    navigate('/login');
                }
            }
        };

        fetchUserInfo();
    }, [dispatch, navigate]);

    useEffect(() => {
        if (loading) return;

        const path = location.pathname;

        if (userInfo && (path.startsWith('/login') || path.startsWith('/regist') || path.startsWith('/find'))) {
            navigate('/home');
        }

        if (!userInfo && !(path.startsWith('/login') || path.startsWith('/regist') || path.startsWith('/find'))) {
            navigate('/login');
        }
    }, [loading, userInfo, location, navigate]);

    return (
        <div className="App">
            {loading ? (
                <></>
            ) : (
                <Routes>
                    <Route index element={<RendingPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="regist">
                        <Route index element={<RegistPage />} />
                        <Route path="manager" element={<ManagerRegistPage />} />
                        <Route path="child" element={<ChildRegistPage />} />
                    </Route>
                    <Route path="find">
                        <Route index element={<FindInfo />} />
                        <Route path="id" element={<FindIdPage />} />
                        <Route path="pw" element={<FindPWPage />} />
                    </Route>
                    <Route path="/session">
                        <Route path="search" />
                        <Route path="create" element={<BookGeneratorPage />} />
                        <Route path="quiz" element={<QuizPage />} />
                        <Route path="learning" element={<WordLearning />} />
                    </Route>
                    <Route path="library" element={<LibraryPage />} />
                    <Route path="word">
                        <Route index element={<MyWordPage />} />
                    </Route>
                    <Route path="user">
                        <Route index element={<ChangeUserInfoPage />} />
                    </Route>
                    <Route path="waiting" element={<WaitingRoom />}></Route>
                    <Route path="home" element={<MainPage />}></Route>
                </Routes>
            )}
        </div>
    );
}

export default App;
