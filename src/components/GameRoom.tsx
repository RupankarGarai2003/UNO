import React from 'react';
import { GameState } from '../types/uno';
import { Users, Crown, Play, Copy, Check } from 'lucide-react';

interface GameRoomProps {
  gameState: GameState;
  currentPlayerId: string;
  onStartGame: () => void;
}

export function GameRoom({ gameState, currentPlayerId, onStartGame }: GameRoomProps) {
  const [copied, setCopied] = React.useState(false);
  const currentPlayer = gameState.players.find(p => p.id === currentPlayerId);
  const canStartGame = currentPlayer?.isHost && gameState.players.length >= 2;

  const copyGameId = async () => {
    try {
      await navigator.clipboard.writeText(gameState.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = gameState.id;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-blue-800 to-teal-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Game Room</h1>
          <div className="flex items-center justify-center space-x-2 text-lg">
            <span className="text-gray-600">Game ID:</span>
            <code className="bg-gray-100 px-3 py-1 rounded font-mono text-xl font-bold text-blue-600">
              {gameState.id}
            </code>
            <button
              onClick={copyGameId}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
              title="Copy Game ID"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          {copied && (
            <p className="text-green-600 text-sm mt-2 animate-fade-in">
              Game ID copied to clipboard!
            </p>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Players ({gameState.players.length}/10)</span>
            </h2>
            
            {gameState.players.length < 2 && (
              <span className="text-sm text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                Need at least 2 players
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gameState.players.map((player) => (
              <div
                key={player.id}
                className={`
                  bg-gray-50 rounded-lg p-4 flex items-center justify-between
                  ${player.id === currentPlayerId ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {player.name}
                      {player.id === currentPlayerId && (
                        <span className="text-blue-600 text-sm ml-2">(You)</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {player.isHost && (
                  <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                    <Crown className="h-3 w-3" />
                    <span>Host</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center space-y-4">
          {currentPlayer?.isHost ? (
            <div>
              <button
                onClick={onStartGame}
                disabled={!canStartGame}
                className={`
                  flex items-center justify-center space-x-2 mx-auto px-8 py-4 rounded-lg font-semibold text-lg transition-all transform
                  ${canStartGame
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white hover:scale-105 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <Play className="h-6 w-6" />
                <span>Start Game</span>
              </button>
              
              {!canStartGame && gameState.players.length < 2 && (
                <p className="text-sm text-gray-600 mt-2">
                  Waiting for more players to join...
                </p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Waiting for host to start the game...</span>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 space-y-1">
            <p>Share the Game ID with your friends to invite them!</p>
            <p>The host can start the game when ready.</p>
          </div>
        </div>
      </div>
    </div>
  );
}