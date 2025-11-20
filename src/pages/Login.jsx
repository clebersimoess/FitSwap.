import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const createPageUrl = (page) => /${page};

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError("Email ou senha incorretos.");
      return;
    }

    window.location.href = createPageUrl("Home");
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: ${window.location.origin}${createPageUrl("Home")}
        }
      });
      if (error) throw error;
    } catch {
      setError("Erro ao fazer login com Google.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold">Login</h1>

        {error && (
         const { error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: ${window.location.origin}${createPageUrl("Home")}
  }
});
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-md border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full rounded-md border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 font-medium text-white"
          >
            Entrar
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full rounded-md bg-red-600 py-2 font-medium text-white"
        >
          Entrar com Google
        </button>

        <div className="mt-6 flex justify-between text-sm">
          <a href="/register" className="text-blue-600">Criar conta</a>
          <a href="/forgotpassword" className="text-blue-600">Esqueci a senha</a>
        </div>
      </div>
    </div>
  );
}
