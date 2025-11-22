import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { supabase } from "./lib/supabaseClient";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import NewActivityPost from "./pages/NewActivityPost";
import TodayPaid from "./pages/TodayPaid";
import WelcomeModal from "./components/WelcomeModal";

function RequireAuth({ children, isAuth }) {
  const location = useLocation();
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error("getSession error:", error);
        if (mounted) setSession(data?.session ?? null);
      } catch (e) {
        console.error(e);
        if (mounted) setSession(null);
      } finally {
        if (mounted) setCheckingAuth(false);
      }
    }

    load();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      try {
        listener?.subscription?.unsubscribe?.();
      } catch (e) {
        try {
          listener?.unsubscribe?.();
        } catch (e2) {}
      }
      mounted = false;
    };
  }, []);

  if (checkingAuth) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={session ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={session ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/register" element={session ? <Navigate to="/home" replace /> : <Register />} />
        <Route path="/home" element={<RequireAuth isAuth={Boolean(session)}><Feed /></RequireAuth>} />
        <Route path="/create-post" element={<RequireAuth isAuth={Boolean(session)}><CreatePost /></RequireAuth>} />
        <Route path="/new-activity" element={<RequireAuth isAuth={Boolean(session)}><NewActivityPost /></RequireAuth>} />
        <Route path="/today-paid" element={<RequireAuth isAuth={Boolean(session)}><TodayPaid /></RequireAuth>} />
        <Route path="*" element={<Navigate to={session ? "/home" : "/login"} replace />} />
      </Routes>
      <Toaster />
      <WelcomeModal />
    </>
  );
}
