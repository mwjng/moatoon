import React, { useState, useEffect } from 'react';
import BookStoryGenerator from '../../components/book/BookStoryGenerator';
import Navigation from '../../components/Navigation';
import BookForm from '../../components/book/BookForm';
import AlertModal from '../../components/common/AlertModal';
import BookDetail from '../../components/book/BookDetail';
import { checkCanJoin } from '../../api/party';

const BookGeneratorPage = () => {
    const [storyConfig, setStoryConfig] = useState(null);
    const [showStoryGenerator, setShowStoryGenerator] = useState(false);
    const [modalText, setModalText] = useState('');
    const [modalState, setModalState] = useState(false);
    const [showBookDetail, setShowBookDetail] = useState(false);
    const [currentPartyId, setCurrentPartyId] = useState(null);
    const convertDayOfWeekToEnum = dayList => {
        const dayMap = {
            월: 'MONDAY',
            화: 'TUESDAY',
            수: 'WEDNESDAY',
            목: 'THURSDAY',
            금: 'FRIDAY',
            토: 'SATURDAY',
            일: 'SUNDAY',
        };
        return dayList.map(day => dayMap[day] || day); // 변환된 리스트 반환
    };

    useEffect(() => {
        console.log('State changes:', {
            showStoryGenerator,
            currentPartyId,
            showBookDetail,
        });
    }, [showStoryGenerator, currentPartyId, showBookDetail]);

    const handleFormSubmit = async formData => {
        const payload = {
            startDate: formData.startDate,
            episodeLength: formData.episodeLength,
            time: formData.time,
            dayWeek: convertDayOfWeekToEnum(formData.dayOfWeek),
            participatingChildren: formData.participatingChildren,
        };
        try {
            await checkCanJoin(payload);
        } catch (err) {
            console.log(err);
            if (err.response.data.code == 2007) {
                setModalText('해당 시간 그림책에 참여중인 아동이 있습니다.');
                setModalState(true);
                return;
            }
        }
        setStoryConfig(formData);
        setShowStoryGenerator(true);
    };

    const handleStoryComplete = partyId => {
        setShowStoryGenerator(false);
        setCurrentPartyId(partyId);
        setShowBookDetail(true);
    };

    const handleBookDetailClose = () => {
        setShowBookDetail(false);
        setCurrentPartyId(null);
    };

    const selectTimeHandler = () => {
        setModalText('시작일을 먼저 선택해주세요.');
        setModalState(true);
    };

    const closeModal = () => {
        setModalState(false);
    };

    return (
        <div className="bg-[#D9F0FE] h-screen flex flex-col">
            <Navigation />

            {/* <div className="flex flex-col items-center pt-4 w-full h-screen"> */}
            <div className="w-[90%] bg-[#ffffff88] text-black rounded-3xl px-20 py-5 flex gap-3 text-xl items-center flex-col max-h-[75%] overflow-y-auto overflow-x-hidden m-auto">
                <h1 className="text-3xl font-bold text-blue-800 mb-6">📖 AI 동화책 생성</h1>
                <BookForm onSubmit={handleFormSubmit} selectTimeHandler={selectTimeHandler} closeModal={closeModal} />
            </div>
            {/* </div> */}

            {/* 스토리 생성기 모달 */}
            {showStoryGenerator && storyConfig && (
                <BookStoryGenerator
                    {...storyConfig}
                    onClose={() => setShowStoryGenerator(false)}
                    onComplete={handleStoryComplete}
                />
            )}

            {showBookDetail && currentPartyId && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl">
                            <div className="max-h-[90vh] overflow-hidden rounded-xl">
                                <BookDetail
                                    {...storyConfig}
                                    partyIdOrPin={currentPartyId}
                                    onClose={handleBookDetailClose}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <AlertModal text={modalText} modalState={modalState} closeHandler={closeModal} />
        </div>
    );
};
export default BookGeneratorPage;
