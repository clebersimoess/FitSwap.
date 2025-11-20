import './App.css'
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import Login from "./pages/Login"
import Home from "./pages/Home"
import CreatePost from "./pages/CreatePost"
import { useEffect } from 'react'

function App() {
  const location = useLocation()

  // REDIRECIONAMENTO FORÇADO
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/create-post') {
      window.location.href = '/login'
    }
  }, [location])

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
