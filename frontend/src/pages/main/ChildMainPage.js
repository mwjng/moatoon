import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import ScheduleSection from "../../components/main/ScheduleSection";
import ChildBookParticipationSection from "../../components/main/ChildBookParticipationSection";
import { getTodayAndUpComingSchedule } from '../../api/schedule';
import { useSelector } from 'react-redux';



function ChildMainPage() {
  // 오늘의 일정 & 다가오는 일정 조회 api
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

   // 화면 html
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
                <ChildBookParticipationSection className="h-full" />
            </div>
       </div>
   );
}

export default ChildMainPage;