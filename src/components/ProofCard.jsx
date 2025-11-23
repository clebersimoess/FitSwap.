import React from 'react';

export default function ProofCard({ proof }) {
  const mediaType = proof.media_type || (proof.media_url && proof.media_url.includes('video') ? 'video' : 'image');
  const author = proof.author_name || (proof.author?.email || (proof.author?.user?.email) || 'Anônimo');
  return (
    <article className="bg-white rounded-lg shadow p-3 mb-4">
      <header className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-700">
          <strong>{author}</strong>
          {proof.activity && <span className="ml-2 text-xs text-gray-500">· {proof.activity}</span>}
        </div>
        <div className="text-xs text-gray-400">{new Date(proof.created_at || proof.createdAt || Date.now()).toLocaleString()}</div>
      </header>
      <div className="mb-2">
        {mediaType === 'video' ? (
          <video src={proof.media_url} controls className="w-full rounded" />
        ) : (
          <img src={proof.media_url} alt={proof.caption || 'proof'} className="w-full rounded object-cover" />
        )}
      </div>
      <p className="text-gray-800 mb-2">{proof.caption}</p>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">{proof.location_text ? <>📍 {proof.location_text}</> : 'Sem localização'}</div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 border rounded">👍</button>
          <button className="px-2 py-1 border rounded">💬</button>
        </div>
      </div>
    </article>
  );
}
