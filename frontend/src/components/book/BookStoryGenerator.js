import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import { fetchRandomWords, sendStoryToBackend } from "../../api/party";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const BookStoryGenerator = ({
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
  onClose,
}) => {
  const [currentStory, setCurrentStory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [words, setWords] = useState([]);
  const [partyId, setPartyId] = useState(null);
  const [isCreatingParty, setIsCreatingParty] = useState(false);
  const [showBookDetail, setShowBookDetail] = useState(false);

  const generateStory = async () => {
    setIsGenerating(true);
    try {
      const data = await fetchRandomWords(difficulty, episodeLength);
      
      if (!data || !data.words || data.words.length === 0) {
        throw new Error("단어를 가져오는 데 실패했습니다.");
      }

      setWords(data.words);
      const wordList = data.words.map((w) => w.word).join(", ");
      const prompt = `
            동화책 제목: 생성된 이야기와 어울리는 동화책 제목을 지어줘.
            역할: ${mood} 분위기의 ${theme} 테마 ${genre} 동화를 작성하는 동화 작가.
            - 난이도: (${difficulty}단계).
            - 개요: 이야기의 도입부만 제공하며, 전체 내용을 밝히지 않고 궁금증을 유발해야 함.
            - 챕터: 총 ${episodeLength}개로 구성됨.
            - 각 챕터는 4개의 문장으로 이루어짐.
            - 각 문장에는 반드시 지정된 단어를 포함해야 함.
            - 첫문장부터 마지막문장까지 이어지는 스토리는 기승전결이 느껴져야해
            - JSON 형식으로 반환해야 함.
            - 사용 단어 목록: ${wordList}

            - **words와 sentence의 관계**
            - words[0]은 sentence[0]에서 사용된다.
            - words[1]은 sentence[1]에서 사용된다.
            - words[2]은 sentence[2]에서 사용된다.
            - words[3]은 sentence[3]에서 사용된다.

            ### JSON 출력 예시 1:
            {
              "title": "마법의 그림 속 모험",
              "overview": [
                "한 마을에 그림을 사랑하는 아이가 있었어요.",
                "그는 매일 신비한 그림을 그리며 꿈을 키웠어요.",
                "어느 날, 그림 속에서 기차 소리가 들려오네요? 모험이 시작될까요?",
                "아이의 특별한 모험이 시작될까요?"
              ],
              "chapters": [
                {
                  "title": "CH1",
                  "words": [
                    { "id": 1, "word": "그림" },
                    { "id": 8, "word": "기차" },
                    { "id": 2, "word": "그만" },
                    { "id": 4, "word": "글자" }
                  ],
                  "sentences": [
                    "아이의 벽에는 신비한 그림이 걸려 있었어요.",
                    "그림 속에서는 오래된 기차가 달리고 있었어요.",
                    "기차가 멈추자, 아이는 그만 숨을 멈추고 말았어요.",
                    "벽에 적힌 글자가 갑자기 빛나기 시작했어요."
                  ]
                },
                {
                  "title": "CH2",
                  "words": [
                    { "id": 3, "word": "글씨" },
                    { "id": 6, "word": "기다리다" },
                    { "id": 5, "word": "금요일" },
                    { "id": 7, "word": "기린" }
                  ],
                  "sentences": [
                    "그림 속에 적힌 글씨는 마법의 주문이었어요.",
                    "소년은 기차를 타고 목적지를 기다리며 설렜어요.",
                    "그곳은 매주 금요일에만 열리는 비밀스러운 마을이었어요.",
                    "그곳에서 아이는 거대한 기린을 만났어요."
                  ]
                }
              ]
            }

            ### JSON 출력 예시 2:
            {
              "title": "바다 속의 보물 찾기",
              "overview": [
                "어느 날, 한 용감한 소년이 깊은 바다로 들어갔어요.",
                "그는 신비로운 해양 생물들과 친구가 되었어요.",
                "소년은 오래된 보물 지도를 발견했어요.",
                "그는 새로운 모험을 시작했어요."
              ],

                "chapters": [
                ${words.reduce((acc, word, idx) => {
                  if (idx % 4 === 0) acc.push([]);
                  acc[acc.length - 1].push(word);
                  return acc;
                }, []).map((chapterWords, index) => `{
                  "title": "CH${index + 1}",
                  "words": [${chapterWords.map(w => `{"id": ${w.wordId}, "word": "${w.word}"}`).join(", ")}],
                  "sentences": [
                    "첫 번째 문장: **${chapterWords[0]?.word}**을 사용해야 합니다.",
                    "두 번째 문장: **${chapterWords[1]?.word}**을 사용해야 합니다.",
                    "세 번째 문장: **${chapterWords[2]?.word}**을 사용해야 합니다.",
                    "네 번째 문장: **${chapterWords[3]?.word}**을 사용해야 합니다."
                  ]
                }`).join(", ")}
              ]
              
            }
      `;

      // 🔹 OpenAI 요청
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      const responseText = response.choices[0]?.message?.content;

      if (!responseText) {
        throw new Error("OpenAI 응답이 비어 있습니다.");
      }

      let generatedStory;
      try {
        generatedStory = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("JSON 파싱 오류:", jsonError);
        throw new Error("OpenAI에서 올바른 JSON 응답을 받지 못했습니다.");
      }

      // ✅ overview를 하나의 문자열로 변환
      if (Array.isArray(generatedStory.overview)) {
        generatedStory.overview = generatedStory.overview.join(" ");
      }

      setCurrentStory(generatedStory);
    } catch (error) {
      console.error("스토리 생성 오류:", error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateStory();
  }, []);


  const convertDayOfWeekToEnum = (dayList) => {
    const dayMap = {
      "월": "MONDAY",
      "화": "TUESDAY",
      "수": "WEDNESDAY",
      "목": "THURSDAY",
      "금": "FRIDAY",
      "토": "SATURDAY",
      "일": "SUNDAY"
    };
    return dayList.map(day => dayMap[day] || day); // 변환된 리스트 반환
  };


  

  // 🔹 표지 이미지 생성 및 최종 데이터 전송
  const handleDecide = async () => {
    setIsGeneratingImage(true);
    setIsCreatingParty(true);

    try {
      const coverPrompt = `${currentStory.overview} : 참고 내용을 바탕으로 동화 스타일의 일러스트 이미지 생성.(텍스트 미포함)`;
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: coverPrompt,
        n: 1,
        size: "1024x1024",
      });

      const generatedCover = response.data[0]?.url || "";
      if (!generatedCover) throw new Error("이미지 생성 실패");

      const formattedDayOfWeek = convertDayOfWeekToEnum(dayOfWeek);
      const isPublic = publicStatus === "공개"

      
      const payload = {
        startDate,
        level: parseInt(level.replace("Lv", "").trim()),
        episodeLength,
        time,
        dayWeek: formattedDayOfWeek,
        genre: parseInt(genre),
        mood: parseInt(mood),
        theme: parseInt(theme),
        publicStatus:isPublic,
        participatingChildren,
        story: currentStory,
      };

      const result = await sendStoryToBackend(payload, generatedCover);
      console.log("스토리 전송 성공", result);//result = partyId
      // setPartyId(result);

      onClose();
    } catch (error) {
      console.error("최종 전송 오류:", error.message);
    } finally {
      setIsGeneratingImage(false);
      setIsCreatingParty(false);
    }
  };

  useEffect(() => {
    if (partyId) {
      setIsCreatingParty(false);
      setShowBookDetail(true);
    }
  }, [partyId]);

return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="w-[90%] md:w-[80%] lg:w-[70%]  bg-blue-100 rounded-lg shadow-lg">
                <div className="h-full grid grid-rows-[auto_1fr_auto]">
                    {/* 헤더 */}
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-bold text-center flex-grow">📖 스토리라인</h2>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    {/* 스크롤 가능한 컨텐츠 영역 */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {isGenerating ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-lg">스토리를 생성하고 있습니다...</p>
                            </div>
                        ) : (
                            <>
                                {currentStory && (
                                    <div className="mb-4 p-3 border border-gray-300 rounded bg-gray-50">
                                        <h3 className="font-bold mb-2 text-base">개요</h3>
                                        <p className="text-sm">{currentStory.overview}</p>
                                    </div>
                                )}

                                {currentStory?.chapters?.map((chapter, index) => (
                                    <div key={index} className="mb-4 p-3 border border-gray-300 rounded bg-gray-50">
                                        <h3 className="font-bold mb-2 text-base">에피소드 {index + 1}</h3>
                                        <p className="text-sm mb-2">
                                            <strong>사용 단어:</strong> {chapter.words.map(w => w.word).join(", ")}
                                        </p>
                                        {chapter.sentences.map((sentence, idx) => (
                                            <p key={idx} className="text-sm mb-1">{sentence}</p>
                                        ))}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* 하단 버튼 */}
                    <div className="p-4 border-t bg-blue-100 flex justify-center gap-3">
                        <button 
                            onClick={generateStory} 
                            disabled={isGenerating} 
                            className="bg-[#FFE156] hover:bg-[#FFD156] px-4 py-2 rounded-lg text-black text-sm disabled:opacity-50"
                        >
                            재생성하기 (1/3)
                        </button>
                        <button 
                            onClick={handleDecide} 
                            disabled={isGeneratingImage} 
                            className="bg-[#FFE156] hover:bg-[#FFD156] px-4 py-2 rounded-lg text-black text-sm disabled:opacity-50"
                        >
                            결정하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookStoryGenerator;
