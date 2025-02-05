import React, { useState } from 'react';

function CameraMicControls() {
    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [guideOn, setGuideOn] = useState(true);

    const cameraIcon = cameraOn ? '📷' : '🚫📷';
    const cameraText = cameraOn ? 'on' : 'off';

    const micIcon = micOn ? '🎤' : '🚫🎤';
    const micText = micOn ? 'on' : 'off';

    const guideIcon = '📘';
    const guideText = guideOn ? 'on' : 'off';

    return (
        <div
            className="w-15 shadow-md items-center justify-center rounded-lg"
            style={{ height: '285px', backgroundColor: '#FDFCDC' }}
        >
            <button
                onClick={() => setCameraOn(!cameraOn)}
                className="flex flex-col items-center justify-center p-2 text-black"
            >
                <span className="text-1xl">{cameraIcon}</span>
                <span className="mt-1 text-sm">카메라</span>
                <span className="mt-1 text-sm">{cameraText}</span>
            </button>

            <button
                onClick={() => setMicOn(!micOn)}
                className="flex flex-col items-center justify-center text-black p-2"
            >
                <span className="text-1xl">{micIcon}</span>
                <span className="mt-1 text-sm">마이크</span>
                <span className="mt-1 text-sm">{micText}</span>
            </button>

            <button
                onClick={() => setGuideOn(!guideOn)}
                className="flex flex-col items-center justify-center text-black p-2"
            >
                <span className="text-1xl">{guideIcon}</span>
                <span className="mt-1 text-sm">
                    사용<br></br> 가이드
                </span>
                <span className="mt-1 text-sm">{guideText}</span>
            </button>
        </div>
    );
}

export default CameraMicControls;
