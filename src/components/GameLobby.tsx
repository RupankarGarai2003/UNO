import React, { useState } from 'react';
import { Users, Plus, LogIn } from 'lucide-react';

interface GameLobbyProps {
  onCreateGame: (playerName: string) => void;
  onJoinGame: (gameId: string, playerName: string) => void;
}

export function GameLobby({ onCreateGame, onJoinGame }: GameLobbyProps) {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onCreateGame(playerName.trim());
    }
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && gameId.trim()) {
      onJoinGame(gameId.trim().toUpperCase(), playerName.trim());
    }
  };

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-blue-600 via-green-600 to-yellow-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎮</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Game</h1>
            <p className="text-gray-600">Start a new UNO game and invite friends!</p>
          </div>

          <form onSubmit={handleCreateGame} className="space-y-6">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
                maxLength={20}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Create Game</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('menu')}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
            >
              Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-blue-600 via-green-600 to-yellow-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Game</h1>
            <p className="text-gray-600">Enter the game ID to join your friends!</p>
          </div>

          <form onSubmit={handleJoinGame} className="space-y-6">
            <div>
              <label htmlFor="gameId" className="block text-sm font-medium text-gray-700 mb-2">
                Game ID
              </label>
              <input
                type="text"
                id="gameId"
                value={gameId}
                onChange={(e) => setGameId(e.target.value.toUpperCase())}
                placeholder="Enter 6-character game ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center text-lg font-mono"
                required
                maxLength={6}
              />
            </div>

            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
                maxLength={20}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
            >
              <LogIn className="h-5 w-5" />
              <span>Join Game</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('menu')}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
            >
              Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-blue-600 via-green-600 to-yellow-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">🎴</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">UNO</h1>
          <p className="text-gray-600">Play the classic card game with friends!</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setMode('create')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-3 transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus className="h-6 w-6" />
            <span className="text-lg">Create Game</span>
          </button>

          <button
            onClick={() => setMode('join')}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-3 transition-all transform hover:scale-105 shadow-lg"
          >
            <LogIn className="h-6 w-6" />
            <span className="text-lg">Join Game</span>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>2-10 players • Classic UNO rules</p>
        </div>
      </div>
    </div>
  );
}