import React from 'react';

export default function ModifyInput(props) {
    return (
        <>
            {props.inputs.map(input => (
                <div key={input.id} className="relative">
                    <input
                        type={input.type}
                        id={input.id}
                        placeholder={input.placeholder}
                        defaultValue={input.default}
                        className="rounded-3xl shadow-md p-1 pr-3 pl-3 outline-none border-[2px]"
                        required={input.required}
                        disabled={input.disabled}
                        style={{
                            width: props.width,
                            backgroundColor: input.disabled ? '#ddd' : 'white',
                        }}
                        onChange={e => props.changeFunction(input.id, e.target.value)}
                        onFocus={e => (e.target.style.borderColor = '#FFBD73')}
                        onBlur={e => (e.target.style.borderColor = '')}
                    />

                    <p
                        className="absolute  left-[15px]"
                        style={{
                            color: input.cmtColor,
                            whiteSpace: 'nowrap',
                            overflow: 'visible',
                            fontSize: '10px',
                            top: '85%',
                        }}
                    >
                        {input.comment}
                    </p>
                    {input.default && (
                        <p className="absolute text-xs top-[-6px] left-[18px] text-[#aaa]">{input.label}</p>
                    )}
                </div>
            ))}
        </>
    );
}
