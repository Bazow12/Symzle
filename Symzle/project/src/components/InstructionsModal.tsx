import React from 'react';
import { X, Target, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">How to Play</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <div className="space-y-4 text-gray-300">
          <div className="flex items-start gap-3">
            <Target className="text-purple-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-white font-semibold mb-1">Objective</h3>
              <p className="text-sm">Guess the daily sequence of 5 symbols in 6 attempts or fewer.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-white font-semibold">How to Play</h3>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Select symbols from the grid to build your guess</li>
              <li>Submit your guess when you have 5 symbols</li>
              <li>Use the color feedback to refine your next guess</li>
              <li>Solve the puzzle in 6 attempts or fewer</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-white font-semibold">Feedback Colors</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                  ●
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-400" size={16} />
                  <span className="text-sm">Correct symbol in correct position</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold">
                  ◆
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-yellow-400" size={16} />
                  <span className="text-sm">Correct symbol in wrong position</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center text-white font-bold">
                  ■
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="text-gray-400" size={16} />
                  <span className="text-sm">Symbol not in the sequence</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span>💡</span> Pro Tip
            </h3>
            <p className="text-sm">
              A new Symzle puzzle is available every day at midnight. Use logic and 
              pattern recognition to solve it efficiently!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Start Playing
        </button>
      </div>
    </div>
  );
};

export default InstructionsModal;