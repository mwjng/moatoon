import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router';
// import DrawPage from './pages/drawPage';

import BookGeneratorPage from './pages/BookGeneratorPage';
import LoginPage from './pages/member/LoginPage';

import './index.css';
import WaitingRoom from './pages/WaitingRoom';
import ChildMainPage from './pages/ChildMainPage';
import LibraryPage from './pages/LibraryPage';
import ManagerMainPage from './pages/ManagerMainPage';
import WordLearning from './pages/WordLearning';
import RegistPage from './pages/member/RegistPage';
import ManagerRegistPage from './pages/member/ManagerRegistPage';
import ChildRegistPage from './pages/member/ChildRegistPage';
import FindInfo from './pages/member/FindInfo';
import FindIdPage from './pages/member/FindIdPage';
import FindPWPage from './pages/member/FindPWPage';
import MyWordPage from './pages/MywordPage';
import QuizPage from './pages/QuizPage';
import { Provider } from 'react-redux';
import store from './store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route index element={<App />} />
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
                    <Route index />
                </Route>
                <Route path="waiting" element={<WaitingRoom />}></Route>
                <Route path="main">
                    <Route path="child" element={<ChildMainPage />} />
                    <Route path="manager" element={<ManagerMainPage />} />
                </Route>
            </Routes>
        </BrowserRouter>,
    </Provider>,
);
