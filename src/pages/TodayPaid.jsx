import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function TodayPaid() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useLocation, setUseLocation] = useState(false);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  async function handleLocation() {
    if (!useLocation) {
      setLocation(null);
      return;
    }
    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      () => toast.error("Não foi possível pegar sua localização")
    );
  }

  async function handleSubmit() {
    if (!file) {
      toast.error("Selecione uma foto ou vídeo");
      return;
    }
    setLoading(true);

    const filename = `today_${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(filename, file);

    if (uploadError) {
      toast.error("Erro ao enviar arquivo");
      setLoading(false);
      return;
    }

    const { data: user } = await supabase.auth.getUser();
    const fileUrl = supabase.storage.from("posts").getPublicUrl(filename).data.publicUrl;

    const { error: insertError } = await supabase.from("posts").insert({
      user_id: user.user.id,
      type: "today-paid",
      media_url: fileUrl,
      location_lat: location?.lat || null,
      location_lng: location?.lng || null,
      created_at: new Date().toISOString()
    });

    if (insertError) {
      toast.error("Erro ao criar post");
      setLoading(false);
      return;
    }

    toast.success("Post enviado!");
    navigate("/home");
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Hoje tá pago!</h2>

      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={useLocation}
          onChange={() => {
            setUseLocation(!useLocation);
            handleLocation();
          }}
        />
        Usar localização da academia
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded w-full"
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </div>
  );
}
