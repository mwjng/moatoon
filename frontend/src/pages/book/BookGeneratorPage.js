import React, { useState } from 'react';
import BookStoryGenerator from '../../components/book/BookStoryGenerator';
import Navigation from '../../components/Navigation';
import BookForm from '../../components/book/BookForm';
import AlertModal from '../../components/common/AlertModal';
import ConfirmModal from '../../components/common/ConfirmModal';
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

    const handleStoryComplete = (partyId) => {
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
        <div className="bg-[#D9F0FE] min-h-screen">
            <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md">
                <Navigation />
            </div>

            <div className="relative flex flex-col items-center pt-[110px] w-full">
                <div className="w-[90%] h-[75%] bg-[#ffffff88] text-black rounded-3xl px-20 py-5 flex gap-3 text-xl items-center flex-col">
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
                  onClose={handleCloseModal}
                //   setModalLoading={setModalLoading}
                />
            )}
            <AlertModal text={modalText} modalState={modalState} closeHandler={closeModal} />
        </div>
    );
};
export default BookGeneratorPage;
