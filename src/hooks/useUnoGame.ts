import { useReducer, useCallback } from 'react';
import { GameState, GameAction, CardColor } from '../types/uno';
import { gameReducer, createInitialGameState, generateGameId } from '../utils/gameLogic';

// Global game states storage (in a real app, this would be on a server)
const gameStates = new Map<string, GameState>();

export function useUnoGame() {
  const [gameState, dispatch] = useReducer(gameReducer, null, () => 
    createInitialGameState('')
  );

  const createGame = useCallback((playerName: string) => {
    const gameId = generateGameId();
    const playerId = `player-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    const initialState = createInitialGameState(gameId);
    const newState = gameReducer(initialState, {
      type: 'JOIN_GAME',
      payload: { playerId, playerName }
    });
    
    // Store the game state
    gameStates.set(gameId, newState);
    
    return { gameState: newState, playerId };
  }, []);

  const joinGame = useCallback((gameId: string, playerName: string) => {
    const playerId = `player-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    // Get existing game state or create new one
    let existingState = gameStates.get(gameId);
    if (!existingState) {
      existingState = createInitialGameState(gameId);
    }
    
    const newState = gameReducer(existingState, {
      type: 'JOIN_GAME',
      payload: { playerId, playerName }
    });
    
    // Update stored game state
    gameStates.set(gameId, newState);
    
    return { gameState: newState, playerId };
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const playCard = useCallback((playerId: string, cardId: string, selectedColor?: CardColor) => {
    dispatch({ type: 'PLAY_CARD', payload: { playerId, cardId, selectedColor } });
  }, []);

  const drawCard = useCallback((playerId: string) => {
    dispatch({ type: 'DRAW_CARD', payload: { playerId } });
  }, []);

  const nextTurn = useCallback(() => {
    dispatch({ type: 'NEXT_TURN' });
  }, []);

  return {
    gameState,
    createGame,
    joinGame,
    startGame,
    playCard,
    drawCard,
    nextTurn,
    dispatch
  };
}