import React, { useEffect, useRef } from 'react';

function MyCamera({ streamManager, nickname }) {
    const videoRef = useRef();

    useEffect(() => {
        if (streamManager && videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return (
        <div className="w-96 h-72 relative bg-gray-200 items-center justify-center rounded-3xl">
            <video ref={videoRef} autoPlay muted className="object-cover w-full h-full rounded-3xl" />
            <span className="absolute top-2 left-2 bg-yellow-300 text-black px-2 py-1 rounded-full text-sm font-bold">
                {nickname}
            </span>
        </div>
    );
}

export default MyCamera;
