import React from 'react';
import TodayScheduleCard from "./TodayScheduleCard";
import UpcomingScheduleCard from "./UpcomingScheduleCard";
import CharacterKADO from '../../assets/kado.svg';

const ScheduleSection = ({ className }) => {
 const upcomingSchedules = [
   {
     bookTitle: "안녕, 독도 고래!",
     sessionTime: "오늘 오후 8시"
   },
   {
     bookTitle: "안녕, 독도 고래!",
     sessionTime: "오늘 오후 8시"
   },
   {
     bookTitle: "안녕, 독도 고래!",
     sessionTime: "오늘 오후 8시"
   }
 ];

 return (
   <section className={`bg-light-cream w-full h-full min-h-[400px] relative flex items-center ${className}`}>
     {/* 메인 컨텐츠 */}
     <div className="mx-auto max-w-7xl w-full">
       <div className="w-full flex flex-col md:flex-row gap-6 p-4 items-center justify-center">
         {/*오늘의 일정*/}
         <TodayScheduleCard />
         
         {/*다가오는 일정*/}
         <div className="flex flex-col items-center md:items-start justify-center pl-6 pt-4"> 
           <h2 className="text-[21px] font-bold pb-2 mt-2">다가오는 일정</h2>
           <div className="flex pt-2 gap-2 overflow-x-auto no-scrollbar">
             {upcomingSchedules.map((schedule, index) => (
               <UpcomingScheduleCard 
                 key={index} 
                 bookTitle={schedule.bookTitle}
                 sessionTime={schedule.sessionTime}
               />
             ))}
           </div>
         </div>
       </div>
     </div>

     {/* 캐릭터 이미지 */}
     <div className="absolute left-4 bottom-0 w-[120px] h-[100px] overflow-hidden">
       <img 
         src={CharacterKADO}
         alt="Character decoration"
         className="w-full h-[200px] object-contain"
       />
     </div>
   </section>
 );
};

export default ScheduleSection;