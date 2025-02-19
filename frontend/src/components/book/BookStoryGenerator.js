import React, { useEffect, useState } from 'react';
import OpenAI from 'openai';
import { checkCanJoin, fetchRandomWords, sendStoryToBackend } from '../../api/party';
import Loading from '../Loading';
import StoryTag from '../StoryTag';
import AlertModal from '../common/AlertModal';

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
    onComplete,
}) => {
    const [currentStory, setCurrentStory] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [words, setWords] = useState([]);
    const [partyId, setPartyId] = useState(null);
    const [isCreatingParty, setIsCreatingParty] = useState(false);
    const [showBookDetail, setShowBookDetail] = useState(false);
    const [regenerateCount, setRegenerateCount] = useState(0);
    const [modalState, setModalState] = useState(false);
    const [modalText, setModalText] = useState('');

    const fetchWords = async () => {
        try {
            const data = await fetchRandomWords(difficulty, episodeLength);
            if (!data || !data.words || data.words.length === 0) {
                throw new Error('단어를 가져오는 데 실패했습니다.');
            }
            setWords(data.words); // ✅ 상태 업데이트
            console.log('초기단어 가지고 온 꼴 : ', data.word);
        } catch (error) {
            console.error('단어 가져오기 실패:', error.message);
        }
    };

    useEffect(() => {
        console.log('무드 in BookStoryGenerator:', mood.keyword);
        console.log('장르 in BookStoryGenerator:', genre.keyword);
        console.log('테마   in BookStoryGenerator:', theme.keyword);
        console.log('난이도   in BookStoryGenerator:', level);
        console.log('챕터 수  in BookStoryGenerator:', episodeLength);
        
    }, [mood, genre, theme]);

    useEffect(() => {
        fetchWords();
        console.log('단어셋 가져오는데 들어가는 난이도:', difficulty);
        console.log('단어셋 가져오는데 들어가는 챕터수:', episodeLength);
    }, [difficulty, episodeLength]);

    useEffect(() => {
        if (words.length > 0) {
            generateStory();
        }
    }, [words]);

  

    const generateStory = async () => {

        const payload = {
            startDate,
            episodeLength,
            time,
            dayWeek: convertDayOfWeekToEnum(dayOfWeek),
            participatingChildren,
        };
        try {
            await checkCanJoin(payload);
        } catch (err) {
            if (err.response.data.code == 2007) {
                setModalText('해당 시간 그림책에 참여중인 아동이 있습니다.');
                setModalState(true);
                return;
            }
        }
        if (currentStory) {
            setRegenerateCount(prev => prev + 1);
        }

        setIsGenerating(true);
        try {
            if (!words || words.length === 0) {
                throw new Error('단어 리스트가 없습니다. 먼저 단어를 가져와야 합니다.');
            }

            const wordListWithId = words
                .map((w, idx) => `words[${idx}] = {"id": ${w.wordId}, "word": "${w.word}"}`)
                .join('\n');

            console.log('가져온 단어 셋 : ', words);

            const prompt = `
    동화책 제목: 생성된 이야기와 어울리는 동화책 제목을 지어줘. 
    
    역할: ${mood.keyword} 분위기의 ${theme.keyword} 테마 ${genre.keyword} 동화를 작성하는 동화 작가.
    
    - 난이도: (${level}단계).
    - 개요:
      - 이야기의 도입부만 제공하며, 전체 내용을 밝히지 않고 궁금증을 유발해야 함.
      - 반드시 ${mood.keyword} 분위기가 느껴지도록 감정을 표현해야 함.
      - ${theme.keyword} 테마를 중심으로 사건이 시작되는 배경을 설정해야 함.
      - ${genre.keyword} 장르의 특징을 반영하여 서사를 전개해야 함.
    
    - 챕터: 총 ${episodeLength}개로 구성됨. 반드시 ${episodeLength}개의 챕터를 만들어야함
    - 각 챕터는 4개의 문장으로 이루어짐.
    - 이야기 생성에 사사용할 단어 리스트 : ${wordListWithId}
    - 각 문장에는 위에서 *언급된 단어리스트 중 한 단어씩*은 반드시 포함해야 하며, **해당 단어가 자연스럽게 문맥에 녹아들도록 표현해야 함.**
    - 각 챕터 안에서 사용된 단어는 챕터 위에 단어
    - 첫 문장부터 마지막 문장까지 **기승전결**이 명확하게 드러나야 함.
    
    **[스토리 구조 강화]**
    - ${mood.keyword} 분위기를 유지하기 위해 감정을 묘사하는 표현을 적극 활용해야 함.
    - ${theme.keyword} 테마를 반영하기 위해 **등장인물의 행동, 배경 설정, 사건 전개**가 일관되게 연결되어야 함.
    - ${genre.keyword} 장르의 특성을 반영하여 **스토리의 전개 방식(예: 판타지라면 신비로운 요소, 일상이라면 현실적인 대화 등)을 맞춰야 함.**
    
    **[단어 사용 규칙]**
    - 각 문장에서 반드시 지정된 단어를 포함해야 함.
    - 단어는 강제적으로 들어가지만, **문장의 자연스러운 흐름을 방해하지 않도록 사용해야 함.**
    - words[0]은 sentence[0]에서 사용된다.
    - words[1]은 sentence[1]에서 사용된다.
    - words[2]은 sentence[2]에서 사용된다.
    - words[3]은 sentence[3]에서 사용된다.
    
    **[JSON 출력 형식]**
    - JSON 형식으로 반환해야 함.
    - "overview"에는 ${mood.keyword} 분위기와 ${theme.keyword} 테마가 반영된 도입부를 포함해야 함.
    - "chapters"의 각 문장도 ${genre.keyword} 장르의 스타일을 따라야 함.
    
    ### JSON 출력 예시:
    {
      "title": "따뜻한 오후의 마법",
      "overview": [
        "햇살이 가득한 오후, 작은 마을에서 특별한 일이 벌어졌어요.",
        "한 아이가 그림을 그리고 있었는데, 그림 속에서 반짝이는 빛이 새어 나왔어요.",
        "그 빛을 따라가 보니, 마법 같은 세계가 펼쳐졌어요.",
        "과연 아이는 이 세계에서 어떤 경험을 하게 될까요?"
      ],
      "chapters": [
        {
          "title": "CH1",
          "words": [
            { "id": 59, "word": "쉬다" },
            { "id": 12, "word": "그림" },
            { "id": 33, "word": "책" },
            { "id": 4, "word": "고기" }
          ],
          "sentences": [
            "햇볕 아래에서 쉬던 아이는 그림을 그리고 있었어요.",
            "그림 속에서는 작은 마법의 책이 빛나고 있었어요.",
            "아이의 눈앞에 커다란 고기 요리가 떠올랐어요.",
            "그 순간, 책이 번쩍 빛나며 무언가를 알려주려는 듯 했어요."
          ]
        },
        {
          "title": "CH2",
          "words": [
            { "id": 5, "word": "반갑다" },
            { "id": 6, "word": "동요" },
            { "id": 7, "word": "버스" },
            { "id": 8, "word": "배" }
          ],
          "sentences": [
            "문을 열자 반갑게 웃는 친구들이 있었어요.",
            "그들은 동요를 부르며 신나는 시간을 보냈어요.",
            "잠시 후, 함께 버스를 타고 작은 섬으로 떠났어요.",
            "배를 타고 가는 길, 아이들은 설레는 표정을 감추지 못했어요."
          ]
        }
      ]
    }
      *부가설명 말고, json으로 형식만 응답해.*
    `;

            console.log('최종프롬프트 : ', prompt);

            // 🔹 OpenAI 요청
            const response = await openai.chat.completions.create({
                // model: "gpt-3.5-turbo",
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
            });

            let responseText = response.choices[0]?.message?.content;

            if (!responseText) {
                throw new Error('OpenAI 응답이 비어 있습니다.');
            }
            console.log('AI 응답 원본:', responseText);
            responseText = responseText.replace(/```json\n?|\n?```/g, '').trim();

            let generatedStory;
            try {
                generatedStory = JSON.parse(responseText);
                console.log('JSON 변환 성공:', generatedStory);
            } catch (jsonError) {
                console.error('JSON 파싱 오류:', jsonError);
                throw new Error('OpenAI에서 올바른 JSON 응답을 받지 못했습니다.');
            }

            // overview를 하나의 문자열로 변환
            if (Array.isArray(generatedStory.overview)) {
                generatedStory.overview = generatedStory.overview.join(' ');
            }

            setCurrentStory(generatedStory);
        } catch (error) {
            console.error('스토리 생성 오류:', error.message);
        } finally {
            setIsGenerating(false);
        }
    };

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

    // 🔹 표지 이미지 생성 및 최종 데이터 전송
    const handleDecide = async () => {
        setIsGeneratingImage(true);
        setIsCreatingParty(true);

        try {
            const coverPrompt = `${currentStory.overview} : 참고 내용을 바탕으로 텍스트 없이, 동화 스타일의 일러스트 이미지를 생성해줘.`;
            const response = await openai.images.generate({
                model: 'dall-e-3',
                prompt: coverPrompt,
                n: 1,
                size: '1024x1024',
            });

            const generatedCover = response.data[0]?.url || '';
            if (!generatedCover) throw new Error('이미지 생성 실패');

            const formattedDayOfWeek = convertDayOfWeekToEnum(dayOfWeek);
            const isPublic = publicStatus === '공개';

            const payload = {
                startDate,
                level: parseInt(level.replace('Lv', '').trim()),
                episodeLength,
                time,
                dayWeek: formattedDayOfWeek,
                genre: genre.id,
                mood: mood.id,
                theme: theme.id,
                publicStatus: isPublic,
                participatingChildren,
                story: currentStory,
            };

            const result = await sendStoryToBackend(payload, generatedCover);
            console.log('스토리 전송 성공', result); //result = partyId
            setPartyId(result);

            if (result) {
                onComplete(result); // 파티 생성 성공 시 handleStoryComplete 호출
                setTimeout(() => onClose(), 0);
            }
        } catch (error) {
            console.error('최종 전송 오류:', error.message);
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

    const closeModal = () => {
        setModalState(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            {isGenerating && <Loading />}
            {(isGeneratingImage || isCreatingParty) && <Loading />}
            <div className="w-[90%] md:w-[80%] lg:w-[70%] bg-blue-100 rounded-lg shadow-lg h-[90vh] flex flex-col">
                {/* 헤더 영역 - 고정 높이 */}
                <div className="p-4 border-b bg-blue-100">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-center flex-grow">📖 스토리라인</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </div>
                </div>

                {/* 컨텐츠 영역 - 남은 공간 모두 차지하고 스크롤 가능 */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        {isGenerating ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-lg">스토리를 생성하고 있습니다...</p>
                            </div>
                        ) : (
                            <>
                                {currentStory && (
                                    <div className="mb-4 p-3 border border-gray-300 rounded bg-white">
                                        <h2 className="text-xl text-center mb-2">{currentStory.title}</h2>
                                        <div className="mb-3 flex justify-center">
                                            <StoryTag label="분위기" value={mood.keyword} />
                                            <StoryTag label="테마" value={theme.keyword} />
                                            <StoryTag label="장르" value={genre.keyword} />
                                            <StoryTag label="레벨" value={level} />
                                        </div>
                                        {/* <h3 className="font-bold mb-2 text-base">개요</h3> */}
                                        <p className="text-sm">{currentStory.overview}</p>
                                    </div>
                                )}

                                {currentStory?.chapters?.map((chapter, index) => (
                                    <div key={index} className="mb-4 p-3 border border-gray-300 rounded bg-white">
                                        <h3 className="font-bold mb-2 text-base">에피소드 {index + 1}</h3>
                                        <p className="text-sm mb-2">
                                            <strong>사용 단어:</strong> {chapter.words.map(w => w.word).join(', ')}
                                        </p>
                                        {chapter.sentences.map((sentence, idx) => (
                                            <p key={idx} className="text-sm mb-1">
                                                {sentence}
                                            </p>
                                        ))}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* 하단 버튼 영역 - 고정 높이 */}
                <div className="p-4 border-t bg-blue-100">
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => {
                                // generateStory();
                                fetchWords();
                                // setRegenerateCount(prev => prev + 1);
                            }}
                            disabled={isGenerating || regenerateCount >= 3}
                            className="bg-[#FFE156] hover:bg-[#FFD156] px-4 py-2 rounded-lg text-black text-sm disabled:opacity-50"
                        >
                            재생성하기 ({regenerateCount + 1}/3)
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
            <AlertModal modalState={modalState} text={modalText} closeHandler={closeModal} />
        </div>
    );
};

export default BookStoryGenerator;
