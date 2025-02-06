import React, { useState } from "react";
import OpenAI from "openai";
import BookDetail from "./BookDetail";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const BookStoryGenerator = ({
  story,
  onClose,
  mood,
  theme,
  genre,
  difficulty,
  length, // 챕터 수
}) => {
  const [currentStory, setCurrentStory] = useState(story);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBookDetail, setShowBookDetail] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // 선택 정보를 태그 형태로 보여주기 위한 info 객체
  const info = {
    분위기: mood,
    테마: theme,
    장르: genre,
    난이도: difficulty,
    "챕터 수": length,
  };

  // 선택 정보를 바탕으로 재생성 프롬프트 구성
  const handleRegenerateStory = async () => {
    setIsGenerating(true);
    const ageGroup =
      difficulty === 1
        ? "4~6세"
        : difficulty === 2
        ? "7세"
        : difficulty === 3
        ? "8세"
        : difficulty === 4
        ? "9세"
        : difficulty === 5
        ? "10세"
        : "11세";
    const regeneratePrompt = `
역할: ${mood} 분위기의 ${theme} 테마 ${genre} 동화를 작성하는 동화 작가.
- 난이도: (${ageGroup}) 수준.
- 구성:
  - 개요: 5줄 내외.
  - 챕터: 총 ${length}개, 각 챕터마다 4문장으로 구성.
- 사용 단어:
  - 각 챕터마다 4개의 단어(동사는 원형 사용; 문장 내에서는 변형 가능)를 "<사용 단어: ...>" 형식으로 제공.
  - 각 문장에는 해당 단어를 볼드체로 포함 (단어들은 중복 없이 각 문장마다 한 개씩).
- *출력 예시 (각 섹션을 "---" 구분자로 나누어 주세요):*

1. 개요  
한 소년이 마법의 숲에 들어갔어요.  
숲에서 동물 친구들을 만났어요.  
모험이 시작되었어요.  
새로운 우정을 쌓아갈 수 있을까요?  

---  

2. CH1  
<사용 단어: "마법", "노란색", "부르다", "돌아가다">  
(1) 소년은 **마법**의 숲에 들어갔어요.  
(2) 숲에서 **노란색** 토끼를 만났어요.  
(3) 소년은 토끼를 **불렀어요**.  
(4) 모두와 함께 집으로 **돌아갔어요**.  

---  

3. CH2  
<사용 단어: "친구", "함께", "약속", "모이다">  
(1) 다음날, 소년은 **친구**에게 이야기를 전해줬어요.  
(2) 친구는 **함께** 가고 싶다고 했어요.  
(3) 소년은 친구에게 함께 가자고 **약속**했어요.  
(4) 그리고 다음날 아침에 둘은 숲 앞에 **모였어요**.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: regeneratePrompt }],
      });
      setCurrentStory(response.choices[0]?.message?.content || "재생성 실패");
    } catch (error) {
      console.error("이야기 재생성 오류:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBookCover = async () => {
    setIsGeneratingImage(true);
    // 현재 스토리의 첫 번째 섹션(개요)만 사용
    const storySections = currentStory.split("---").map((section) => section.trim());
    const storySummary = storySections.length > 0 ? storySections[0] : "";
    const coverPrompt = `이 이야기를 바탕으로 동화책의 표지 일러스트를 글 없이 만들어줘: ${storySummary}`;
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: coverPrompt,
        n: 1,
        size: "1024x1024",
      });
      setCoverImage(response.data[0]?.url || "이미지 생성 실패");
      setShowBookDetail(true);
    } catch (error) {
      console.error("표지 생성 오류:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // '---' 구분자로 스토리 섹션 분리 (개요, 챕터 등)
  const storySections = currentStory.split("---").map((section) => section.trim());

  return showBookDetail ? (
    <BookDetail
      coverImage={coverImage}
      storySummary={currentStory.split("\n").slice(0, 5).join(" ")}
    />
  ) : (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
      <div
        className="p-6 rounded-lg shadow-lg w-2/3 relative max-h-screen overflow-y-auto"
        style={{ backgroundColor: "#BCDAFE" }}
      >
        <h2 className="text-xl font-bold mb-4 text-center">📖 생성된 이야기</h2>

        {/* 선택된 키워드 정보 태그 영역 */}
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(info).map(([key, value]) => (
            <span
              key={key}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {key}: {value}
            </span>
          ))}
        </div>

        {/* 각 섹션(개요, 챕터 등)을 별도의 컨테이너로 렌더링 */}
        {storySections.map((section, index) => (
          <div
            key={index}
            className="mb-4 p-4 border border-gray-300 rounded"
            style={{ backgroundColor: "#EBF4FF" }}
          >
            {section.split("\n").map((line, i) => (
              <p
                key={i}
                className="mb-2"
                dangerouslySetInnerHTML={{
                  __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                }}
              ></p>
            ))}
          </div>
        ))}

        {/* 버튼 영역 */}
        <div className="flex justify-between">
          <button
            onClick={handleRegenerateStory}
            disabled={isGenerating || isGeneratingImage}
            className={`px-4 py-2 rounded-lg font-bold ${
              isGenerating ? "bg-gray-400" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isGenerating ? "재생성 중..." : "재생성"}
          </button>
          <button
            onClick={handleGenerateBookCover}
            disabled={isGenerating || isGeneratingImage}
            className={`px-4 py-2 rounded-lg font-bold ${
              isGeneratingImage ? "bg-gray-400" : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isGeneratingImage ? "그림책 생성 중..." : "결정하기"}
          </button>
        </div>

        {isGeneratingImage && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
            <p className="text-white text-lg font-bold">📖 그림책 생성 중...</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 px-3 py-1 bg-gray-500 text-white rounded-full"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default BookStoryGenerator;
