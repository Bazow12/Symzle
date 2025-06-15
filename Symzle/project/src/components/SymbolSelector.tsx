import React from 'react';
import { SYMBOLS } from '../types';
import { Trash2 } from 'lucide-react';

interface SymbolSelectorProps {
  onSymbolSelect: (symbol: string) => void;
  onBackspace: () => void;
  disabled: boolean;
}

const SymbolSelector: React.FC<SymbolSelectorProps> = ({
  onSymbolSelect,
  onBackspace,
  disabled,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="grid grid-cols-4 gap-3">
        {SYMBOLS.map((symbol) => (
          <button
            key={symbol}
            onClick={() => onSymbolSelect(symbol)}
            disabled={disabled}
            className={`
              w-12 h-12 bg-gray-700 border-2 border-gray-600 rounded-lg
              flex items-center justify-center text-xl font-bold
              transition-all duration-200 transform
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600 hover:border-gray-500 hover:scale-110 active:scale-95'}
              focus:outline-none focus:ring-2 focus:ring-purple-500
            `}
          >
            {symbol}
          </button>
        ))}
      </div>
      
      <button
        onClick={onBackspace}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg
          transition-all duration-200 transform
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700 hover:scale-105 active:scale-95'}
          focus:outline-none focus:ring-2 focus:ring-red-500
        `}
      >
        <Trash2 size={16} />
        <span>Delete</span>
      </button>
    </div>
  );
};

export default SymbolSelector;