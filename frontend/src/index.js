import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router';
import DrawPage from './pages/drawPage';
import BookGeneratorPage from './pages/BookGeneratorPage
import Navigation from './components/navigation';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route index element={<App />} />
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
            <Route path="/nav" element={<Navigation />} />
        </Routes>
    </BrowserRouter>,
);
