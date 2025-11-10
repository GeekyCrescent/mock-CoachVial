export default function App() {
  return (
    <div className="min-h-screen grid place-items-center bg-neutral-950 text-white">
      <div className="rounded-2xl p-8 shadow-xl bg-white/5 border border-white/10">
        <h1 className="text-3xl font-bold">
          Tailwind <span className="text-pink-500">v4</span> + React + TS + Vite ✅
        </h1>
        <p className="mt-2 text-white/70">Si ves color y espaciados, está funcionando.</p>
        <button className="mt-6 rounded-xl px-4 py-2 bg-blue-600 hover:bg-blue-500 transition">
          Botón de prueba
        </button>
      </div>
    </div>
  )
}
