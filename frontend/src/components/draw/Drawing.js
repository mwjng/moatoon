import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import WordButton from '../WordButton.js';
import Canvas from '../draw/Canvas.js';
import ChildImg from '../../assets/child.svg';
import StoryCard from '../../components/draw/StoryCard.js';
import { authInstance } from '../../api/axios';
import AudioPlayer from '../../components/audio/AudioPlayer';
import MyCamera from '../MyCamera.js';
import CameraCarousel from './CameraCarousel.js';

const Drawing = forwardRef(
    (
        {
            toggleView,
            cutsInfo,
            userId,
            sendReady,
            isFirstDrawingVisit,
            setIsFirstDrawingVisit,
            publisher,
            nickname,
            readyStatus,
            subscribers,
        },
        ref,
    ) => {
        // 페이지 진입 시 Drawing 방문 상태 업데이트
        useEffect(() => {
            setIsFirstDrawingVisit(false);
        }, []);

        const stageRef = useRef(null);
        const partyId = cutsInfo[0].partyId;
        const cutIds = cutsInfo.map(item => item.cutId);
        const cutId = cutsInfo.find(item => item.memberId === userId)?.cutId;
        const userStory = cutsInfo.filter(cut => cut.memberId === userId);

        // SVG 변환 및 다운로드 함수
        const exportToSVGAndUpload = async () => {
            if (!stageRef.current) return;

            const stage = stageRef.current;
            const svgString = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${stage.width()}" height="${stage.height()}">
                ${stage
                    .find('Line')
                    .map(line => {
                        const points = line.attrs.points.join(' ');
                        const stroke = line.attrs.stroke || 'black'; // 기본 선 색을 black으로 설정
                        const strokeWidth = line.attrs.strokeWidth || 2; // 기본 선 굵기를 2로 설정
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

        // handleTimeOut 함수를 외부에서 호출할 수 있도록 설정
        useImperativeHandle(ref, () => ({
            exportToSVGAndUpload,
        }));

        const viewEbook = () => {
            window.open(`/ebook/${partyId}`, '_blank');
        };

        return (
            <div className="h-screen bg-light-cream-yellow flex justify-center items-center p-0 -mt-12 pr-16">
                <AudioPlayer audioType="MYCUT" isOn={isFirstDrawingVisit} />
                <div className="flex flex-col justify-center items-center w-full max-w-7xl px-0">
                    {/* Sidebar and Canvas container */}
                    <div className="flex justify-center items-center w-full">
                        {/* Sidebar on the left */}
                        <div className="w-64 mr-8 flex-shrink-0 flex flex-col">
                            <div className="rounded-lg mb-4 flex flex-col space-y-6">
                                {/* Camera component */}
                                <div className="ml-8">
                                    <CameraCarousel
                                        publisher={publisher}
                                        subscribers={subscribers}
                                        nickname={nickname}
                                    />
                                </div>

                                {/* Ebook button with increased margin to avoid overlap */}
                                <div className="mt-4">
                                    <WordButton onClick={viewEbook} color="bg-dark-yellow w-full" size="md">
                                        지난 이야기 전체 보기
                                    </WordButton>
                                </div>

                                {/* StoryCard with proper spacing */}
                                <div className="w-full">
                                    <StoryCard story={cutsInfo} />
                                </div>
                            </div>
                        </div>

                        {/* Canvas in the center */}
                        <div className="flex-grow-0 flex items-center mb-12 pb-12">
                            <Canvas
                                sendReady={sendReady}
                                stageRef={stageRef}
                                toggleView={toggleView}
                                partyId={partyId}
                                cutId={cutId}
                                cutIds={cutIds}
                                userStory={userStory}
                                readyStatus={readyStatus}
                            />
                        </div>
                    </div>
                </div>
                {/* SVG 내보내기 버튼 추가
                <div className="flex justify-center mt-5">
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                        onClick={exportToSVGAndUpload}
                    >
                        SVG 내보내기
                    </button>
                </div> */}
            </div>
        );
    },
);

export default Drawing;
