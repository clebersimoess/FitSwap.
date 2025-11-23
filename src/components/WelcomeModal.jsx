import React, { useState, useEffect } from 'react';

export default function WelcomeModal() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const seen = localStorage.getItem('fs_seen_welcome');
    if (!seen) {
      setShow(true);
      localStorage.setItem('fs_seen_welcome', '1');
    }
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">Bem-vindo ao FitSwap!</h2>
        <p className="text-gray-700 mb-4">Registre suas atividades: caminhada, ciclismo, treino, yoga e muito mais. Compartilhe suas conquistas e inspire a comunidade.</p>
        <div className="flex justify-end">
          <button onClick={() => setShow(false)} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded">Vamos lá</button>
        </div>
      </div>
    </div>
  );
}
