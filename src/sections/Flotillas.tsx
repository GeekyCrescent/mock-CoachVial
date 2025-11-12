// src/components/FleetsCarousel.tsx
import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  icon?: React.ReactNode; // si quieres un pictograma adicional
  imgSrc: string;         // imagen 1600x900 recomendada
  alt: string;
  // color de acento (línea o punto activo) - opcional
  accent?: string; // ej. "#E53935" (por defecto)
};

const DEFAULT_ACCENT = "#E53935";

const SLIDES: Slide[] = [
  {
    id: "light",
    title: "Vehículos ligeros",
    subtitle: "Programas para flotillas ejecutivas y autos de servicio.",
    imgSrc: "/assets/VideoCoachVial.png",
    alt: "Vehículo ligero en fondo de estudio",
    accent: "#E53935",
  },
  {
    id: "heavy",
    title: "Transporte pesado",
    subtitle: "Operadores profesionales y gestión de riesgo en ruta.",
    imgSrc: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1600&h=900&fit=crop&q=80",
    alt: "Tracto camión en entorno industrial",
    accent: "#FB8C00",
  },
  {
    id: "moto",
    title: "Motocicletas",
    subtitle: "Técnicas defensivas y conciencia situacional urbana.",
    imgSrc: "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=1600&h=900&fit=crop&q=80",
    alt: "Motocicleta en pista de práctica",
    accent: "#43A047",
  },
  {
    id: "lift",
    title: "Montacargas",
    subtitle: "Seguridad operativa y maniobras en espacios reducidos.",
    imgSrc: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&h=900&fit=crop&q=80",
    alt: "Montacargas en almacén",
    accent: "#1E88E5",
  },
  {
    id: "4x4",
    title: "4x4",
    subtitle: "Control técnico y rutas fuera de carretera.",
    imgSrc: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1600&h=900&fit=crop&q=80",
    alt: "Vehículo 4x4 en terreno agreste",
    accent: "#8E24AA",
  },
  {
    id: "pickup",
    title: "Pick-ups",
    subtitle: "Operación segura, carga y maniobra en campo.",
    imgSrc: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1600&h=900&fit=crop&q=80",
    alt: "Pick-up en exterior",
    accent: "#00897B",
  },
];

type Props = {
  slides?: Slide[];
  autoPlayMs?: number; // default 6000
  className?: string;
  accent?: string;
};

export default function Flotillas({
  slides = SLIDES,
  autoPlayMs = 6000,
  className = "",
  accent = DEFAULT_ACCENT,
}: Props) {
  const [index, setIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const [isUserNav, setIsUserNav] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 barra por slide
  const [dragX, setDragX] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  // Avanza con autoplay usando RAF para una barra de progreso fina y fluida
  useEffect(() => {
    const running = !isHover && !isUserNav && slides.length > 1;
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    setProgress(0);
    lastTsRef.current = null;

    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;

      setProgress((p) => {
        const next = p + dt / autoPlayMs;
        if (next >= 1) {
          // cambiar de slide y reiniciar progreso
          setIndex((i) => (i + 1) % slides.length);
          return 0;
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isHover, isUserNav, slides.length, autoPlayMs]);

  // Pausar cuando la pestaña no está visible
  useEffect(() => {
    const onVis = () => setIsUserNav((s) => (document.hidden ? true : s));
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Reset de isUserNav (evita quedarse “congelado” tras una interacción)
  useEffect(() => {
    if (!isUserNav) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setIsUserNav(false);
      timerRef.current = null;
    }, 2500);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [isUserNav]);

  const goTo = (i: number) => {
    setIsUserNav(true);
    setProgress(0);
    setIndex((i + slides.length) % slides.length);
  };
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Teclado accesible
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.matches(":focus-within")) return;

      if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  // Gestos (swipe) en móvil
  const onTouchStart = (e: React.TouchEvent) => {
    setDragX(e.touches[0].clientX);
    setIsUserNav(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (dragX == null) return;
    const delta = e.touches[0].clientX - dragX;
    // no animamos en vivo, solo detectamos intención
    if (Math.abs(delta) > 50) {
      delta < 0 ? next() : prev();
      setDragX(null);
    }
  };
  const onTouchEnd = () => setDragX(null);

  // Calcular índice anterior y siguiente (para parallax de entrada/salida)
  const prevIndex = (index - 1 + slides.length) % slides.length;

  // Transición “cinemática”: fade + deslizamiento + parallax
  const computeSlideStyle = (i: number) => {
    // slide actual visible
    if (i === index) {
      return {
        opacity: 1,
        transform: "translate3d(0,0,0)",
        zIndex: 2,
      } as React.CSSProperties;
    }
    // el inmediato anterior: se desplaza un poco a la izquierda y se desvanece
    if (i === prevIndex) {
      return {
        opacity: 0,
        transform: "translate3d(-20px,0,0)",
        zIndex: 1,
      } as React.CSSProperties;
    }
    // el resto: ocultos
    return {
      opacity: 0,
      transform: "translate3d(0,0,0)",
      zIndex: 0,
      pointerEvents: "none",
    } as React.CSSProperties;
  };

  // Parallax para la imagen del slide activo (sutil)
  const parallax = useMemo(() => {
    // mapeamos el progreso a un leve desplazamiento de la imagen
    // mientras corre el autoplay, la imagen se mueve muy poco
    const dx = Math.sin(progress * Math.PI) * 10; // -10..10 px
    const dy = Math.cos(progress * Math.PI) * 6;  // -6..6 px
    return { dx, dy };
  }, [progress]);

  const current = slides[index];
  const currentAccent = current.accent || accent;

  return (
    <section
      id="fleets"
      className={[
        "relative isolate w-full",
        "bg-[linear-gradient(180deg,#f8fafc,rgba(248,250,252,0.6))]",
        "pt-12 md:pt-16 pb-14 md:pb-20",
        className,
      ].join(" ")}
      aria-label="Flotillas"
    >
      {/* Textura sutil */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15,23,42,0.08) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />

      <div className="container mx-auto max-w-7xl px-6">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <h2 className="text-[clamp(2rem,4.6vw,3rem)] font-black tracking-tight text-[#0f172a] leading-tight">
            Trabajamos con todo tipo de <span className="text-[#0f172a]">flotillas</span>
          </h2>
          <p className="mt-3 text-[clamp(1rem,2.1vw,1.1rem)] text-slate-600">
            Desde vehículos ligeros hasta transporte pesado—adaptamos nuestros programas a cada unidad y sector.
          </p>
          <div
            aria-hidden
            className="mx-auto mt-5 h-1.5 w-24 rounded-full"
            style={{ backgroundColor: currentAccent, opacity: 0.9 }}
          />
        </header>

        {/* Carrusel */}
        <div
          ref={containerRef}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Tipos de flotillas"
          tabIndex={0}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="
            relative
            rounded-2xl overflow-hidden
            ring-1 ring-black/10 shadow-2xl
            bg-gradient-to-br from-slate-900 to-slate-800
          "
        >
          {/* Slides */}
          <ul className="relative h-full min-h-[52vh] md:min-h-[60vh] lg:min-h-[64vh] list-none m-0 p-0">
            {slides.map((s, i) => (
              <li
                key={s.id}
                aria-hidden={i !== index}
                className="
                  absolute inset-0
                  transition-all duration-700 ease-[cubic-bezier(.22,.61,.36,1)]
                  will-change-transform
                "
                style={computeSlideStyle(i)}
              >
                {/* Imagen con parallax sutil */}
                <div className="absolute inset-0">
                  <img
                    src={s.imgSrc}
                    alt={s.alt}
                    className="h-full w-full object-cover"
                    style={{
                      transform: `translate3d(${i === index ? parallax.dx : 0}px, ${
                        i === index ? parallax.dy : 0
                      }px, 0) scale(1.02)`,
                      transition: "transform 700ms ease",
                    }}
                    loading="lazy"
                  />
                  {/* Overlay cinematográfico */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/25 to-transparent" />
                </div>

                {/* Contenido (texto centrado) */}
                <div className="relative z-10 flex min-h-[52vh] md:min-h-[60vh] lg:min-h-[64vh] items-end md:items-center">
                  <div className="w-full p-6 md:p-10">
                    <div
                      className="
                        max-w-3xl
                        bg-white/80 backdrop-blur
                        rounded-2xl
                        p-4 md:p-6
                        ring-1 ring-white/60 shadow-lg
                      "
                    >
                      <div className="flex items-start gap-3">
                        {/* Píldora de acento minimal */}
                        <span
                          className="mt-2 block h-6 w-1.5 rounded-full"
                          style={{ background: s.accent || accent }}
                          aria-hidden
                        />
                        <div className="flex-1">
                          <h3 className="text-[clamp(1.4rem,3.4vw,2rem)] font-extrabold text-[#0f172a] leading-tight">
                            {s.title}
                          </h3>
                          <p className="mt-1 text-[clamp(0.95rem,2vw,1.05rem)] text-slate-700 leading-relaxed">
                            {s.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <a
                          href="#contact"
                          className="
                            inline-flex items-center rounded-lg
                            bg-white px-4 py-2 text-xs font-bold text-slate-900
                            ring-1 ring-slate-300 shadow-sm
                            transition hover:bg-slate-50 hover:-translate-y-0.5
                          "
                        >
                          Solicitar asesoría
                        </a>
                        <a
                          href="#services"
                          className="
                            inline-flex items-center rounded-lg
                            bg-transparent px-4 py-2 text-xs font-bold
                            text-slate-800 ring-1 ring-slate-300
                            transition hover:bg-white/60 hover:-translate-y-0.5
                          "
                        >
                          Ver servicios relacionados
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Controles */}
          <button
            aria-label="Anterior"
            onClick={prev}
            className="
              absolute left-3 top-1/2 -translate-y-1/2
              z-30
              grid place-items-center
              h-10 w-10 md:h-11 md:w-11
              rounded-full bg-white/80 backdrop-blur ring-1 ring-white/70
              shadow-md transition
              hover:-translate-x-0.5 hover:bg-white
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400
            "
          >
            <span className="sr-only">Anterior</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-900">
              <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <button
            aria-label="Siguiente"
            onClick={next}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              z-30
              grid place-items-center
              h-10 w-10 md:h-11 md:w-11
              rounded-full bg-white/80 backdrop-blur ring-1 ring-white/70
              shadow-md transition
              hover:translate-x-0.5 hover:bg-white
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400
            "
          >
            <span className="sr-only">Siguiente</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-900">
              <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          {/* Indicadores + barra de progreso */}
          <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center gap-2 px-3 z-30">
            {/* barra progreso del slide actual */}
            <div className="h-1.5 w-full max-w-md rounded-full bg-white/40 backdrop-blur">
              <div
                className="h-1.5 rounded-full transition-[width] duration-150"
                style={{
                  width: `${Math.min(progress, 1) * 100}%`,
                  background: currentAccent,
                }}
              />
            </div>

            {/* dots */}
            <div className="flex items-center gap-2">
              {slides.map((s, i) => {
                const active = i === index;
                return (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    aria-label={`Ir a ${s.title}`}
                    aria-current={active ? "true" : "false"}
                    className="
                      h-2.5 w-2.5 rounded-full ring-2
                      transition
                    "
                    style={{
                      background: active ? currentAccent : "rgba(255,255,255,0.7)",
                      ringColor: "rgba(255,255,255,0.7)",
                    } as React.CSSProperties}
                  />
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Fade hacia la siguiente sección */}
      <div
        aria-hidden
        className="absolute -bottom-px left-0 right-0 h-20 bg-gradient-to-b from-transparent via-white/50 to-white"
      />
    </section>
  );
}
