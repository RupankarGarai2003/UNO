import React from 'react';
import { UnoCard } from '../types/uno';
import { getCardDisplayText, getCardColorClass } from '../utils/cardUtils';

interface CardProps {
  card: UnoCard;
  isPlayable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Card({ card, isPlayable = false, isSelected = false, onClick, className = '' }: CardProps) {
  const displayText = getCardDisplayText(card);
  const colorClass = getCardColorClass(card.color);

  return (
    <div
      onClick={onClick}
      className={`
        relative w-16 h-24 rounded-lg border-2 border-white shadow-lg cursor-pointer transform transition-all duration-200
        ${colorClass}
        ${isPlayable ? 'hover:scale-105 hover:shadow-xl' : ''}
        ${isSelected ? 'scale-105 ring-4 ring-blue-300' : ''}
        ${!isPlayable && onClick ? 'opacity-50' : ''}
        ${className}
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold select-none">
          {displayText}
        </span>
      </div>
      
      {/* Corner numbers for number cards */}
      {card.type === 'number' && (
        <>
          <div className="absolute top-1 left-1 text-xs font-bold">
            {card.value}
          </div>
          <div className="absolute bottom-1 right-1 text-xs font-bold rotate-180">
            {card.value}
          </div>
        </>
      )}
    </div>
  );
}

export function CardBack({ className = '' }: { className?: string }) {
  return (
    <div className={`
      w-16 h-24 rounded-lg border-2 border-white shadow-lg
      bg-gradient-to-br from-gray-800 to-gray-900
      flex items-center justify-center
      ${className}
    `}>
      <div className="text-white text-lg font-bold">UNO</div>
    </div>
  );
}