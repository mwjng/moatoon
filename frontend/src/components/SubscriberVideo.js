import React, { useEffect, useRef, useState } from 'react';

function SubscriberVideo({ streamManager, small = false }) {
    const videoRef = useRef();
    const [nickname, setNickname] = useState('게스트');

    if (streamManager) {
        try {
            const connectionData = streamManager.stream.connection.data;
            const parsedData = JSON.parse(connectionData);
            setNickname(parsedData.clientData || '게스트');
        } catch (error) {
            console.error('닉네임 추출 실패', error);
        }
    }

    useEffect(() => {
        if (streamManager && videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
            setNickname(streamManager.stream.connection.data.clientData);
        }
    }, [streamManager]);

    return (
        <div
            className="rounded-3xl flex items-center justify-center bg-gray-300 text-black relative"
            style={{
                height: small ? '100px' : '200px',
                width: small ? '150px' : '250px',
            }}
        >
            <video ref={videoRef} autoPlay className="object-cover w-full h-full rounded-3xl" />
            <span className="absolute top-2 left-2 bg-gray-100 text-black px-2 py-1 rounded-full text-sm font-bold">
                {nickname}
            </span>
        </div>
    );
}

export default SubscriberVideo;
