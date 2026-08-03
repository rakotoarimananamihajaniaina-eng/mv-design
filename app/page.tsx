const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
          MV
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-1">MV DESIGN</h1>
        <p className="text-gray-500 text-sm mb-6">Ça marche — le vrai code tourne en ligne.</p>

        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            supabaseConfigured
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {supabaseConfigured
            ? 'Connexion Supabase configurée'
            : 'Variables Supabase non configurées'}
        </div>
      </div>
    </main>
  );
}
