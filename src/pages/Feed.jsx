import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import PostCard from "../components/PostCard";
import ProofCard from "../components/ProofCard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  async function loadPosts(showToast = false) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) {
        console.warn("Supabase posts fetch error:", error);
        const cache = localStorage.getItem("fs_posts_cache");
        if (cache) setPosts(JSON.parse(cache));
        if (showToast) toast.error("Unable to load latest posts; showing cached content.");
      } else {
        setPosts(data || []);
        localStorage.setItem("fs_posts_cache", JSON.stringify(data || []));
      }
    } catch (err) {
      console.error("loadPosts error:", err);
      const cache = localStorage.getItem("fs_posts_cache");
      if (cache) setPosts(JSON.parse(cache));
      if (showToast) toast.error("Network error while loading posts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function loadProofs(showToast = false) {
    try {
      const { data, error } = await supabase
        .from("workout_proofs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) {
        console.warn("Supabase proofs fetch error:", error);
        const cache = localStorage.getItem("fs_proofs_cache");
        if (cache) setProofs(JSON.parse(cache));
        if (showToast) toast.error("Unable to load latest activities; showing cached content.");
      } else {
        const approved = (data || []).filter(p => p.approved === undefined || p.approved === true);
        setProofs(approved);
        localStorage.setItem("fs_proofs_cache", JSON.stringify(approved));
      }
    } catch (err) {
      console.error("loadProofs error:", err);
      const cache = localStorage.getItem("fs_proofs_cache");
      if (cache) setProofs(JSON.parse(cache));
      if (showToast) toast.error("Network error while loading activities.");
    }
  }

  useEffect(() => {
    loadPosts();
    loadProofs();

    const postsChannel = supabase
      .channel("public:posts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
        setPosts(prev => [payload.new, ...prev]);
        toast.success("New post available");
      })
      .subscribe();

    const proofsChannel = supabase
      .channel("public:workout_proofs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "workout_proofs" }, (payload) => {
        const p = payload.new;
        if (p.approved === undefined || p.approved === true) {
          setProofs(prev => [p, ...prev]);
          toast.success("New activity posted");
        }
      })
      .subscribe();

    return () => {
      try { postsChannel.unsubscribe(); } catch (e) {}
      try { proofsChannel.unsubscribe(); } catch (e) {}
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow flex items-center justify-between">
        <h2 className="text-xl font-bold">FitSwap</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/new-activity")} className="px-3 py-1 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded">New</button>
          <button onClick={() => navigate("/today-paid")} className="px-3 py-1 bg-green-600 text-white rounded">Hoje tá pago</button>
          <button onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }} className="px-3 py-1 bg-red-600 text-white rounded">Sign out</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Latest posts</h3>
          <div>
            <button onClick={() => { setRefreshing(true); loadPosts(true); loadProofs(true); }} className="px-3 py-1 border rounded">{refreshing ? "Refreshing..." : "Refresh"}</button>
          </div>
        </div>

        {loading && (
          <div aria-busy="true">
            <div className="animate-pulse space-y-4">
              <div className="h-24 bg-white rounded-lg shadow" />
              <div className="h-24 bg-white rounded-lg shadow" />
              <div className="h-24 bg-white rounded-lg shadow" />
            </div>
          </div>
        )}

        {!loading && proofs.length > 0 && (
          <section className="mb-6">
            <h4 className="text-lg font-medium mb-3">Atividades recentes</h4>
            {proofs.map(p => <ProofCard key={p.id || p.created_at} proof={p} />)}
          </section>
        )}

        {!loading && posts.length === 0 && <div className="text-center py-8">No posts yet. Be the first!</div>}
        {!loading && posts.map((p) => <PostCard key={p.id || p.created_at} post={p} />)}
      </main>
    </div>
  );
}
