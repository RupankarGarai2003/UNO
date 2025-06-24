import React from 'react';
import { CardColor } from '../types/uno';

interface ColorSelectorProps {
  onSelectColor: (color: CardColor) => void;
  onCancel: () => void;
}

export function ColorSelector({ onSelectColor, onCancel }: ColorSelectorProps) {
  const colors: { color: CardColor; name: string; bgClass: string }[] = [
    { color: 'red', name: 'Red', bgClass: 'bg-red-500 hover:bg-red-600' },
    { color: 'blue', name: 'Blue', bgClass: 'bg-blue-500 hover:bg-blue-600' },
    { color: 'green', name: 'Green', bgClass: 'bg-green-500 hover:bg-green-600' },
    { color: 'yellow', name: 'Yellow', bgClass: 'bg-yellow-500 hover:bg-yellow-600' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Choose a Color
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {colors.map(({ color, name, bgClass }) => (
            <button
              key={color}
              onClick={() => onSelectColor(color)}
              className={`
                ${bgClass} text-white py-3 px-4 rounded-lg font-semibold
                transform transition-all duration-200 hover:scale-105
                shadow-lg hover:shadow-xl
              `}
            >
              {name}
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}