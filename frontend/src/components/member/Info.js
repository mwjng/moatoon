import React from 'react';
import { TbExclamationCircle } from 'react-icons/tb';

export default function Info(props) {
    return (
        <div>
            <div
                className="absolute bottom-10 m-auto p-3 bg-[#ffffff99] text-black rounded-3xl pr-5 pl-5 left-[50%] -translate-x-[50%] flex gap-2 text-xl items-center
"
            >
                <TbExclamationCircle style={{ color: '#fddb53' }} />
                <p>{props.message}</p>
            </div>
        </div>
    );
}
