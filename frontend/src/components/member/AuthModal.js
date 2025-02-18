import React from 'react';

export default function AuthModal(props) {
    return (
        <div
            style={{
                top: props.top || props.checkInfo ? 'calc(50% + 55px)' : '50%',
                padding: props.top ? '1.25rem  5rem' : props.checkInfo ? '3rem 5rem' : '2.5rem 4rem',
                maxHeight: props.top ? '74%' : '80%',
            }}
            className="absolute  m-auto  bg-[#ffffffe4] text-black rounded-3xl left-[50%] -translate-x-1/2 -translate-y-1/2 flex gap-4 text-xl items-center flex-col
 overflow-y-auto overflow-x-hidden"
        >
            <p className="text-3xl">{props.title}</p>
            {props.children}
        </div>
    );
}
