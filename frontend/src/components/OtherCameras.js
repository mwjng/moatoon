import React from 'react';

function OtherCameras() {
    const otherUsers = ['닉네임1', '닉네임2', '아직 친구가 참여하지 않았어요'];

    return (
        <div className="flex flex-row mt-4 grid grid-cols-3 gap-8 content-evnely mx-auto">
            {otherUsers.map((user, index) => (
                <div
                    key={index}
                    className="rounded-3xl h-12 flex items-center justify-center bg-gray-300 text-black"
                    style={{ width: '250px', height: '200px' }}
                >
                    {user}
                </div>
            ))}
        </div>
    );
}

export default OtherCameras;
