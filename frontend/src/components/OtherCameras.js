<<<<<<< Updated upstream
import React, { useEffect, useRef } from 'react';

function OtherCameras({ subscribers }) {
    console.log(subscribers);
    return (
        <div className="flex flex-row mt-4 grid grid-cols-3 gap-8 content-evenly mx-auto">
            {subscribers.map((subscriber, index) => (
                <SubscriberVideo key={index} streamManager={subscriber} />
=======
import React from 'react';

function OtherCameras() {
    const otherUsers = ['닉네임1', '닉네임2', '아직 친구가 참여하지 않았어요'];

    return (
        <div className="flex flex-row mt-4 grid grid-cols-3 gap-2">
            {otherUsers.map((user, index) => (
                <div key={index} className="rounded-3xl h-12 flex items-center justify-center bg-gray-300 text-black">
                    {user}
                </div>
>>>>>>> Stashed changes
            ))}
        </div>
    );
}

<<<<<<< Updated upstream
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

=======
>>>>>>> Stashed changes
export default OtherCameras;
