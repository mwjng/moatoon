import React from 'react';
import result from '../assets/kado-random.png';
import pop from '../assets/random-pop.gif';

export default function RandomResult(props) {
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-[#00000088] flex justify-center items-center z-[99999]">
            <div className="relative">
                <img src={result} className="w-[80%] m-auto h-auto translate-y-[20%]" />
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  px-6 py-3  text-7xl font-bold text-black ">
                    {props.cut}번 컷 당첨!
                </p>
            </div>
            <img src={pop} className="absolute left-0 bottom-0 -translate-x-6 translate-y-6 rotate-45  " />
            <img src={pop} className="absolute right-0 bottom-0 translate-x-6 translate-y-6 -rotate-45  " />
        </div>
    );
}
