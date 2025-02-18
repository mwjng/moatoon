import React, { useEffect, useRef } from 'react';

function SubscriberVideo({ streamManager }) {
    const videoRef = useRef();
    let nickname = 'Unknown';

    if (streamManager) {
        try {
            const connectionData = streamManager.stream.connection.data;
            const parsedData = JSON.parse(connectionData);
            nickname = parsedData.clientData || '게스트';
        } catch (error) {
            console.error('닉네임 추출 실패', error);
        }
    }

    useEffect(() => {
        if (streamManager && videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return (
        <div
            className="rounded-3xl flex items-center justify-center bg-gray-300 text-black relative"
            style={{ width: '250px', height: '200px' }}
        >
            <video ref={videoRef} autoPlay className="object-cover w-full h-full rounded-3xl" />
            <span className="absolute top-2 left-2 bg-gray-100 text-black px-2 py-1 rounded-full text-sm font-bold">
                {nickname}
            </span>
        </div>
    );
}

export default SubscriberVideo;
