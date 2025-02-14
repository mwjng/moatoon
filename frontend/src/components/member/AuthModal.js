import React from 'react';

export default function AuthModal(props) {
    return (
        <div
            className="absolute  m-auto p-10 bg-[#ffffffe4] text-black rounded-3xl pr-[4rem] pl-[4rem] left-[50%] -translate-x-1/2 -translate-y-1/2 flex gap-3 text-xl items-center flex-col
"
            style={{ top: props.top ? 'calc(50% + 55px)' : '50%' }}
        >
            <p className="text-3xl">{props.title}</p>
            {props.children}
        </div>
    );
}
