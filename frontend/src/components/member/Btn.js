import React from 'react';

export default function Btn(props) {
    return (
        <button
            onClick={props.onClickHandler}
            className="rounded-3xl shadow-md p-1.5 pr-3 pl-3 outline-none w-full"
            style={{ backgroundColor: props.bgColor }}
            onMouseEnter={e => (e.target.style.backgroundColor = props.bgHoverColor)}
            onMouseLeave={e => (e.target.style.backgroundColor = props.bgColor)}
        >
            {props.text}
        </button>
    );
}
