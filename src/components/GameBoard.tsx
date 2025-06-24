import React, { useState } from 'react';
import { GameState, UnoCard, CardColor } from '../types/uno';
import { Card, CardBack } from './Card';
import { PlayerHand } from './PlayerHand';
import { ColorSelector } from './ColorSelector';
import { Users, RotateCcw, Trophy, Sparkles } from 'lucide-react';

interface GameBoardProps {
  gameState: GameState;
  currentPlayerId: string;
  onPlayCard: (cardId: string, selectedColor?: CardColor) => void;
  onDrawCard: () => void;
  onNextTurn: () => void;
}

export function GameBoard({ gameState, currentPlayerId, onPlayCard, onDrawCard, onNextTurn }: GameBoardProps) {
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [pendingWildCard, setPendingWildCard] = useState<string>('');

  const currentPlayer = gameState.players.find(p => p.id === currentPlayerId);
  const activePlayer = gameState.players[gameState.currentPlayerIndex];
  const isCurrentPlayerTurn = activePlayer?.id === currentPlayerId;

  const handlePlayCard = (cardId: string) => {
    const card = currentPlayer?.cards.find(c => c.id === cardId);
    
    if (card && (card.type === 'wild' || card.type === 'wildDraw4')) {
      setPendingWildCard(cardId);
      setShowColorSelector(true);
    } else {
      onPlayCard(cardId);
      setSelectedCardId('');
    }
  };

  const handleColorSelect = (color: CardColor) => {
    onPlayCard(pendingWildCard, color);
    setShowColorSelector(false);
    setPendingWildCard('');
    setSelectedCardId('');
  };

  const handleCancelColorSelect = () => {
    setShowColorSelector(false);
    setPendingWildCard('');
    setSelectedCardId('');
  };

  if (gameState.winner) {
    const winner = gameState.players.find(p => p.id === gameState.winner);
    const isCurrentPlayerWinner = gameState.winner === currentPlayerId;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-red-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-32 w-24 h-24 bg-green-400 rounded-full opacity-20 animate-bounce delay-300"></div>
          <div className="absolute bottom-32 right-16 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>

        <div className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-lg w-full mx-4 relative z-10 transform animate-pulse">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-4 shadow-lg">
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <div className="mt-8 mb-6">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Game Over!
            </h1>
            
            {isCurrentPlayerWinner ? (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-green-600 flex items-center justify-center space-x-2">
                  <Sparkles className="h-6 w-6" />
                  <span>You Won!</span>
                  <Sparkles className="h-6 w-6" />
                </p>
                <p className="text-lg text-gray-600">Congratulations! 🏆</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xl text-gray-700">
                  <span className="font-bold text-blue-600">{winner?.name}</span> wins!
                </p>
                <p className="text-lg text-gray-600">Better luck next time! 🎮</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Final Scores</h3>
              <div className="space-y-2">
                {gameState.players
                  .sort((a, b) => a.cards.length - b.cards.length)
                  .map((player, index) => (
                    <div key={player.id} className="flex justify-between items-center">
                      <span className={`font-medium ${player.id === gameState.winner ? 'text-green-600' : 'text-gray-700'}`}>
                        {index === 0 && '👑 '}{player.name}
                        {player.id === currentPlayerId && ' (You)'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {player.cards.length} cards left
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-blue-800 to-purple-800 flex flex-col">
      {/* Header */}
      <div className="bg-black bg-opacity-20 p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <Users className="h-5 w-5" />
              <span className="font-semibold">{gameState.players.length} Players</span>
            </div>
            <div className="text-white text-sm">
              Game ID: <span className="font-bold">{gameState.id}</span>
            </div>
          </div>
          
          <div className="text-white text-center">
            <div className="text-sm opacity-75">Current Turn</div>
            <div className="font-bold text-lg">
              {activePlayer?.name}
              {gameState.direction === -1 && (
                <RotateCcw className="inline h-4 w-4 ml-1" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Other Players */}
      <div className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {gameState.players
              .filter(p => p.id !== currentPlayerId)
              .map((player, index) => (
                <div 
                  key={player.id}
                  className={`
                    bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm
                    ${activePlayer?.id === player.id ? 'ring-2 ring-yellow-400' : ''}
                  `}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">
                      {player.name}
                      {player.isHost && (
                        <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded">
                          HOST
                        </span>
                      )}
                    </span>
                    <span className="text-white text-sm">
                      {player.cards.length} cards
                    </span>
                  </div>
                  
                  <div className="flex space-x-1 overflow-x-auto">
                    {player.cards.slice(0, 5).map((_, cardIndex) => (
                      <CardBack key={cardIndex} className="flex-shrink-0 w-8 h-12" />
                    ))}
                    {player.cards.length > 5 && (
                      <div className="flex-shrink-0 w-8 h-12 bg-gray-600 rounded flex items-center justify-center text-white text-xs">
                        +{player.cards.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Game Center */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            {/* Deck */}
            <div className="text-center">
              <div className="text-white text-sm mb-2">Deck</div>
              <div 
                onClick={isCurrentPlayerTurn ? onDrawCard : undefined}
                className={`
                  ${isCurrentPlayerTurn ? 'cursor-pointer hover:scale-105' : ''}
                  transition-transform duration-200
                `}
              >
                <CardBack className="w-20 h-28" />
              </div>
              <div className="text-white text-xs mt-1">
                {gameState.deck.length} cards
              </div>
            </div>

            {/* Top Card */}
            <div className="text-center">
              <div className="text-white text-sm mb-2">
                Current Card
                {gameState.selectedWildColor && (
                  <span className="ml-2 text-xs">
                    (Color: {gameState.selectedWildColor})
                  </span>
                )}
              </div>
              <Card card={gameState.topCard} className="w-20 h-28" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Player Hand */}
      {currentPlayer && (
        <div className="bg-black bg-opacity-30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center text-white py-2">
              <span className="font-semibold">Your Hand</span>
              <span className="ml-2 text-sm opacity-75">
                ({currentPlayer.cards.length} cards)
              </span>
              {currentPlayer.cards.length === 1 && (
                <span className="ml-2 text-yellow-400 font-bold animate-pulse">
                  UNO!
                </span>
              )}
            </div>
            
            <PlayerHand
              cards={currentPlayer.cards}
              topCard={gameState.topCard}
              selectedWildColor={gameState.selectedWildColor}
              isCurrentPlayer={isCurrentPlayerTurn}
              onPlayCard={handlePlayCard}
              selectedCardId={selectedCardId}
            />

            {/* Action Buttons */}
            {isCurrentPlayerTurn && (
              <div className="text-center pb-4">
                <button
                  onClick={onNextTurn}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors mr-4"
                >
                  Pass Turn
                </button>
                <button
                  onClick={onDrawCard}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  Draw Card
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Color Selector Modal */}
      {showColorSelector && (
        <ColorSelector
          onSelectColor={handleColorSelect}
          onCancel={handleCancelColorSelect}
        />
      )}
    </div>
  );
}