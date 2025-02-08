import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router';
import DrawPage from './pages/drawPage';
import BookGeneratorPage from './pages/BookGeneratorPage';
import LoginPage from './pages/member/LoginPage';
import './index.css';
import WaitingRoom from './pages/WaitingRoom';
import ChildMainPage from './pages/ChildMainPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route index element={<App />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="/session">
                <Route path="draw" element={<DrawPage />} />
                <Route path="search" />
                <Route path="create" element={<BookGeneratorPage />} />
            </Route>
            <Route path="library">
                <Route index />
            </Route>
            <Route path="word">
                <Route index />
            </Route>
            <Route path="user">
                <Route index />
            </Route>
            <Route path="waiting" element={<WaitingRoom />}></Route>
            <Route path="main">
                <Route path="child" element={<ChildMainPage />} />
            </Route>
        </Routes>
    </BrowserRouter>,
);
