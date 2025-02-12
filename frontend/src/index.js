import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router';

import BookGeneratorPage from './pages/BookGeneratorPage';
import LoginPage from './pages/member/LoginPage';

import './index.css';
import { Provider } from 'react-redux';
import store from './store/store';
import CutAllPage from './pages/CutAllPage';
import DrawingPage from './pages/DrawingPage';

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
                    <Route path="overview" element={<CutAllPage />} />
                    <Route path="draw" element={<DrawingPage />} />
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
                <Route path="home" element={<MainPage />}></Route>
            </Routes>
        </BrowserRouter>
    </Provider>,
);
