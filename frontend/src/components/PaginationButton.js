import React from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

const PaginationButton = ({ direction, onClick, disabled }) => {
    return (
        <button
            className={`p-2 rounded-full ${disabled ? 'text-gray-400 cursor-not-allowed' : '#FE9134'}`}
            onClick={onClick}
            disabled={disabled}
        >
            {direction === 'left' ? <AiOutlineLeft size={32} /> : <AiOutlineRight size={32} />}
        </button>
    );
};

export default PaginationButton;
