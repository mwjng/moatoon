import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation.js';
import bbi from '../../assets/bbi_normal.png';
import { authInstance } from '../../api/axios';
import CutCard from '../../components/CutSvgCard.js';
import WordButton from '../../components/WordButton.js';
import SubscriberVideo from '../../components/SubscriberVideo.js';
import MyCamera from '../../components/MyCamera.js';
import AudioPlayer from '../../components/audio/AudioPlayer';
import { useSelector } from 'react-redux';

const DrawingEndPage = ({ scheduleId, sessionStageData, onTimeout, publisher, subscribers, nickname }) => {
    const [finalCuts, setFinalCuts] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 버튼 활성화 상태 관리

    const { lines, undoneLines } = useSelector(state => state.canvas);
    //console.log(lines);

    const cutsState = useSelector(state => state.cuts);

    const userId = useSelector(state => state.user.userInfo.id);
    const cutId = cutsState.cuts.find(item => item.memberId === userId)?.cutId;
    console.log(cutId);

    //완성된 네컷 이미지 불러오기
    useEffect(() => {
        const uploadAndFetch = async () => {
            await exportToSVGAndUpload(); // SVG 변환 및 업로드
            await fetchPictures(); // 업로드 후 이미지 가져오기
        };

        uploadAndFetch();

        // 1분 후에 버튼 활성화
        const timer = setTimeout(() => {
            console.log('버튼 활성화');
            setIsButtonDisabled(false);
        }, 60000);

        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 제거
    }, [scheduleId]);

    const handleClick = () => {
        if (typeof onTimeout === 'function') {
            console.log('마무리 버튼 클릭');
            onTimeout();
        }
    };

    const fetchPictures = async () => {
        try {
            const response = await authInstance.get(`/cuts/final/${scheduleId}`);

            setFinalCuts(response.data);
        } catch (error) {
            console.error('그림 데이터를 불러오는 중 오류 발생:', error);
        }
    };

    const exportToSVGAndUpload = async () => {
        const svgString = `
            <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
                ${lines
                    .map(line => {
                        const points = line.points.join(' ');
                        const stroke = line.color || 'black'; // 선 색은 line 객체에서 가져옴
                        const strokeWidth = line.width || 2; // 선 굵기는 line 객체에서 가져옴
                        return `<polyline points="${points}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
                    })
                    .join('\n')}
            </svg>
            `;

        // SVG 데이터를 Blob으로 변환
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const file = new File([blob], 'drawing.svg', { type: 'image/svg+xml' });

        // FormData 생성 후 파일 추가
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await authInstance.patch(`/cuts/save-final/${cutId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('서버 응답:', response.data);
            // alert('SVG 파일이 성공적으로 업로드되었습니다!');
        } catch (error) {
            console.error('업로드 실패:', error);
            // alert('업로드에 실패했습니다.');
        }
    };

    //Openvidu 세션 훅 사용
    // const { session, publisher, subscribers, joinSession, leaveSession, nickname } = useSession();

    // useEffect(() => {
    //     joinSession();
    //     return () => leaveSession();
    // }, []);

    return (
        <div className="min-h-screen bg-light-cream-yellow">
            <AudioPlayer audioType="SHARING" />
            <div className="w-full">
                <Navigation
                    stage="endDrawing"
                    stageDuration={30} // ! DrawingEndPage Duration은 3*60=180
                    sessionStartTime={sessionStageData?.sessionStartTime}
                    serverTime={sessionStageData?.serverTime}
                    onTimeOut={onTimeout}
                />
            </div>

            <div className="flex p-5">
                <div className="flex flex-col mt-4 gap-8 content-evenly">
                    <MyCamera streamManager={publisher} nickname={nickname} />
                    {subscribers.map((subscriber, index) => (
                        <SubscriberVideo key={index} streamManager={subscriber} />
                    ))}
                </div>

                <div className="max-w-2xl mx-auto flex flex-col items-center">
                    <div className="comic-grid grid grid-cols-2 gap-4 border-2 border-black p-4 bg-white border-solid mb-2">
                        {finalCuts.map(cut => (
                            <div
                                key={cut.id}
                                className="comic-cut border-solid border-2 border-black p-1 overflow-hidden"
                            >
                                <CutCard item={cut} />
                            </div>
                        ))}
                    </div>

                    <WordButton
                        color={isButtonDisabled ? 'bg-gray-400' : 'bg-light-orange'}
                        textColor="text-white"
                        size="small"
                        textSize="large"
                        onClick={handleClick}
                        disabled={isButtonDisabled}
                    >
                        마무리
                    </WordButton>
                </div>
                <img src={bbi} className="absolute w-36 bottom-0 right-0 object-contain" alt="bbi character" />
            </div>
        </div>
    );
};

export default DrawingEndPage;
