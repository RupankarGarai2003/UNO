import React from 'react';
import { UnoCard } from '../types/uno';
import { Card } from './Card';
import { canPlayCard } from '../utils/cardUtils';

interface PlayerHandProps {
  cards: UnoCard[];
  topCard: UnoCard;
  selectedWildColor?: string | null;
  isCurrentPlayer: boolean;
  onPlayCard: (cardId: string) => void;
  selectedCardId?: string;
}

export function PlayerHand({ 
  cards, 
  topCard, 
  selectedWildColor, 
  isCurrentPlayer, 
  onPlayCard,
  selectedCardId 
}: PlayerHandProps) {
  return (
    <div className="flex justify-center items-end space-x-1 px-4 py-6 bg-gradient-to-t from-gray-800 to-transparent min-h-32">
      {cards.map((card, index) => {
        const isPlayable = isCurrentPlayer && canPlayCard(card, topCard, selectedWildColor as any);
        const isSelected = selectedCardId === card.id;
        
        return (
          <Card
            key={card.id}
            card={card}
            isPlayable={isPlayable}
            isSelected={isSelected}
            onClick={() => isPlayable && onPlayCard(card.id)}
            className={`
              ${index > 0 ? '-ml-4' : ''}
              ${isSelected ? 'mb-2' : ''}
              hover:mb-2 transition-all duration-200
            `}
          />
        );
      })}
      
      {cards.length === 0 && (
        <div className="text-gray-400 text-center py-8">
          No cards in hand
        </div>
      )}
    </div>
  );
}