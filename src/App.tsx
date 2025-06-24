import React, { useState } from 'react';
import { GameLobby } from './components/GameLobby';
import { GameRoom } from './components/GameRoom';
import { GameBoard } from './components/GameBoard';
import { useUnoGame } from './hooks/useUnoGame';
import { GameState, CardColor } from './types/uno';

type AppState = 'lobby' | 'room' | 'game';

function App() {
  const [appState, setAppState] = useState<AppState>('lobby');
  const [currentPlayerId, setCurrentPlayerId] = useState('');
  const [currentGameState, setCurrentGameState] = useState<GameState | null>(null);
  
  const { createGame, joinGame, startGame, playCard, drawCard, nextTurn } = useUnoGame();

  const handleCreateGame = (playerName: string) => {
    const { gameState, playerId } = createGame(playerName);
    setCurrentGameState(gameState);
    setCurrentPlayerId(playerId);
    setAppState('room');
  };

  const handleJoinGame = (gameId: string, playerName: string) => {
    const { gameState, playerId } = joinGame(gameId, playerName);
    setCurrentGameState(gameState);
    setCurrentPlayerId(playerId);
    setAppState('room');
  };

  const handleStartGame = () => {
    if (currentGameState) {
      startGame();
      // In a real app, we'd get the updated state from the server
      // For demo, we'll simulate it by creating a started game
      const startedGame = {
        ...currentGameState,
        gameStarted: true
      };
      setCurrentGameState(startedGame);
      setAppState('game');
    }
  };

  const handlePlayCard = (cardId: string, selectedColor?: CardColor) => {
    if (currentGameState) {
      playCard(currentPlayerId, cardId, selectedColor);
      // Simulate state update
      setTimeout(() => {
        const updatedState = { ...currentGameState };
        // In a real app, this would come from the server
        setCurrentGameState(updatedState);
      }, 100);
    }
  };

  const handleDrawCard = () => {
    if (currentGameState) {
      drawCard(currentPlayerId);
      // Simulate state update
      setTimeout(() => {
        const updatedState = { ...currentGameState };
        setCurrentGameState(updatedState);
      }, 100);
    }
  };

  const handleNextTurn = () => {
    if (currentGameState) {
      nextTurn();
      // Simulate state update
      setTimeout(() => {
        const updatedState = { ...currentGameState };
        setCurrentGameState(updatedState);
      }, 100);
    }
  };

  if (appState === 'lobby') {
    return <GameLobby onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />;
  }

  if (appState === 'room' && currentGameState) {
    return (
      <GameRoom
        gameState={currentGameState}
        currentPlayerId={currentPlayerId}
        onStartGame={handleStartGame}
      />
    );
  }

  if (appState === 'game' && currentGameState) {
    return (
      <GameBoard
        gameState={currentGameState}
        currentPlayerId={currentPlayerId}
        onPlayCard={handlePlayCard}
        onDrawCard={handleDrawCard}
        onNextTurn={handleNextTurn}
      />
    );
  }

  return <div>Loading...</div>;
}

export default App;