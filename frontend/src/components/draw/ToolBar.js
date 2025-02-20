import React, { useState } from 'react';
import { BiEraser, BiPencil, BiUndo, BiRedo, BiTrash } from 'react-icons/bi';
import lineLight from '../../assets/line-light.svg';
import lineMedium from '../../assets/line-medium.svg';
import lineBold from '../../assets/line-bold.svg';

const ToolBar = ({ setPenColor, setStrokeWidth, setMode, undo, redo, clearCanvas }) => {
    const [activeButton, setActiveButton] = useState('pen');
    const [activeStrokeWidth, setActiveStrokeWidth] = useState(5);
    const [activeColor, setActiveColor] = useState('#000000');
    const colorArray = ['#000000', '#CF3F41', '#2D66CB'];
    const strokeWidths = [5, 10, 15];

    const strokeIcons = {
        5: lineLight,
        10: lineMedium,
        15: lineBold,
    };

    const handleButtonClick = tool => {
        setActiveButton(tool);
        setMode(tool);
    };

    const handleColorCircleClick = color => {
        setActiveColor(color);
        setPenColor(color);
    };

    const handleStrokeButtonClick = width => {
        setActiveStrokeWidth(width);
        setStrokeWidth(width);
    };

    const handleChangeColor = event => {
        setActiveColor(event.target.value);
        setPenColor(event.target.value);
    };

    return (
        <div className="flex flex-col items-center space-y-2 backdrop-blur-md bg-white/50 p-2 rounded-lg shadow-sm">
            <div className="flex flex-col items-center space-y-1">
                <button
                    type="button"
                    onClick={() => handleButtonClick('pen')}
                    className={`w-10 h-10 flex justify-center items-center hover:bg-gray-300 rounded ${activeButton === 'pen' ? 'bg-blue-100' : ''}`}
                >
                    <BiPencil size={20} />
                </button>
                <button
                    type="button"
                    onClick={() => handleButtonClick('eraser')}
                    className={`w-10 h-10 flex justify-center items-center hover:bg-gray-300 rounded ${activeButton === 'eraser' ? 'bg-blue-100' : ''}`}
                >
                    <BiEraser size={20} />
                </button>
            </div>
            <div className="flex flex-col items-center space-y-1">
                <button
                    type="button"
                    onClick={undo}
                    className="w-10 h-10 flex justify-center items-center hover:bg-gray-300 rounded"
                >
                    <BiUndo size={20} />
                </button>
                <button
                    type="button"
                    onClick={redo}
                    className="w-10 h-10 flex justify-center items-center hover:bg-gray-300 rounded"
                >
                    <BiRedo size={20} />
                </button>
                <button
                    type="button"
                    onClick={clearCanvas}
                    className="w-10 h-10 flex justify-center items-center hover:bg-gray-300 rounded"
                >
                    <BiTrash size={20} />
                </button>
            </div>
            <div className="flex flex-col items-center space-y-1">
                {strokeWidths.map(width => (
                    <button
                        key={width}
                        type="button"
                        onClick={() => handleStrokeButtonClick(width)}
                        className={`w-7 h-7 hover:bg-gray-300 rounded ${activeStrokeWidth === width ? 'bg-blue-100' : ''}`}
                    >
                        <img src={strokeIcons[width]} alt={`stroke-${width}`} className="w-5 h-5" />
                    </button>
                ))}
            </div>

            {activeButton === 'pen' && (
                <ul className="flex flex-col items-center space-y-1">
                    {colorArray.map((color, index) => (
                        <li key={index} className="w-7 h-7 flex justify-center items-center hover:bg-gray-300 rounded">
                            <div
                                onClick={() => handleColorCircleClick(color)}
                                className={`w-4 h-4 rounded-full border ${color === '#FFFFFF' ? 'border-gray-500' : ''} ${activeColor === color ? 'bg-blue-100' : ''}`}
                                style={{ backgroundColor: color }}
                            />
                        </li>
                    ))}
                    <input
                        type="color"
                        value={activeColor}
                        onChange={handleChangeColor}
                        className="w-7 h-7 border rounded"
                    />
                </ul>
            )}
        </div>
    );
};

export default ToolBar;