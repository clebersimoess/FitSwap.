import './App.css'
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import Login from "./pages/Login"
import Home from "./pages/Home"
import CreatePost from "./pages/CreatePost"

// Componente para proteger rotas
function RequireAuth({ children }) {
  const isAuthenticated = Boolean(localStorage.getItem('token')) // ajuste o nome da chave conforme o seu app
  const location = useLocation()
  if (!isAuthenticated) {
    // redireciona para /login e guarda a origem
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

function App() {
  const isAuthenticated = Boolean(localStorage.getItem('token'))

  return (
    <>
      <Routes>
        {/* raiz vai para /home se autenticado, senão para /login */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />

        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />

        <Route path="/home" element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        } />

        <Route path="/create-post" element={
          <RequireAuth>
            <CreatePost />
          </RequireAuth>
        } />

        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
