import React from 'react';
import WordButton from '../components/WordButton.js';
import Canvas from '../components/draw/Canvas.js';
import Navigation from '../components/Navigation.js';
import ChildImg from '../assets/child.svg';
import StoryCard from '../components/draw/StoryCard';

function DrawingPage() {
    return (
        <div className="h-screen bg-light-cream-yellow">
            <div className="w-full mb-5">
                <Navigation stage="drawing" />
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
                <Canvas />
            </div>
        </div>
    );
}

export default DrawingPage;
