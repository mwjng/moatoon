import React from 'react';

export default function ConfirmModal(props) {
    if (!props.modalState) return null;
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-[#00000088] z-[99999]">
            <div
                className="absolute top-[50%] m-auto p-10 bg-[#ffffff] text-black rounded-3xl pr-5 pl-5 left-[50%] -translate-x-1/2 -translate-y-1/2 flex gap-3.5 text-xl items-center flex-col
            "
            >
                <p className="text-xl pr-[60px] pl-[60px] ">{props.text}</p>
                <div className="flex gap-3">
                    <button
                        onClick={props.confirmHandler}
                        className="bg-[#FFB703] rounded-xl shadow-md p-1.5 pr-10 pl-10 outline-none  hover:bg-[#F3AD00]"
                    >
                        확인
                    </button>
                    <button
                        onClick={props.cancelHandler}
                        className="bg-[#FFB703] rounded-xl shadow-md p-1.5 pr-10 pl-10 outline-none  hover:bg-[#F3AD00]"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}
