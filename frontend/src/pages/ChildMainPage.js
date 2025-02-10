import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import ScheduleSection from "../components/main/ScheduleSection";
import BookParticipationSection from "../components/main/BookParticipationSection";
import { getTodayAndUpComingSchedule } from '../api/schedule';

function ChildMainPage() {
   const [scheduleData, setScheduleData] = useState({
     todaySchedule: null,
     upcomingSchedules: []
   });

   useEffect(() => {
     const fetchScheduleData = async () => {
       try {
         const res = await getTodayAndUpComingSchedule();
         setScheduleData(res.data);
          console.log(scheduleData);
       } catch (error) {
         console.error('Failed to fetch schedule data:', error);
       }
     };

     fetchScheduleData();
   }, []);

   return (
       <div className="h-screen bg-light-cream flex flex-col">
            <Navigation />
            <div className="flex-1">
                <ScheduleSection 
                  className="h-full" 
                  scheduleData={scheduleData}
                />
            </div>
            <div className="h-2/5">
                <BookParticipationSection className="h-full" />
            </div>
       </div>
   );
}

export default ChildMainPage;