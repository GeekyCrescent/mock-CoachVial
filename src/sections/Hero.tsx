import { useEffect, useMemo, useRef } from "react";
import { useScrollProgress } from "../hooks/useScrollProgress";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Parallax: valores optimizados para efecto profesional
  const { ref: heroRef, progress } = useScrollProgress<HTMLDivElement>({
    start: 0,
    end: 800,
  });

  // Escala, opacidad y posición del video - crece y se mueve hacia abajo
  const { scale, opacity, translateY } = useMemo(() => {
    const s = 0.9 + progress * (1.3 - 0.9); // comienza a 90% y crece a 130%
    const o = 0.8 + progress * (1 - 0.8);   // comienza visible y aumenta
    const y = progress * 50; // se mueve 50px hacia abajo
    return { scale: s, opacity: o, translateY: y };
  }, [progress]);

  // Reproduce solo cuando alcanza el tamaño máximo (progx  ress = 1)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (progress >= 0.95) {
      v.muted = true;
      v.playsInline = true;
      v.loop = true;
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0; // Reinicia el video cuando no está al máximo
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

      {/* Contenedor principal - Todo centrado */}
      <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col items-center justify-center gap-12 max-w-7xl">
        
        {/* Texto centrado */}
        <div className="w-full text-center">
          <h1
            className="
              text-[clamp(2.8rem,6vw,5.5rem)] font-black
              leading-[1.05] tracking-tight text-[#0f172a]
              drop-shadow-sm
            "
          >
            Coach <span className="text-[#E53935] drop-shadow-sm">Vial</span>
          </h1>

          <p className="mt-6 text-[clamp(1.05rem,2.2vw,1.3rem)] text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Seguridad al volante para equipos y empresas: capacitación,
            auditorías y cultura vial medible.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 justify-center">
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

        {/* Tarjeta de video — Centrada y con efecto de crecimiento */}
        <div className="w-full max-w-4xl">
          <div
            className="
              relative
              w-full
              rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden
              will-change-transform transition-all duration-500
            "
            style={{
              transform: `scale(${scale}) translateY(${translateY}px)`,
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
