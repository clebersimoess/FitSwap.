import React from 'react';

export default function ActivitySelector({ value, onChange }) {
  const options = [
    'Academia','Caminhada','Corrida','Ciclismo','Yoga','Crossfit','Funcional','Dança','Lutas','Outros'
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={px-3 py-1 rounded-full border ${value === opt ? 'bg-gradient-to-r from-pink-500 to-yellow-400 text-white' : 'bg-white text-gray-700'}}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
