import React, { useState } from 'react';
import { X, User, Trophy } from 'lucide-react';

interface PlayerNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetName: (name: string) => void;
  currentName?: string;
}

const PlayerNameModal: React.FC<PlayerNameModalProps> = ({ 
  isOpen, 
  onClose, 
  onSetName,
  currentName 
}) => {
  const [name, setName] = useState(currentName || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('Please enter a name');
      return;
    }
    
    if (trimmedName.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }
    
    if (!/^[a-zA-Z0-9\s_-]+$/.test(trimmedName)) {
      setError('Name can only contain letters, numbers, spaces, hyphens, and underscores');
      return;
    }
    
    onSetName(trimmedName);
    onClose();
  };

  const handleClose = () => {
    setError('');
    setName(currentName || '');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <User className="text-purple-400" size={24} />
            <h2 className="text-xl font-bold text-white">
              {currentName ? 'Change Name' : 'Set Your Name'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-2">
              Player Name
            </label>
            <input
              type="text"
              id="playerName"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter your name"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              maxLength={20}
              autoFocus
            />
            {error && (
              <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              This name will appear on the leaderboard
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="text-yellow-400" size={16} />
              <span className="text-white font-semibold text-sm">Leaderboard Info</span>
            </div>
            <p className="text-xs text-gray-300">
              Compete with other players by maintaining consecutive daily wins. 
              Your longest streak and total wins will be tracked!
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold"
            >
              {currentName ? 'Update' : 'Set Name'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerNameModal;