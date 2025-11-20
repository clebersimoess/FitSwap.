import React, { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate(createPageUrl("Home"));
      }
    } catch (error) {
      console.log("Usuário não logado");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) throw error;

      if (data.user) {
        navigate(createPageUrl("Home"));
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setError(error.message || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: ${window.location.origin}${createPageUrl("Home")}
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error("Erro no login com Google:", error);
      setError("Erro ao fazer login com Google.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF6B35] to-[#FF006E] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">💪</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo de volta!
          </h1>
          <p className="text-white/90">
            Entre na sua conta para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-white/70" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white/70" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="Sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-white/70 hover:text-white" />
                ) : (
                  <Eye className="h-5 w-5 text-white/70 hover:text-white" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#FF6B35] bg-white/10 border-white/20 rounded focus:ring-[#FF6B35] focus:ring-2"
              />
              <span className="ml-2 text-white text-sm">Lembrar de mim</span>
            </label>
            <button
              type="button"
              onClick={() => navigate(createPageUrl("ForgotPassword"))}
              className="text-white text-sm hover:underline"
            >
              Esqueceu a senha?
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-lg font-bold bg-white text-[#FF6B35] hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
                Entrando...
              </div>
            ) : (
              "Entrar"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/80">ou</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-14 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </Button>
        </form>

        <div className="text-center mt-8">
          <p className="text-white/80">
            Não tem uma conta?{" "}
            <button
              onClick={() => navigate(createPageUrl("Register"))}
              className="text-white font-semibold hover:underline"
            >
              Cadastre-se
            </button>
          </p>
        </div>

        <div className="text-center text-white/60 text-xs mt-6 space-y-1">
          <p>
            Ao entrar, você concorda com nossos{" "}
            <button
              onClick={() => navigate(createPageUrl("TermsOfService"))}
              className="underline hover:text-white"
            >
              Termos de Uso
            </button>
            {" "}e{" "}
            <button
              onClick={() => navigate(createPageUrl("PrivacyPolicy"))}
              className="underline hover:text-white"
            >
              Política de Privacidade
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
