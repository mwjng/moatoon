import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router';
import DrawPage from './pages/drawPage';
<<<<<<< HEAD
import BookGeneratorPage from './pages/BookGeneratorPage'
import LoginPage from './pages/member/LoginPage'
=======
import LoginPage from './pages/member/LoginPage';
>>>>>>> 0139b1c63fe8609b48feadecb279ff9ab72f1d26
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
                <Route path="create" element={<BookGeneratorPage />}/>
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
