import { useEffect, useMemo, useRef } from "react";
import { useScrollProgress } from "../hooks/useScrollProgress";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Parallax: valores optimizados para efecto profesional
  const { ref: heroRef, progress } = useScrollProgress<HTMLDivElement>({
    start: -100,
    end: 600,
  });

  // Escala y opacidad del video - transición suave
  const { scale, opacity } = useMemo(() => {
    const s = 0.92 + progress * (1.08 - 0.92); // zoom sutil y elegante
    const o = 0.7 + progress * (1 - 0.7);      // fade-in progresivo
    return { scale: s, opacity: o };
  }, [progress]);

  // Reproduce cuando llega casi al máximo
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (progress >= 0.96) {
      v.muted = true;
      v.playsInline = true;
      v.loop = true;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [progress]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="
        relative isolate w-full overflow-hidden
        min-h-screen
        flex items-center justify-center
      "
    >
      {/* Fondo degradado elegante */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-[#e53935]/12 via-white/95 to-slate-50" />

      {/* Capa de textura suave (muy sutil) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />

      {/* Contenedor principal - Centrado vertical y horizontal */}
      <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 max-w-7xl">
        
        {/* Texto (lado izquierdo en desktop) */}
        <div className="flex-1 max-w-2xl text-center lg:text-left">
          <h1
            className="
              text-[clamp(2.8rem,6vw,5.5rem)] font-black
              leading-[1.05] tracking-tight text-[#0f172a]
              drop-shadow-sm
            "
          >
            Coach <span className="text-[#E53935] drop-shadow-sm">Vial</span>
          </h1>

          <p className="mt-6 text-[clamp(1.05rem,2.2vw,1.3rem)] text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Seguridad al volante para equipos y empresas: capacitación,
            auditorías y cultura vial medible.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
            <a
              href="#about"
              className="
                inline-flex items-center justify-center
                rounded-xl px-8 py-3.5 text-base font-bold
                text-white bg-[#E53935]
                shadow-lg shadow-[#E53935]/25 ring-1 ring-[#E53935]/80
                transition-all duration-300 hover:bg-[#d32f2f] hover:shadow-xl hover:shadow-[#E53935]/30 hover:-translate-y-1
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E53935]
              "
            >
              Conócenos más
            </a>
            <a
              href="#services"
              className="
                inline-flex items-center justify-center
                rounded-xl px-8 py-3.5 text-base font-bold
                text-slate-800 bg-white
                ring-1 ring-slate-300 shadow-md
                transition-all duration-300 hover:bg-slate-50 hover:shadow-lg hover:-translate-y-1
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400
              "
            >
              Nuestros Servicios
            </a>
          </div>
        </div>

        {/* Tarjeta de video — Centrada y profesional */}
        <div className="flex-1 w-full max-w-2xl">
          <div
            className="
              relative
              w-full
              rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden
              will-change-transform transition-all duration-300
              hover:shadow-3xl hover:-translate-y-1
            "
            style={{
              transform: `scale(${scale})`,
              opacity,
            }}
          >
            <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-800 to-slate-900">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                poster="/assets/VideoCoachVial.png"
                src="/assets/VideoCoachVial.mp4"
                preload="metadata"
              />
              {/* Overlay elegante con borde interior */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Fade to white bajo el hero (para transición limpia) */}
      <div
        aria-hidden
        className="
          absolute -bottom-px left-0 right-0 h-32
          bg-gradient-to-b from-transparent via-white/50 to-white
          -z-10
        "
      />
    </section>
  );
}
