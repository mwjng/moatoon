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
        <div className="flex ml-10 flex-col items-center space-y-4 backdrop-blur-md bg-white/50 p-4 rounded-lg shadow">
            <div className="flex flex-col items-center space-y-2">
                <button
                    type="button"
                    onClick={() => handleButtonClick('pen')}
                    className={`w-12 h-12 flex justify-center items-center hover:bg-gray-300 rounded ${activeButton === 'pen' ? 'bg-blue-100' : ''}`}
                >
                    <BiPencil size={24} />
                </button>
                <button
                    type="button"
                    onClick={() => handleButtonClick('eraser')}
                    className={`w-12 h-12 flex justify-center items-center hover:bg-gray-300 rounded ${activeButton === 'eraser' ? 'bg-blue-100' : ''}`}
                >
                    <BiEraser size={24} />
                </button>
            </div>
            <div className="flex flex-col items-center space-y-2">
                <button
                    type="button"
                    onClick={undo}
                    className="w-12 h-12 flex justify-center items-center hover:bg-gray-300 rounded"
                >
                    <BiUndo size={24} />
                </button>
                <button
                    type="button"
                    onClick={redo}
                    className="w-12 h-12 flex justify-center items-center hover:bg-gray-300 rounded"
                >
                    <BiRedo size={24} />
                </button>
                <button
                    type="button"
                    onClick={clearCanvas}
                    className="w-12 h-12 flex justify-center items-center hover:bg-gray-300 rounded"
                >
                    <BiTrash size={24} />
                </button>
            </div>
            <div className="flex flex-col items-center space-y-2">
                {strokeWidths.map(width => (
                    <button
                        key={width}
                        type="button"
                        onClick={() => handleStrokeButtonClick(width)}
                        className={`w-8 h-8 hover:bg-gray-300 rounded ${activeStrokeWidth === width ? 'bg-blue-100' : ''}`}
                    >
                        <img src={strokeIcons[width]} alt={`stroke-${width}`} className="w-6 h-6" />
                    </button>
                ))}
            </div>

            {activeButton === 'pen' && (
                <ul className="flex flex-col items-center space-y-2">
                    {colorArray.map((color, index) => (
                        <li key={index} className="w-8 h-8 flex justify-center items-center hover:bg-gray-300 rounded">
                            <div
                                onClick={() => handleColorCircleClick(color)}
                                className={`w-5 h-5 rounded-full border ${color === '#FFFFFF' ? 'border-gray-500' : ''} ${activeColor === color ? 'bg-blue-100' : ''}`}
                                style={{ backgroundColor: color }}
                            />
                        </li>
                    ))}
                    <input
                        type="color"
                        value={activeColor}
                        onChange={handleChangeColor}
                        className="w-8 h-8 border rounded"
                    />
                </ul>
            )}
        </div>
    );
};

export default ToolBar;
