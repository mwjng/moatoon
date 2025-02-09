import React from 'react';

export default function RegistInput(props) {
    return (
        <>
            {props.inputs.map(input => (
                <div key={input.id} className="relative">
                    <input
                        type={input.type}
                        id={input.id}
                        placeholder={input.value}
                        className="rounded-3xl shadow-md p-1 pr-3 pl-3 outline-none border-[2px] focus:border-[#FFBD73] bg-white"
                        required={input.required}
                        disabled={input.disabled}
                        style={{ width: props.width }}
                        onChange={e => props.changeFunction(input.id, e.target.value)}
                    />
                    {input.id === 'loginId' && (
                        <button
                            onClick={() => props.checkDuplicate(input.value)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#8ECAE6] text-white px-2 py-1 rounded-xl text-xs"
                        >
                            중복 확인
                        </button>
                    )}
                    <p className="absolute text-xs left-[15px]" style={{ color: input.cmtColor }}>
                        {input.comment}
                    </p>
                </div>
            ))}
        </>
    );
}
