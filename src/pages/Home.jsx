import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    loadPosts();
  }, []);

  const checkUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error) setUser(data.user);
  };

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error) setPosts(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">FitSwap</h1>

          <div className="flex gap-3">
            {user ? (
              <>
                <Button onClick={() => navigate("/create-post")}>
                  + Novo Post
                </Button>
                <Button onClick={handleLogout}>Sair</Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate("/login")}>Entrar</Button>
                <Button onClick={() => navigate("/register")}>Cadastrar</Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Feed</h2>

        {posts.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            Nenhum post encontrado.
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-6 rounded-lg shadow border"
              >
                <h3 className="font-semibold text-lg mb-2">{post.title || "Sem título"}</h3>
                <p className="text-gray-700 mb-3">{post.content}</p>

                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="rounded-lg w-full mb-3"
                  />
                )}

                {post.video_url && (
                  <video
                    src={post.video_url}
                    controls
                    className="rounded-lg w-full mb-3"
                  />
                )}

                <p className="text-sm text-gray-500">
                  Postado em: {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
