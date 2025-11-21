import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function CreatePost() {
  const [text, setText] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const uploadMedia = async (file, userId) => {
    const ext = file.name.split(".").pop();
    const fileName = ${userId}-${Date.now()}.${ext};
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("posts")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async () => {
    setError("");
    if (!text && !mediaFile) {
      setError("Adicione texto ou mídia antes de publicar.");
      return;
    }

    setLoading(true);

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      setError("Você precisa estar autenticado.");
      setLoading(false);
      return;
    }

    let mediaUrl = null;

    try {
      if (mediaFile) {
        mediaUrl = await uploadMedia(mediaFile, user.user.id);
      }

      const { error: insertError } = await supabase
        .from("posts")
        .insert({
          user_id: user.user.id,
          content: text,
          media_url: mediaUrl,
        });

      if (insertError) throw insertError;

      navigate("/home");
    } catch (err) {
      setError("Erro ao publicar. Tente novamente.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Criar Nova Publicação</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <textarea
            placeholder="Compartilhe seus pensamentos, treinos ou conquistas..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/, video/"
            className="mt-4"
            onChange={handleMediaChange}
          />

          {mediaPreview && (
            <div className="mt-4">
              {mediaFile.type.startsWith("video/") ? (
                <video src={mediaPreview} controls className="w-full rounded-lg" />
              ) : (
                <img src={mediaPreview} className="w-full rounded-lg" alt="" />
              )}
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-3">{error}</p>
          )}

          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              onClick={() => navigate("/home")}
            >
              Cancelar
            </button>

            <button
              disabled={loading}
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
