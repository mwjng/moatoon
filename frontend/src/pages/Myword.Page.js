import React from 'react';
import Navigation from '../components/Navigation';

const MyWordPage = () => {
    return (
        <div className="bg-[#FDFFE9] h-screen flex flex-col">
            <Navigation />
            <div className="relative h-full">
                <div className="bg-[#F3F8C0] w-full absolute h-1/2 bottom-0"></div>
            </div>
        </div>
    );
};

export default MyWordPage;
