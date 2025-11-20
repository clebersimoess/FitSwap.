import React from 'react'

export default function CreatePost() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Criar Nova Publicação</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <textarea 
            placeholder="Compartilhe seus pensamentos, treinos ou conquistas..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex justify-between mt-6">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Cancelar
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
