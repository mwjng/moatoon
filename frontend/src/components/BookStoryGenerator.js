import React, { useEffect, useState } from "react";
import OpenAI from "openai";

// OpenAI API 객체 생성 (FE에서 직접 호출)
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const BookStoryGenerator = ({
  // 추가 정보
  startDate,
  level,
  episodeLength,  // 챕터 수 (에피소드 분량)
  time,
  dayOfWeek,      // 배열
  publicStatus,
  participatingChildren,
  // 기존 정보
  mood,
  theme,
  genre,
  difficulty,
  onClose,
}) => {
  // 전달받은 정보들을 콘솔에 출력 (마운트 시)
  useEffect(() => {
    console.log("Received props:", {
      startDate,
      level,
      episodeLength,
      time,
      dayOfWeek,
      publicStatus,
      participatingChildren,
      mood,
      theme,
      genre,
      difficulty,
    });
  }, [startDate, level, episodeLength, time, dayOfWeek, publicStatus, participatingChildren, mood, theme, genre, difficulty]);

  // 내부 스토리 상태 (JSON 객체)
  const [currentStory, setCurrentStory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // info 객체 (선택 항목 제외)
  const info = {
    "방 시작일": startDate,
    "레벨": level,
    "에피소드 분량": episodeLength,
    "시간": time,
    "요일": dayOfWeek.join(", "),
    "공개 여부": publicStatus,
    "분위기": mood,
    "테마": theme,
    "장르": genre,
    "참여할 아동": participatingChildren,
  };

  // 스토리 생성을 위한 프롬프트 생성 함수 (동화책 제목 포함, 상세 버전)
  const generateStoryPrompt = () => {
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
    return `
동화책 제목: 창의적인 동화책 제목을 지어주세요.
역할: ${mood} 분위기의 ${theme} 테마 ${genre} 동화를 작성하는 동화 작가.
- 난이도: (${ageGroup}) 수준.
- 제목 : 내용을 함축하고, 아이들이 흥미를 가질만한 제목.
- 개요: 아래와 같이 5줄 내외의 동화 개요를 작성.
- 챕터: 총 ${episodeLength}개, 각 챕터마다 4문장으로 구성.
- 사용 단어: 각 챕터에 4개의 단어를 "<사용 단어: ...>" 형식으로 제공하며, 각 문장에는 해당 단어를 **볼드체**로 포함해 주세요.
- JSON 형식으로 반환:

- 다음은 예시로 이런 식의 JSON으로 글을 생성해주되, 이 글과 내용이 같으면 안돼.
{
  "title": "마법 숲에 들어간 공주",
  "overview": [
    "옛날 어느 왕국에 작은 공주가 살고 있었어요.",
    "그녀는 마법의 정원에서 특별한 꽃을 키웠어요.",
    "어느 날, 신비한 나비를 만났어요.",
    "나비는 공주에게 숨겨진 비밀을 알려주었어요.",
    "공주는 모험을 떠나기로 결심했어요."
  ],
  "chapters": [
    {
      "title": "CH1",
      "words": ["마법", "꽃", "꿈", "발견하다"],
      "sentences": [
        "공주는 **마법**의 힘을 믿었어요.",
        "정원의 **꽃**을 소중히 돌보았어요.",
        "밤마다 **꿈** 속에서 미래를 보았어요.",
        "어느 날, 숨겨진 열쇠를 **발견했어요.**"
      ]
    },
    {
      "title": "CH2",
      "words": ["나비", "여행", "우정", "밝히다"],
      "sentences": [
        "신비한 **나비**가 나타났어요.",
        "공주는 나비와 함께 **여행**을 시작했어요.",
        "그 과정에서 새로운 **우정**을 쌓았어요.",
        "나비가 숨겨진 비밀을 **밝혀주었어요**."
      ]
    }
    // 에피소드 분량에 따라 추가 챕터 생성...
  ]
}`;
  };

  // 최초 스토리 생성 (컴포넌트 마운트 시)
  const handleGenerateInitialStory = async () => {
    setIsGenerating(true);
    const prompt = generateStoryPrompt();
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });
      const generated = response.choices[0]?.message?.content || "";
      const newStory = JSON.parse(generated);
      setCurrentStory(newStory);
    } catch (error) {
      console.error("초기 스토리 생성 오류:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    handleGenerateInitialStory();
  }, []);

  // 재생성 버튼 클릭 시
  const handleRegenerateStory = async () => {
    setIsGenerating(true);
    const prompt = generateStoryPrompt();
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });
      const generated = response.choices[0]?.message?.content || "";
      const newStory = JSON.parse(generated);
      setCurrentStory(newStory);
    } catch (error) {
      console.error("재생성 오류:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 결정하기 버튼 클릭 시: 표지 생성 후 최종 payload 구성하여 백엔드 전송
  const handleDecide = async () => {
    setIsGeneratingImage(true);
    let overviewText = "";
    try {
      overviewText = currentStory.overview.join(" ");
    } catch (error) {
      console.error("overview 추출 오류:", error);
    }
    const coverPrompt = `${overviewText} : 이 이야기의 감성을 살린 동화 일러스트를 생성해줘. 
오직 그림만 포함되며, 어떠한 텍스트나 숫자, 문자는 절대 포함하지 말아줘. 그리고 프레임을 제외한 순수한 일러스트여야해.`;
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: coverPrompt,
        n: 1,
        size: "1024x1024",
      });
      // DALL-E 3가 URL(다운로드 링크)을 반환한다고 가정
      const generatedCover = response.data[0]?.url || "";
      setCoverImage(generatedCover);

      // 최종 payload 구성
      const payload = {
        startDate,
        level,
        episodeLength,
        time,
        dayOfWeek,  // 배열 그대로 전송
        publicStatus,
        mood,
        theme,
        genre,
        participatingChildren,
        story: currentStory,
        coverImage: generatedCover
      };

      // 백엔드 최종 제출
      const submitResponse = await fetch("http://localhost:8080/api/parties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!submitResponse.ok) throw new Error("스토리 전송 실패");
      console.log("스토리 전송 성공");
      onClose();
    } catch (error) {
      console.error("최종 결정 오류:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
      <div
        className="p-6 rounded-lg shadow-lg w-2/3 relative max-h-screen overflow-y-auto"
        style={{ backgroundColor: "#BCDAFE" }}
      >
        <h2 className="text-xl font-bold mb-4 text-center">📖 생성된 이야기</h2>

        {/* 선택 및 추가 정보 태그 영역 */}
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(info).map(([key, value]) => (
            <span
              key={key}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {key}: {typeof value === "string" ? value : Array.isArray(value) ? value.join(", ") : value}
            </span>
          ))}
        </div>

        {/* 로딩 메시지 */}
        {isGenerating && <p className="mb-4 text-center">스토리 생성 중...</p>}

        {/* 스토리 출력: 제목 및 개요 */}
        {currentStory && (
          <div className="mb-4 p-4 border border-gray-300 rounded" style={{ backgroundColor: "#EBF4FF" }}>
            <h3 className="font-bold mb-2">동화책 제목: {currentStory.title}</h3>
            <h4 className="font-bold mb-2">개요</h4>
            {currentStory.overview.map((line, idx) => (
              <p key={idx} className="mb-1">{line}</p>
            ))}
          </div>
        )}

        {/* 스토리 출력: 각 챕터 */}
        {currentStory && currentStory.chapters &&
          currentStory.chapters.map((chapter, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-300 rounded"
              style={{ backgroundColor: "#EBF4FF" }}
            >
              <h3 className="font-bold mb-2">{chapter.title}</h3>
              <div className="mb-2">
                <strong>사용 단어:</strong> {chapter.words.join(", ")}
              </div>
              {chapter.sentences.map((sentence, idx) => (
                <p
                  key={idx}
                  className="mb-1"
                  dangerouslySetInnerHTML={{
                    __html: sentence.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                  }}
                ></p>
              ))}
            </div>
          ))}

        {/* 버튼 영역 */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleRegenerateStory}
            disabled={isGenerating}
            className={`px-4 py-2 rounded-lg font-bold ${isGenerating ? "bg-gray-400" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            {isGenerating ? "재생성 중..." : "재생성"}
          </button>
          <button
            onClick={handleDecide}
            disabled={isGeneratingImage}
            className={`px-4 py-2 rounded-lg font-bold ${isGeneratingImage ? "bg-gray-400" : "bg-green-700 text-white hover:bg-green-800"}`}
          >
            결정하기
          </button>
        </div>

        <button onClick={onClose} className="absolute top-2 right-2 px-3 py-1 bg-gray-500 text-white rounded-full">
          X
        </button>
      </div>
    </div>
  );
};

export default BookStoryGenerator;
