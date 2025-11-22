<div className="flex items-center gap-2">
  <button
    onClick={() => navigate("/today-paid")}
    className="px-3 py-1 bg-green-600 text-white rounded"
  >
    Hoje tá pago
  </button>
  <button
    onClick={() => navigate("/create-post")}
    className="px-3 py-1 bg-blue-600 text-white rounded"
  >
    Criar
  </button>
  <button
    onClick={async () => {
      await supabase.auth.signOut();
      navigate("/login");
    }}
    className="px-3 py-1 bg-red-600 text-white rounded"
  >
    Sair
  </button>
</div>
