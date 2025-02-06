import React, { useEffect, useRef } from 'react';

function OtherCameras({ subscribers }) {
    return (
        <div className="flex flex-row mt-4 grid grid-cols-3 gap-8 content-evenly mx-auto">
            {subscribers.map((subscriber, index) => (
                <SubscriberVideo key={index} streamManager={subscriber} />
            ))}
        </div>
    );
}

function SubscriberVideo({ streamManager }) {
    const videoRef = useRef();

    useEffect(() => {
        if (streamManager && videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return (
        <div
            className="rounded-3xl flex items-center justify-center bg-gray-300 text-black"
            style={{ width: '250px', height: '200px' }}
        >
            <video ref={videoRef} autoPlay className="object-cover w-full h-full rounded-3xl" />
        </div>
    );
}

export default OtherCameras;
