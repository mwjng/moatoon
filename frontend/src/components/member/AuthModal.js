import React from 'react';

export default function AuthModal(props) {
    return (
        <div
            style={{
                top: props.top ? 'calc(50% + 55px)' : '50%',
                padding: props.top ? '1.25rem  4rem' : '2.5rem 4rem',
            }}
            className="absolute  m-auto  bg-[#ffffffe4] text-black rounded-3xl left-[50%] -translate-x-1/2 -translate-y-1/2 flex gap-3 text-xl items-center flex-col
 overflow-y-auto max-h-[78%]"
        >
            <p className={props.top ? 'text-2xl' : 'text-3xl'}>{props.title}</p>
            {props.children}
        </div>
    );
}
