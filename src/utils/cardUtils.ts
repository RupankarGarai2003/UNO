import { UnoCard, CardColor, CardType } from '../types/uno';

export const CARD_COLORS: CardColor[] = ['red', 'blue', 'green', 'yellow'];

export function createDeck(): UnoCard[] {
  const deck: UnoCard[] = [];
  let cardId = 1;

  // Number cards (0-9)
  CARD_COLORS.forEach(color => {
    // One 0 per color
    deck.push({
      id: `card-${cardId++}`,
      color,
      type: 'number',
      value: 0
    });

    // Two of each number 1-9 per color
    for (let i = 1; i <= 9; i++) {
      deck.push({
        id: `card-${cardId++}`,
        color,
        type: 'number',
        value: i
      });
      deck.push({
        id: `card-${cardId++}`,
        color,
        type: 'number',
        value: i
      });
    }

    // Action cards (2 of each per color)
    ['skip', 'reverse', 'draw2'].forEach(type => {
      deck.push({
        id: `card-${cardId++}`,
        color,
        type: type as CardType
      });
      deck.push({
        id: `card-${cardId++}`,
        color,
        type: type as CardType
      });
    });
  });

  // Wild cards (4 of each)
  for (let i = 0; i < 4; i++) {
    deck.push({
      id: `card-${cardId++}`,
      color: 'wild',
      type: 'wild'
    });
    deck.push({
      id: `card-${cardId++}`,
      color: 'wild',
      type: 'wildDraw4'
    });
  }

  return shuffleDeck(deck);
}

export function shuffleDeck(deck: UnoCard[]): UnoCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function canPlayCard(card: UnoCard, topCard: UnoCard, selectedWildColor?: CardColor): boolean {
  // Wild cards can always be played
  if (card.type === 'wild' || card.type === 'wildDraw4') {
    return true;
  }

  // If top card is wild, check against selected color
  if (topCard.type === 'wild' || topCard.type === 'wildDraw4') {
    return card.color === selectedWildColor;
  }

  // Match color or type/value
  return card.color === topCard.color || 
         card.type === topCard.type || 
         (card.type === 'number' && topCard.type === 'number' && card.value === topCard.value);
}

export function getCardDisplayText(card: UnoCard): string {
  switch (card.type) {
    case 'number':
      return card.value?.toString() || '0';
    case 'skip':
      return '⊘';
    case 'reverse':
      return '↺';
    case 'draw2':
      return '+2';
    case 'wild':
      return 'W';
    case 'wildDraw4':
      return '+4';
    default:
      return '?';
  }
}

export function getCardColorClass(color: CardColor): string {
  switch (color) {
    case 'red':
      return 'bg-red-500 text-white';
    case 'blue':
      return 'bg-blue-500 text-white';
    case 'green':
      return 'bg-green-500 text-white';
    case 'yellow':
      return 'bg-yellow-500 text-black';
    case 'wild':
      return 'bg-gradient-to-br from-red-500 via-blue-500 via-green-500 to-yellow-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}