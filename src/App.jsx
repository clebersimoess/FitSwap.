import React, { useEffect, useState } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import Login from "./pages/Login"
import Home from "./pages/Home"
import CreatePost from "./pages/CreatePost"
import { supabase } from "./lib/supabaseClient"

function RequireAuth({ children, isAuth }) {
  const location = useLocation()
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Error getting supabase session:", error)
        }
        const session = data?.session ?? null
        if (mounted) {
          setIsAuthenticated(Boolean(session))
          setCheckingAuth(false)
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err)
        if (mounted) {
          setIsAuthenticated(false)
          setCheckingAuth(false)
        }
      }
    }

    checkSession()

    // subscribe to auth state changes so UI updates on sign in / sign out
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session))
    })

    return () => {
      mounted = false
      // unsubscribe safely
      try {
        subscription?.subscription?.unsubscribe?.()
      } catch (e) {
        // older/newer SDK shapes: attempt other patterns
        try {
          subscription?.unsubscribe?.()
        } catch (e2) {
          // ignore
        }
      }
    }
  }, [])

  // while we are checking auth, avoid rendering routes that redirect incorrectly
  if (checkingAuth) {
    return null
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/home" element={<RequireAuth isAuth={isAuthenticated}><Home /></RequireAuth>} />
        <Route path="/create-post" element={<RequireAuth isAuth={isAuthenticated}><CreatePost /></RequireAuth>} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
      </Routes>
      <Toaster />
    </>
  )
}
