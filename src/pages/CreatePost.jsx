import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim().length < 3) return toast.error("Title must be at least 3 characters");
    if (content.trim().length < 10) return toast.error("Content must be at least 10 characters");

    setLoading(true);
    try {
      const payload = { title: title.trim(), content: content.trim(), created_at: new Date().toISOString() };
      const { data, error } = await supabase.from("posts").insert([payload]).select();
      if (error) {
        toast.error("Failed to post to server; saved locally");
        const cache = JSON.parse(localStorage.getItem("fs_posts_cache") || "[]");
        cache.unshift({ ...payload, id: Date.now() });
        localStorage.setItem("fs_posts_cache", JSON.stringify(cache));
      } else {
        toast.success("Post created");
        const cache = JSON.parse(localStorage.getItem("fs_posts_cache") || "[]");
        cache.unshift(data[0]);
        localStorage.setItem("fs_posts_cache", JSON.stringify(cache));
      }
      navigate("/home");
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Create Post</h2>
        <form onSubmit={handleSubmit} aria-label="Create post form">
          <label className="block mb-2">Title</label>
          <input className="w-full mb-3 px-3 py-2 border rounded" value={title} onChange={(e)=>setTitle(e.target.value)} required />
          <label className="block mb-2">Content</label>
          <textarea className="w-full mb-3 px-3 py-2 border rounded" value={content} onChange={(e)=>setContent(e.target.value)} rows={6} required />
          <div className="mb-4">
            <h4 className="font-medium">Preview</h4>
            <div className="p-3 border rounded bg-gray-50">
              <h5 className="font-semibold">{title || "No title"}</h5>
              <p className="text-sm text-gray-700">{content || "No content"}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={()=>navigate("/home")} className="px-3 py-2 mr-2 rounded border">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? "Posting..." : "Post"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
