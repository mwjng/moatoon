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
                        className="rounded-3xl shadow-md p-1 pr-3 pl-3 outline-none border-[2px] "
                        required={input.required}
                        disabled={input.id === 'emailCode' ? props.codeState : input.disabled ? input.disabled : false}
                        style={{
                            width: props.width,
                            paddingRight:
                                input.id === 'loginId'
                                    ? '70px'
                                    : input.id === 'email' || input.id === 'emailCode'
                                      ? '50px'
                                      : undefined,
                            backgroundColor: input.id === 'emailCode' && props.codeState ? '#E0E0E0' : 'white',
                            borderColor: input.id === 'emailCode' && props.codeState ? '#BDBDBD' : '',
                        }}
                        onChange={e => props.changeFunction(input.id, e.target.value)}
                        onFocus={e => (e.target.style.borderColor = '#FFBD73')}
                        onBlur={e => (e.target.style.borderColor = '')}
                    />
                    {input.id === 'loginId' && (
                        <button
                            onClick={() => props.checkDuplicate(input.value)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#8ECAE6] text-white px-2 py-1 rounded-xl text-xs"
                        >
                            중복 확인
                        </button>
                    )}
                    {input.id === 'email' && (
                        <button
                            onClick={() => props.checkEmail(input.value)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#8ECAE6] text-white px-2 py-1 rounded-xl text-xs"
                        >
                            인증
                        </button>
                    )}
                    {input.id === 'emailCode' && (
                        <button
                            onClick={() => props.checkCode(input.value)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#8ECAE6] text-white px-2 py-1 rounded-xl text-xs"
                            disabled={props.codeState}
                            style={{
                                backgroundColor: props.codeState ? '#BDBDBD' : '#8ECAE6',
                                cursor: props.codeState ? 'not-allowed' : 'pointer',
                            }}
                        >
                            확인
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
