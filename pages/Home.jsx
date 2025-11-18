import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/PostCard";
import { WorkoutHistory } from "./WorkoutHistory";

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
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(user);
    } catch (error) {
      console.log("Usuário não logado");
    }
  };

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate(createPageUrl("Welcome"));
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#FF006E] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">FitSwap</h1>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Button
                    onClick={() => navigate(createPageUrl("CreatePost"))}
                    className="bg-[#FF6B35] hover:bg-[#FF5A25]"
                  >
                    + Novo Post
                  </Button>
                  <Button
                    onClick={() => navigate(createPageUrl("Profile"))}
                    variant="outline"
                  >
                    Perfil
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate(createPageUrl("Login"))}
                    variant="outline"
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => navigate(createPageUrl("Register"))}
                    className="bg-[#FF6B35] hover:bg-[#FF5A25]"
                  >
                    Cadastrar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts Feed */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Feed</h2>
              
              {posts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum post ainda
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Seja o primeiro a compartilhar seu progresso!
                  </p>
                  {user && (
                    <Button
                      onClick={() => navigate(createPageUrl("CreatePost"))}
                      className="bg-[#FF6B35] hover:bg-[#FF5A25]"
                    >
                      Criar Primeiro Post
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={user}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {user && (
              <div className="space-y-6">
                {/* User Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Seu Progresso
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Posts</span>
                      <span className="font-semibold">
                        {posts.filter(p => p.user_id === user.id).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Seguidores</span>
                      <span className="font-semibold">--</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Seguindo</span>
                      <span className="font-semibold">--</span>
                    </div>
                  </div>
                </div>

                {/* Workout History */}
                <WorkoutHistory userId={user.id} />

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Ações Rápidas
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate(createPageUrl("Explore"))}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      🔍 Explorar
                    </Button>
                    <Button
                      onClick={() => navigate(createPageUrl("Challenges"))}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      🏆 Desafios
                    </Button>
                    <Button
                      onClick={() => navigate(createPageUrl("Communities"))}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      👥 Comunidades
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!user && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Junte-se à Comunidade
                </h3>
                <p className="text-gray-600 mb-4">
                  Conecte-se com outros entusiastas do fitness, compartilhe seu progresso e participe de desafios!
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate(createPageUrl("Register"))}
                    className="w-full bg-[#FF6B35] hover:bg-[#FF5A25]"
                  >
                    Criar Conta
                  </Button>
                  <Button
                    onClick={() => navigate(createPageUrl("Login"))}
                    variant="outline"
                    className="w-full"
                  >
                    Fazer Login
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
