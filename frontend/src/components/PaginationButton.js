import React from 'react';
import BracketLeft from '../assets/bracket-left.png';
import BracketRight from '../assets/bracket-right.png';

const PaginationButton = ({ direction, onClick, disabled }) => {
    return (
        <button
            className={`p-2 rounded-full ${disabled ? 'text-gray-400 cursor-not-allowed' : '#FE9134'}`}
            onClick={onClick}
            disabled={disabled}
        >
            {direction === 'left' ? (
                <img src={BracketLeft} alt="left bracket" className="w-8 h-8" />
            ) : (
                <img src={BracketRight} alt="right bracket" className="w-8 h-8" />
            )}
        </button>
    );
};

export default PaginationButton;
