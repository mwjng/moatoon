import React from 'react';

export default function AuthModal(props) {
    return (
        <div
            className="absolute top-[50%] m-auto p-10 bg-[#ffffffe4] text-black rounded-3xl pr-[4rem] pl-[4rem] left-[50%] -translate-x-1/2 -translate-y-1/2 flex gap-3 text-xl items-center flex-col
"
        >
            <p className="text-3xl">{props.title}</p>
            {props.children}
        </div>
    );
}
