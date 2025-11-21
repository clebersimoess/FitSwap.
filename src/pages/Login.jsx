import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError("Email ou senha inválidos");
      setLoading(false);
      return;
    }

    navigate("/home");
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '0 1rem' }}>
      <div style={{ width: '100%', maxWidth: '28rem', backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1.5rem' }}>Entrar</h1>

        {error && (
          <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Seu email"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            style={{ 
              width: '100%', 
              backgroundColor: loading ? '#9ca3af' : '#2563eb', 
              color: 'white', 
              padding: '0.75rem', 
              borderRadius: '0.5rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280' }}>
          Não tem conta?{" "}
          <span
            style={{ color: '#2563eb', fontWeight: '600', cursor: 'pointer' }}
            onClick={() => navigate("/register")}
          >
            Cadastrar
          </span>
        </p>
      </div>
    </div>
  );
}
