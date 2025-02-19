import React, { useEffect, useRef } from 'react';
import CameraMicControls from './CameraMicControls';

function MyCamera({ streamManager, nickname, small = false }) {
    const videoRef = useRef();

    useEffect(() => {
        if (streamManager && videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return (
        <div
            className="flex flex-row gap-4 items-center justify-center relative"
            style={{
                height: small ? '200px' : '300px',
                width: small ? '250px' : 'auto',
            }}
        >
            <div
                className="relative bg-gray-200 items-center justify-center rounded-3xl"
                style={{
                    height: small ? '200px' : '300px',
                    width: small ? '250px' : 'auto',
                }}
            >
                <video ref={videoRef} autoPlay muted className="object-cover w-full h-full rounded-3xl" />
                <span className="absolute top-2 left-2 bg-yellow-300 text-black px-2 py-1 rounded-full text-sm font-bold">
                    {nickname}
                </span>
            </div>
            <CameraMicControls publisher={streamManager} small={small} />
        </div>
    );
}

export default MyCamera;
