import React from 'react';

export const Button = ({ children, onClick, disabled = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'} ${className}`}
    >
      {children}
    </button>
  );
};
