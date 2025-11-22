import { createClient } from '@supabase/supabase-js'

// =====================================
// 🔧 MODO OFFLINE AUTOMÁTICO
// =====================================
// Se a supabase estiver fora do ar, o app continua funcionando sem travar.
// Ele não faz requisições e evita erro de conexão.
// =====================================

function createSafeClient(url, key) {
  if (!url || !key) {
    console.warn("⚠️ Supabase indisponível — usando modo offline.")
    return {
      auth: {
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({
          error: { message: "Supabase offline — tente novamente mais tarde" }
        }),
        signUp: async () => ({
          error: { message: "Supabase offline — tente novamente mais tarde" }
        }),
        signOut: async () => ({ error: null })
      },
      from: () => ({
        select: async () => ({ data: [], error: { message: "Modo offline" } }),
        insert: async () => ({ data: null, error: { message: "Modo offline" } }),
        update: async () => ({ data: null, error: { message: "Modo offline" } }),
        delete: async () => ({ data: null, error: { message: "Modo offline" } }),
      })
    }
  }

  // Modo normal
  return createClient(url, key)
}

console.log("🔎 SUPABASE DEBUG")
console.log("URL:", import.meta.env.VITE_SUPABASE_URL)
console.log(
  "KEY:",
  import.meta.env.VITE_SUPABASE_ANON_KEY ? "OK (não exibida por segurança)" : "❌ NÃO ENCONTRADA"
)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createSafeClient(supabaseUrl, supabaseKey)
