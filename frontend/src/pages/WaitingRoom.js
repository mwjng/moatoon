import React from 'react';
import Navigation from '../components/Navigation';
import MyCamera from '../components/MyCamera';
import OtherCameras from '../components/OtherCameras';
import CameraMicControls from '../components/CameraMicControls';
import BookDisplay from '../components/BookDisplay';
import FooterNotice from '../components/FooterNotice';

function WaitingRoom() {
    return (
        <div className="min-h-screen bg-custom-blue flex flex-col items-center p-4 space-y-4">
            <Navigation />
            <div className="justify-center items-center gap-4">
                <div
                    className="flex flex-row gap-4 justify-center items-center bg-custom-blue my-8"
                    style={{ width: '1200px' }}
                >
                    <div
                        className="flex flex-col bg-white rounded-3xl p-4 shadow-md justify-center items-center"
                        style={{ width: '900px', height: '600px' }}
                    >
                        <div className="flex flex-row gap-4 items-center justify-center" style={{ height: '300px' }}>
                            <MyCamera />
                            <CameraMicControls />
                        </div>
                        <OtherCameras />
                    </div>
                    <BookDisplay />
                </div>
                <div className="flex items-center justify-center">
                    <FooterNotice />
                </div>
            </div>
        </div>
    );
}

export default WaitingRoom;
