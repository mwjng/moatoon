import React, { useEffect, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import Navigation from '../../components/Navigation';
import MyCamera from '../../components/MyCamera';
import CameraMicControls from '../../components/CameraMicControls';
import BookDisplay from '../../components/BookDisplay';
import FooterNotice from '../../components/FooterNotice';
import { getSessionToken } from '../../api/room';
import base64 from 'base-64';
import { useOpenVidu } from '../../utils/OpenviduContext';

const APPLICATION_SERVER_URL = 'http://localhost:8080/schedules';

function WaitingRoom({ scheduleId, bookTitle, sessionTime, serverTime }) {
    const { session, publisher, subscribers, nickname, leaveSession } = useOpenVidu();

    return (
        <div className="min-h-screen bg-custom-blue flex flex-col items-center p-4 space-y-4">
            <Navigation
                stage={'waiting'}
                leaveSession={leaveSession}
                stageDuration={10}
                sessionStartTime={sessionTime}
                serverTime={serverTime}
                bookTitle={bookTitle}
                onTimeOut={handleTimeOut}
            />
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
                            <MyCamera streamManager={publisher} nickname={nickname} />
                            <CameraMicControls publisher={publisher} />
                        </div>
                        <OtherCameras subscribers={subscribers} />
                    </div>
                    <BookDisplay bookInfo={bookInfo} />
                </div>
                <div className="flex items-center justify-center">
                    <FooterNotice />
                </div>
            </div>
        </div>
    );
}

export default WaitingRoom;
