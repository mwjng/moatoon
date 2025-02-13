import React, { useState } from 'react';
import BookStoryGenerator from '../../components/book/BookStoryGenerator';
import Navigation from '../../components/Navigation';
import BookForm from '../../components/book/BookForm';
import AlertModal from '../../components/common/AlertModal';

const BookGeneratorPage = () => {
    const [storyConfig, setStoryConfig] = useState(null);
    const [showStoryGenerator, setShowStoryGenerator] = useState(false);
    const [modalText, setModalText] = useState('');
    const [modalState, setModalState] = useState(false);

    // 🔹 폼 제출 시 호출
    const handleFormSubmit = formData => {
        setStoryConfig(formData);
        setShowStoryGenerator(true);
    };

    const selectTimeHandler = () => {
        setModalText('시작일을 먼저 선택해주세요.');
        setModalState(true);
    };

    const closeModal = () => {
        setModalState(false);
    };

    return (
        <div className="bg-[#D9F0FE] min-h-screen flex">
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
                <Navigation />
            </div>

            <div className="relative flex flex-col items-center p-100 pt-[110px] w-full">
                <div
                    className="absolute w-[90%] h-[75%] top-[50%] m-auto p-5 bg-[#ffffff88] text-black rounded-3xl pr-[5rem] pl-[5rem] left-[50%] -translate-x-1/2 -translate-y-1/2 flex gap-3 text-xl items-center flex-col
"
                    style={{ top: 'calc(50% + 55px)' }}
                >
                    <h1 className="text-3xl font-bold text-blue-800 mb-6">📖 AI 동화책 생성</h1>

                    {/* 사용자 입력 폼 */}
                    <BookForm
                        onSubmit={handleFormSubmit}
                        selectTimeHandler={selectTimeHandler}
                        closeModal={closeModal}
                    />

                    {/* 이야기 생성 모달 */}
                    {showStoryGenerator && storyConfig && (
                        <BookStoryGenerator {...storyConfig} onClose={() => setShowStoryGenerator(false)} />
                    )}
                </div>
            </div>
            <AlertModal text={modalText} modalState={modalState} closeHandler={closeModal} />
        </div>
    );
};

export default BookGeneratorPage;
