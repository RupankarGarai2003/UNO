import { GameState, Player, UnoCard, GameAction } from '../types/uno';
import { createDeck, shuffleDeck, canPlayCard } from './cardUtils';

export function createInitialGameState(gameId: string): GameState {
  return {
    id: gameId,
    players: [],
    currentPlayerIndex: 0,
    direction: 1,
    deck: [],
    discardPile: [],
    topCard: { id: 'temp', color: 'red', type: 'number', value: 0 },
    gameStarted: false,
    winner: null,
    mustDrawCount: 0,
    selectedWildColor: null
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'JOIN_GAME': {
      if (state.players.length >= 10 || state.gameStarted) {
        return state;
      }

      // Check if this player is already in the game
      const existingPlayer = state.players.find(p => p.id === action.payload.playerId);
      if (existingPlayer) {
        return state;
      }

      const newPlayer: Player = {
        id: action.payload.playerId,
        name: action.payload.playerName,
        cards: [],
        isHost: state.players.length === 0 // Only first player is host
      };

      return {
        ...state,
        players: [...state.players, newPlayer]
      };
    }

    case 'START_GAME': {
      if (state.players.length < 2 || state.gameStarted) {
        return state;
      }

      const deck = createDeck();
      const players = [...state.players];
      
      // Deal 7 cards to each player
      let currentDeckIndex = 0;
      players.forEach(player => {
        player.cards = deck.slice(currentDeckIndex, currentDeckIndex + 7);
        currentDeckIndex += 7;
      });

      // Find first non-wild card for starting card
      let topCardIndex = currentDeckIndex;
      while (topCardIndex < deck.length && 
             (deck[topCardIndex].type === 'wild' || deck[topCardIndex].type === 'wildDraw4')) {
        topCardIndex++;
      }

      const topCard = deck[topCardIndex];
      const remainingDeck = [
        ...deck.slice(currentDeckIndex, topCardIndex),
        ...deck.slice(topCardIndex + 1)
      ];

      return {
        ...state,
        players,
        deck: remainingDeck,
        discardPile: [topCard],
        topCard,
        gameStarted: true,
        currentPlayerIndex: 0
      };
    }

    case 'PLAY_CARD': {
      const { playerId, cardId, selectedColor } = action.payload;
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      
      if (playerIndex !== state.currentPlayerIndex || !state.gameStarted) {
        return state;
      }

      const player = state.players[playerIndex];
      const cardIndex = player.cards.findIndex(c => c.id === cardId);
      
      if (cardIndex === -1) {
        return state;
      }

      const card = player.cards[cardIndex];
      
      if (!canPlayCard(card, state.topCard, state.selectedWildColor)) {
        return state;
      }

      // Remove card from player's hand
      const newPlayers = [...state.players];
      newPlayers[playerIndex] = {
        ...player,
        cards: player.cards.filter(c => c.id !== cardId)
      };

      let newState = {
        ...state,
        players: newPlayers,
        discardPile: [...state.discardPile, card],
        topCard: card,
        selectedWildColor: selectedColor || null,
        mustDrawCount: 0
      };

      // Check for winner
      if (newPlayers[playerIndex].cards.length === 0) {
        newState.winner = playerId;
        return newState;
      }

      // Apply card effects
      newState = applyCardEffect(newState, card);

      return newState;
    }

    case 'DRAW_CARD': {
      const { playerId } = action.payload;
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      
      if (playerIndex !== state.currentPlayerIndex || !state.gameStarted) {
        return state;
      }

      if (state.deck.length === 0) {
        // Reshuffle discard pile into deck (keep top card)
        const newDeck = shuffleDeck(state.discardPile.slice(0, -1));
        const newDiscardPile = [state.discardPile[state.discardPile.length - 1]];
        
        const newPlayers = [...state.players];
        newPlayers[playerIndex] = {
          ...newPlayers[playerIndex],
          cards: [...newPlayers[playerIndex].cards, newDeck[0]]
        };

        return {
          ...state,
          players: newPlayers,
          deck: newDeck.slice(1),
          discardPile: newDiscardPile
        };
      }

      const drawnCard = state.deck[0];
      const newPlayers = [...state.players];
      newPlayers[playerIndex] = {
        ...newPlayers[playerIndex],
        cards: [...newPlayers[playerIndex].cards, drawnCard]
      };

      return {
        ...state,
        players: newPlayers,
        deck: state.deck.slice(1)
      };
    }

    case 'NEXT_TURN': {
      if (!state.gameStarted || state.winner) {
        return state;
      }

      let nextPlayerIndex = state.currentPlayerIndex + state.direction;
      
      if (nextPlayerIndex >= state.players.length) {
        nextPlayerIndex = 0;
      } else if (nextPlayerIndex < 0) {
        nextPlayerIndex = state.players.length - 1;
      }

      return {
        ...state,
        currentPlayerIndex: nextPlayerIndex
      };
    }

    default:
      return state;
  }
}

function applyCardEffect(state: GameState, card: UnoCard): GameState {
  let newState = { ...state };

  switch (card.type) {
    case 'skip':
      // Skip next player
      newState = gameReducer(newState, { type: 'NEXT_TURN' });
      break;

    case 'reverse':
      // Reverse direction
      newState.direction = newState.direction === 1 ? -1 : 1;
      // In 2-player game, reverse acts like skip
      if (newState.players.length === 2) {
        newState = gameReducer(newState, { type: 'NEXT_TURN' });
      }
      break;

    case 'draw2':
      // Next player draws 2 cards
      newState = gameReducer(newState, { type: 'NEXT_TURN' });
      const nextPlayerDraw2 = newState.players[newState.currentPlayerIndex];
      
      for (let i = 0; i < 2; i++) {
        if (newState.deck.length > 0) {
          const drawnCard = newState.deck[0];
          const playerIndex = newState.players.findIndex(p => p.id === nextPlayerDraw2.id);
          newState.players[playerIndex] = {
            ...newState.players[playerIndex],
            cards: [...newState.players[playerIndex].cards, drawnCard]
          };
          newState.deck = newState.deck.slice(1);
        }
      }
      
      // Skip the player who drew cards
      newState = gameReducer(newState, { type: 'NEXT_TURN' });
      break;

    case 'wildDraw4':
      // Next player draws 4 cards
      newState = gameReducer(newState, { type: 'NEXT_TURN' });
      const nextPlayerDraw4 = newState.players[newState.currentPlayerIndex];
      
      for (let i = 0; i < 4; i++) {
        if (newState.deck.length > 0) {
          const drawnCard = newState.deck[0];
          const playerIndex = newState.players.findIndex(p => p.id === nextPlayerDraw4.id);
          newState.players[playerIndex] = {
            ...newState.players[playerIndex],
            cards: [...newState.players[playerIndex].cards, drawnCard]
          };
          newState.deck = newState.deck.slice(1);
        }
      }
      
      // Skip the player who drew cards
      newState = gameReducer(newState, { type: 'NEXT_TURN' });
      break;
  }

  return newState;
}

export function generateGameId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}