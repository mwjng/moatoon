import React, { useRef } from 'react';
import WordButton from '../components/WordButton.js';
import Canvas from '../components/draw/Canvas.js';
import Navigation from '../components/Navigation.js';
import ChildImg from '../assets/child.svg';
import StoryCard from '../components/draw/StoryCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DrawingPage() {
    const navigate = useNavigate();
    const stageRef = useRef(null);

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
                        return `<polyline points="${points}" fill="none" stroke="black" stroke-width="2" />`;
                    })
                    .join('\n')}
            </svg>
        `;

        console.log('🔍 생성된 SVG 코드:', svgString); // 디버깅용 콘솔 출력

        //SVG 데이터를 Blob으로 변환
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const file = new File([blob], 'drawing.svg', { type: 'image/svg+xml' });

        //FormData 생성 후 파일 추가
        const formData = new FormData();
        formData.append('file', file);

        //API 요청 (cutId는 예시로 12 사용, 실제 값으로 변경 필요)
        const cutId = 1; // 실제 cutId 값으로 변경 필요
        try {
            const response = await axios.patch(`http://localhost:8080/cuts/save-final/${cutId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('서버 응답:', response.data);
            //alert('SVG 파일이 성공적으로 업로드되었습니다!');
        } catch (error) {
            console.error('업로드 실패:', error);
            //alert('업로드에 실패했습니다.');
        }
    };

    const handleTimeOut = () => {
        exportToSVGAndUpload();
        navigate('/session/draw-end');
    };

    return (
        <div className="h-screen bg-light-cream-yellow">
            <div className="w-full mb-5">
                <Navigation stage="drawing" onTimeOut={handleTimeOut} />
            </div>

            <div className="flex gap-4 p-5">
                <div className="w-72 mr-5">
                    <div className="rounded-lg overflow-hidden mb-4">
                        <img src={ChildImg} alt="참고 이미지" className="w-full" />
                        <WordButton color="bg-dark-yellow w-full mt-5" size="md">
                            지난 이야기 전체 보기
                        </WordButton>

                        <div className="relative w-full h-100 p-6 flex flex-col items-center mt-5">
                            <StoryCard />
                        </div>
                    </div>
                </div>
                <Canvas stageRef={stageRef} />
            </div>
            <button
                onClick={exportToSVGAndUpload}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
            >
                SVG로 내보내기
            </button>
        </div>
    );
}

export default DrawingPage;
