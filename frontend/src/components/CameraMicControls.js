import React, { useEffect, useRef, useState } from 'react';
import cameraOnImg from '../assets/icon-video-camera.png';
import cameraOffImg from '../assets/icon-video-off.png';
import micOnImg from '../assets/icon-microphone-black-shape.png';
import micOffImg from '../assets/icon-player.png';
import guideOnImg from '../assets/icon-switch-on.png';
import guideOffImg from '../assets/icon-switch-off.png';

const GUIDE_ENABLED_KEY = 'guideEnabled';

function CameraMicControls({ publisher }) {
    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [guideOn, setGuideOn] = useState(() => {
        const savedState = localStorage.getItem(GUIDE_ENABLED_KEY);
        return savedState === null ? true : JSON.parse(savedState);
    });
    const streamRef = useRef(null);

    useEffect(() => {
        async function initMediaStream() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                streamRef.current = stream;
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        }

        initMediaStream();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const toggleCamera = () => {
        const videoTrack = publisher.stream.getMediaStream().getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !cameraOn;
            setCameraOn(!cameraOn);
        }
    };

    const toggleMic = () => {
        const audioTrack = publisher.stream.getMediaStream().getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !micOn;
            setMicOn(!micOn);
        }
    };

    const toggleGuide = () => {
        const newState = !guideOn;
        setGuideOn(newState);
        localStorage.setItem(GUIDE_ENABLED_KEY, JSON.stringify(newState));

        // 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('localStorageChange', {
            detail: {
                key: GUIDE_ENABLED_KEY,
                value: JSON.stringify(newState)
            }
        }));
    };

    const cameraIcon = cameraOn ? cameraOnImg : cameraOffImg;
    const cameraText = cameraOn ? 'on' : 'off';

    const micIcon = micOn ? micOnImg : micOffImg;
    const micText = micOn ? 'on' : 'off';

    const guideIcon = guideOn ? guideOnImg : guideOffImg;
    const guideText = guideOn ? 'on' : 'off';

    return (
        <div
            className="w-15 shadow-md items-center justify-center rounded-lg"
            style={{ height: '285px', backgroundColor: '#FDFCDC' }}
        >
            <button onClick={toggleCamera} className="flex flex-col items-center justify-center p-1 text-black">
                <img src={cameraIcon} alt="camera-icon" className="w-8 h-8" />
                <span className="mt-1 text-sm">카메라</span>
                <span className="mt-1 text-sm">{cameraText}</span>
            </button>

            <button onClick={toggleMic} className="flex flex-col items-center justify-center text-black p-1">
                <img src={micIcon} alt="mic-icon" className="w-8 h-8" />
                <span className="mt-1 text-sm">마이크</span>
                <span className="mt-1 text-sm">{micText}</span>
            </button>

            <button
                onClick={toggleGuide}
                className="flex flex-col items-center justify-center text-black p-1"
            >
                <img src={guideIcon} alt="guide-icon" className="w-8 h-8" />
                <span className="mt-1 text-sm">
                    사용
                    <br />
                    가이드
                </span>
                <span className="mt-1 text-sm">{guideText}</span>
            </button>
        </div>
    );
}

export default CameraMicControls;
