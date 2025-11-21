import './App.css'
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import Login from "./pages/Login"
import Home from "./pages/Home"
import CreatePost from "./pages/CreatePost"
import { useEffect, useState } from 'react'
import { supabase } from "./lib/supabaseClient"

function RequireAuth({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div>Carregando...</div>

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div>Carregando...</div>

  return (
    <>
      <Routes>
        <Route path="/" element={session ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={session ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/create-post" element={<RequireAuth><CreatePost /></RequireAuth>} />
        <Route path="*" element={<Navigate to={session ? "/home" : "/login"} replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
