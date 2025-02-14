import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import WordButton from '../WordButton.js';
import Canvas from '../draw/Canvas.js';
import ChildImg from '../../assets/child.svg';
import StoryCard from '../../components/draw/StoryCard.js';
import { authInstance } from '../../api/axios';

const Drawing = forwardRef(({ toggleView, cutsInfo, userId }, ref) => {
    const stageRef = useRef(null);
    //const [userId, setUserId] = useState(3);
    console.log(userId);
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

    return (
        <div className="h-screen bg-light-cream-yellow">
            <div className="flex gap-4 p-5">
                <div className="w-72 mr-5">
                    <div className="rounded-lg overflow-hidden mb-4">
                        <img src={ChildImg} alt="참고 이미지" className="w-full" />
                        <WordButton color="bg-dark-yellow w-full mt-5" size="md">
                            지난 이야기 전체 보기
                        </WordButton>

                        <div className="relative w-full h-100 p-6 flex flex-col items-center mt-5">
                            <StoryCard story={cutsInfo} />
                        </div>
                    </div>
                </div>
                <div className="relative w-full h-full">
                    <Canvas
                        stageRef={stageRef}
                        toggleView={toggleView}
                        partyId={partyId}
                        cutId={cutId}
                        cutIds={cutIds}
                        userStory={userStory}
                    />
                </div>
            </div>
        </div>
    );
});

export default Drawing;
