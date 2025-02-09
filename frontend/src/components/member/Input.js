import React from 'react';

export default function Input(props) {
    return (
        <>
            {props.inputs.map(input => (
                <input
                    type={input.type}
                    id={input.id}
                    placeholder={input.value}
                    className="rounded-3xl shadow-md p-1 pr-3 pl-3 outline-none border-[2px] focus:border-[#FFBD73]"
                    required={input.required}
                    disabled={input.disabled}
                    style={{ backgroundColor: input.color, width: props.width }}
                    onChange={e => props.changeFunction(input.id, e.target.value)}
                />
            ))}
        </>
    );
}
