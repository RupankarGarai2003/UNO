export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild';
export type CardType = 'number' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wildDraw4';

export interface UnoCard {
  id: string;
  color: CardColor;
  type: CardType;
  value?: number; // 0-9 for number cards
}

export interface Player {
  id: string;
  name: string;
  cards: UnoCard[];
  isHost: boolean;
}

export interface GameState {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  direction: 1 | -1; // 1 for clockwise, -1 for counter-clockwise
  deck: UnoCard[];
  discardPile: UnoCard[];
  topCard: UnoCard;
  gameStarted: boolean;
  winner: string | null;
  mustDrawCount: number; // For stacking draw cards
  selectedWildColor: CardColor | null;
}

export type GameAction = 
  | { type: 'JOIN_GAME'; payload: { playerId: string; playerName: string } }
  | { type: 'START_GAME' }
  | { type: 'PLAY_CARD'; payload: { playerId: string; cardId: string; selectedColor?: CardColor } }
  | { type: 'DRAW_CARD'; payload: { playerId: string } }
  | { type: 'NEXT_TURN' }
  | { type: 'CALL_UNO'; payload: { playerId: string } };