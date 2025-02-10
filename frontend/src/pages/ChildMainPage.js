import React, { useEffect } from 'react';
import Navigation from '../components/Navigation'; // Navigation 컴포넌트의 실제 경로에 맞게 수정해주세요
import ScheduleSection from '../components/main/ScheduleSection';
import BookParticipationSection from '../components/main/BookParticipationSection';
import { getEBookCover } from '../api/book';
import store from '../store/store';

function ChildMainPage() {
    const userInfo = useSelector(state => state.user.userInfo);
    useEffect(() => {
        const data = getEBookCover(userInfo.memberId, localStorage.getItem('accessToken'));
    });

    return (
        <div className="min-h-screen bg-light-cream flex flex-col">
            <Navigation />
            <div className="h-3/5">
                <ScheduleSection className="h-full" />
            </div>
            <div className="h-2/5">
                <BookParticipationSection className="h-full" />
            </div>
        </div>
    );
}

export default ChildMainPage;
