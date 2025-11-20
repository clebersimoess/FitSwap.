import './App.css'
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { Toaster } from "sonner"
import Login from "./pages/Login"
import Home from "./pages/Home"
import CreatePost from "./pages/CreatePost"
import { useEffect } from 'react'

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    // FORÇAR redirecionamento para login na inicialização
    if (window.location.pathname === '/' || window.location.pathname === '/create-post') {
      navigate('/login', { replace: true })
    }
  }, [navigate])

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
