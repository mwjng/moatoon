import React, { useState } from 'react';
import TodayScheduleCard from './TodayScheduleCard';
import UpcomingScheduleCard from './UpcomingScheduleCard';
import CharacterKADO from '../../assets/kado.png';
import BookDetail from '../../components/book/BookDetail';

const ScheduleSection = ({ className, scheduleData }) => {
    const { todaySchedule, upcomingSchedules } = scheduleData || {
        todaySchedule: null,
        upcomingSchedules: [],
    };

    // 방 상세 모달
    const [currentPartyId, setCurrentPartyId] = useState(0);
    const [showBookDetail, setShowBookDetail] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const handleCardClick = async partyId => {
        if (!partyId || typeof partyId !== 'number') {
            return;
        }
        try {
            await setCurrentPartyId(partyId);
            setShowBookDetail(true);
        } catch (error) {
            console.error('카드 클릭 처리 중 에러:', error);
        }
    };

    const handleCloseModal = () => {
        setShowBookDetail(false);
        setCurrentPartyId(null);
    };

    // 날짜 포맷팅 함수
    const formatSessionTime = dateString => {
        const date = new Date(dateString);
        const today = new Date();

        // 같은 날짜인지 확인
        const isToday = date.toDateString() === today.toDateString();

        // 시간 포맷팅
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours > 12 ? hours - 12 : hours;

        // 날짜 문자열 생성
        const timeString = `${period} ${formattedHours}시${minutes > 0 ? ` ${minutes}분` : ''}`;
        return isToday ? `오늘 ${timeString}` : `${date.getMonth() + 1}월 ${date.getDate()}일 ${timeString}`;
    };

    return (
        <section className={`bg-light-cream w-full h-full min-h-[400px] relative flex items-center ${className}`}>
            {/* 메인 컨텐츠 */}
            <div className="mx-auto max-w-7xl w-full">
                <div className="w-full flex flex-col md:flex-row gap-6 p-4 items-center justify-center">
                    {/* 오늘의 일정 */}
                    <TodayScheduleCard
                        schedule={todaySchedule}
                        sessionTime={todaySchedule ? formatSessionTime(todaySchedule.sessionTime) : null}
                    />

                    {/* 다가오는 일정 - 일정이 있을 때만 표시 */}
                    {upcomingSchedules?.length > 0 && (
                        <div className="flex flex-col items-center md:items-start justify-center pl-6 pt-4">
                            <h2 className="text-[21px] font-bold pb-2 mt-2">다가오는 일정</h2>
                            <div className="flex pt-2 gap-3 overflow-x-auto scrollbar-hide pb-4">
                                {upcomingSchedules.map(schedule => (
                                    <UpcomingScheduleCard
                                        key={schedule.scheduleId}
                                        bookImg={schedule.bookCover}
                                        bookTitle={schedule.bookTitle}
                                        sessionTime={formatSessionTime(schedule.sessionTime)}
                                        onClick={() => {
                                            handleCardClick(schedule.partyId);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 캐릭터 이미지 */}
            <div className="absolute left-4 bottom-0 w-[120px] h-[100px] overflow-hidden">
                <img src={CharacterKADO} alt="Character decoration" className="w-full h-[200px] object-contain" />
            </div>

            {showBookDetail && currentPartyId && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div
                            className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="max-h-[90vh] overflow-hidden rounded-xl">
                                <BookDetail
                                    partyIdOrPin={currentPartyId}
                                    onClose={handleCloseModal}
                                    setModalLoading={setModalLoading}
                                />
                            </div>
                        </div>
                    </div>
                    {modalLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="loading loading-spinner loading-lg text-primary"></div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default ScheduleSection;
