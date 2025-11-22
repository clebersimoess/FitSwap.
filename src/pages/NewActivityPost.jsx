import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ActivitySelector from '../components/ActivitySelector';
import { getUserLocation, reverseGeocode } from '../lib/location';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function NewActivityPost() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [activity, setActivity] = useState('Academia');
  const [includeLocation, setIncludeLocation] = useState(false);
  const [locationText, setLocationText] = useState(null);
  const [latlng, setLatlng] = useState({ lat: null, lng: null });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFile = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const fetchLocation = async () => {
    try {
      const { lat, lng } = await getUserLocation();
      setLatlng({ lat, lng });
      const name = await reverseGeocode(lat, lng);
      setLocationText(name);
    } catch (err) {
      toast.error('Não foi possível obter a localização');
    }
  };

  const uploadToStorage = async f => {
    try {
      const ext = f.name.split('.').pop();
      const key = `proofs/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from('public').upload(key, f, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { publicUrl } = supabase.storage.from('public').getPublicUrl(key);
      return publicUrl;
    } catch (err) {
      throw err;
    }
  };

  const saveLocalFallback = async f => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const proofs = JSON.parse(localStorage.getItem('fs_workout_proofs') || '[]');
        const entry = {
          id: `local-${Date.now()}`,
          author: JSON.parse(localStorage.getItem('fs_session') || 'null'),
          media_url: dataUrl,
          media_type: f.type.startsWith('video') ? 'video' : 'image',
          caption,
          activity,
          location_text,
          lat: latlng.lat,
          lng: latlng.lng,
          created_at: new Date().toISOString()
        };
        proofs.unshift(entry);
        localStorage.setItem('fs_workout_proofs', JSON.stringify(proofs));
        resolve(entry);
      };
      reader.onerror = e => reject(e);
      reader.readAsDataURL(f);
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) {
      toast.error('Selecione foto ou vídeo');
      return;
    }
    setSubmitting(true);
    try {
      let mediaUrl = null;
      try {
        mediaUrl = await uploadToStorage(file);
      } catch (err) {
        await saveLocalFallback(file);
        toast.success('Post salvo localmente');
        navigate('/home');
        return;
      }
      const profile = JSON.parse(localStorage.getItem('fs_session') || 'null');
      const payload = {
        author_id: profile?.user?.id || null,
        media_url: mediaUrl,
        media_type: file.type.startsWith('video') ? 'video' : 'image',
        caption,
        activity,
        location_text: includeLocation ? locationText : null,
        lat: includeLocation ? latlng.lat : null,
        lng: includeLocation ? latlng.lng : null,
        created_at: new Date().toISOString()
      };
      const { data, error } = await supabase.from('workout_proofs').insert([payload]).select().single();
      if (error) {
        await saveLocalFallback(file);
        toast.error('Salvo localmente, falha ao enviar ao servidor');
      } else {
        toast.success('Post enviado');
      }
      navigate('/home');
    } catch (err) {
      toast.error('Erro ao enviar post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-2xl w-full bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Publicar atividade</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Foto ou vídeo</label>
          <input accept="image/*,video/*" type="file" onChange={handleFile} />
          {preview && (
            <div className="mt-3">
              {file && file.type.startsWith("video") ? (
                <video src={preview} controls className="w-full rounded" />
              ) : (
                <img src={preview} alt="preview" className="w-full rounded object-cover" />
              )}
            </div>
          )}
          <div className="mt-3">
            <label className="block mb-2">Modalidade</label>
            <ActivitySelector value={activity} onChange={setActivity} />
          </div>
          <label className="block mt-3 mb-2">Legenda</label>
          <textarea className="w-full px-3 py-2 border rounded" value={caption} onChange={e => setCaption(e.target.value)} rows={3} />
          <div className="flex items-center gap-3 mt-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={includeLocation} onChange={e => setIncludeLocation(e.target.checked)} />
              <span>Adicionar localização</span>
            </label>
            {includeLocation && (
              <button type="button" onClick={fetchLocation} className="px-3 py-1 border rounded">Pegar localização</button>
            )}
            {locationText && <div className="text-sm text-gray-600 ml-3">📍 {locationText}</div>}
          </div>
          <div className="flex justify-end mt-4">
            <button type="button" onClick={() => window.history.back()} className="px-4 py-2 mr-2 border rounded">Cancelar</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded">
              {submitting ? 'Enviando...' : 'Publicar atividade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
