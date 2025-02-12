import React, { useState } from "react";
import BookStoryGenerator from "../../components/book/BookStoryGenerator";
import Navigation from "../../components/Navigation";
import BookForm from "../../components/book/BookForm";

const BookGeneratorPage = () => {
  const [storyConfig, setStoryConfig] = useState(null);
  const [showStoryGenerator, setShowStoryGenerator] = useState(false);

  // 🔹 폼 제출 시 호출
  const handleFormSubmit = (formData) => {
    setStoryConfig(formData);
    setShowStoryGenerator(true);
  };

  return (
    <div className="bg-blue-100 min-h-screen flex">
      {/* <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Navigation />
      </div> */}

      {/* ✅ pt-16 추가해서 Navigation과 겹치지 않도록 조정 */}
      <div className="flex flex-col items-center p-100 pt-100 w-full">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">📖 AI 동화책 생성</h1>

        {/* 사용자 입력 폼 */}
        <BookForm onSubmit={handleFormSubmit} />

        {/* 이야기 생성 모달 */}
        {showStoryGenerator && storyConfig && (
          <BookStoryGenerator
            {...storyConfig}
            onClose={() => setShowStoryGenerator(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BookGeneratorPage;
