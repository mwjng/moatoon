import React, { useState } from 'react';
import BookStoryGenerator from '../../components/book/BookStoryGenerator';
import Navigation from '../../components/Navigation';
import BookForm from '../../components/book/BookForm';
import AlertModal from '../../components/common/AlertModal';
import BookDetail from '../../components/book/BookDetail';

const BookGeneratorPage = () => {
    const [storyConfig, setStoryConfig] = useState(null);
    const [showStoryGenerator, setShowStoryGenerator] = useState(false);
    const [modalText, setModalText] = useState('');
    const [modalState, setModalState] = useState(false);
    const [showBookDetail, setShowBookDetail] = useState(false);
    const [currentPartyId, setCurrentPartyId] = useState(null);

    // 🔹 폼 제출 시 호출
    const handleFormSubmit = formData => {
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

            <div className="flex flex-col items-center pt-4 w-full">
                <div className="w-[90%] bg-[#ffffff88] text-black rounded-3xl px-20 py-5 flex gap-3 text-xl items-center flex-col">
                    <h1 className="text-3xl font-bold text-blue-800 mb-6">📖 AI 동화책 생성</h1>
                    <BookForm
                        onSubmit={handleFormSubmit}
                        selectTimeHandler={selectTimeHandler}
                        closeModal={closeModal}
                    />
                </div>
            </div>

            {/* 스토리 생성기 모달 */}
            {showStoryGenerator && storyConfig && (
                <BookStoryGenerator
                    {...storyConfig}
                    onClose={() => setShowStoryGenerator(false)}
                    onComplete={handleStoryComplete}
                />
            )}

            {showBookDetail && currentPartyId && (
                <BookDetail
                    partyIdOrPin={currentPartyId}
                    onClose={handleBookDetailClose}
                    //   setModalLoading={setModalLoading}
                />
            )}
            <AlertModal text={modalText} modalState={modalState} 
            closeHandler={closeModal} />
        </div>
    );
};
export default BookGeneratorPage;
