import React from 'react';
import Navigation from '../components/Navigation';  // Navigation 컴포넌트의 실제 경로에 맞게 수정해주세요
import ScheduleSection from "../components/main/ScheduleSection";
import BookParticipationSection from "../components/main/BookParticipationSection";

function ChildMainPage() {
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