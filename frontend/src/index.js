import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router';
import DrawPage from './pages/drawPage';
import LoginPage from './pages/member/LoginPage';
import './index.css';
import WaitingRoom from './pages/WaitingRoom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route index element={<App />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="/session">
                <Route path="draw" element={<DrawPage />} />
                <Route path="search" />
                <Route path="create" />
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
        </Routes>
    </BrowserRouter>,
);
