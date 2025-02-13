const WordButton = ({ children, color, size, textColor, textSize, onClick, disabled }) => {
    const sizeClasses = size === 'small' ? 'px-4 py-1' : size === 'large' ? 'px-8 py-3' : 'px-6 py-2';
    const textSizeClass = textSize === 'large' ? 'text-xl' : textSize === 'small' ? 'text-sm' : 'text-base'; // 텍스트 크기 설정
    const textColorClass = textColor || 'text-black'; // 텍스트 색상 기본값은 흰색

    return (
        <button
            className={` ${sizeClasses} ${color} ${textSizeClass} ${textColorClass} shadow-md rounded-full hover:${color.replace('300', '400')} hover:shadow-lg ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={onClick} // onClick 추가
            disabled={disabled} // Disable the button when the prop is passed
        >
            {children}
        </button>
    );
};

export default WordButton;
