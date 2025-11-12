// src/components/Services.tsx
import { useEffect, useRef, useState } from "react";
import {
  Search,
  ClipboardCheck,
  Settings,
  BarChart3,
  BadgeCheck,
  ShieldCheck,
  Brain,
  Wrench,
  BookOpen,
} from "lucide-react";

/* ================== DATOS ================== */
const TIMELINE = [
  {
    key: "01",
    title: "Diagnóstico Inicial",
    bullets: [
      "Levantamiento de información y normativa aplicable",
      "Diagnóstico de flotilla y clasificación de accidentes",
    ],
    services: ["Diagnóstico de flotilla", "Clasificación de accidentes", "NRT"],
    icon: Search,
  },
  {
    key: "02",
    title: "Auditoría & Análisis",
    bullets: [
      "Evaluación de procesos en campo y causa raíz",
      "Análisis de telemetría y peritajes",
    ],
    services: [
      "Auditoría de Seguridad Vial",
      "Telemetría aplicada",
      "Peritajes",
      "Análisis de causa raíz",
    ],
    icon: ClipboardCheck,
  },
  {
    key: "03",
    title: "Plan & Implementación",
    bullets: [
      "Política, campañas y comités de Seguridad Vial",
      "Soluciones de ruteo y logística",
    ],
    services: [
      "Política de SV",
      "Campañas de concientización",
      "Comités de SV",
      "Ruteo y logística",
    ],
    icon: Settings,
  },
  {
    key: "04",
    title: "Monitoreo & Mejora continua",
    bullets: [
      "KPI de seguridad y tablero de seguimiento",
      "Road Safety System y retroalimentación",
    ],
    services: ["KPI’s de SV", "Road Safety System", "Mejora continua"],
    icon: BarChart3,
  },
  {
    key: "05",
    title: "Certificación & Cultura",
    bullets: [
      "Acompañamiento hacia ISO 39001",
      "Consolidación de hábitos y promotores",
    ],
    services: ["ISO 39001", "PSV", "Capacitaciones clave"],
    icon: BadgeCheck,
  },
];

const TRAININGS = [
  { code: "CMP", name: "Concientización en el manejo preventivo", group: "Prevención y Conciencia" },
  { code: "MER", name: "Maniobras en espacios reducidos", group: "Técnicas de Conducción" },
  { code: "IEC", name: "Inteligencia emocional en la conducción", group: "Habilidades Humanas" },
  { code: "PRT", name: "Prevención de robo al transporte", group: "Prevención y Conciencia" },
  { code: "PAT", name: "Prevención de adicciones en el transporte", group: "Prevención y Conciencia" },
  { code: "CTE", name: "Conducción técnico eficiente", group: "Técnicas de Conducción" },
  { code: "IPU", name: "Inspección previa de unidad", group: "Técnicas de Conducción" },
  { code: "NRT", name: "Normatividad y reglamentación", group: "Gestión y Normatividad" },
  { code: "ISO", name: "ISO 39001 Gestión de la Seguridad Vial", group: "Gestión y Normatividad" },
  { code: "PSV", name: "Promotor de la Seguridad Vial", group: "Gestión y Normatividad" },
  { code: "TPT", name: "Taller de psicología en el transporte", group: "Habilidades Humanas" },
  { code: "CAT", name: "Comunicación asertiva en el transporte", group: "Habilidades Humanas" },
];

const GROUPS = [
  "Prevención y Conciencia",
  "Técnicas de Conducción",
  "Gestión y Normatividad",
  "Habilidades Humanas",
];

/* ================== COMPONENTE ================== */
export default function Services() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Refs por fila (card) e ícono para calcular su posición respecto al centro del viewport
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const iconRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Parallax: valores de translateY por fila (cards) y por icono (izquierda)
  const [cardParallax, setCardParallax] = useState<number[]>(
    Array(TIMELINE.length).fill(0)
  );
  const [iconParallax, setIconParallax] = useState<number[]>(
    Array(TIMELINE.length).fill(0)
  );

  // Paso activo (el más cercano al centro del viewport)
  const [activeIndex, setActiveIndex] = useState(0);

  // Performance: prefer-reduced-motion
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Parallax con RAF
  useEffect(() => {
    let raf = 0;

    const update = () => {
      const cards = rowRefs.current;
      const icons = iconRefs.current;
      const vpCenter = window.innerHeight / 2;

      const newCard: number[] = [];
      const newIcon: number[] = [];
      let bestIndex = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      for (let i = 0; i < TIMELINE.length; i++) {
        const cardEl = cards[i];
        const iconEl = icons[i];

        if (!cardEl || !iconEl) {
          newCard[i] = 0;
          newIcon[i] = 0;
          continue;
        }

        const cardRect = cardEl.getBoundingClientRect();
        const iconRect = iconEl.getBoundingClientRect();

        const cardCenter = cardRect.top + cardRect.height / 2;
        const iconCenter = iconRect.top + iconRect.height / 2;

        const dCard = cardCenter - vpCenter;
        const dIcon = iconCenter - vpCenter;

        const ad = Math.abs(dCard);
        if (ad < bestDist) {
          bestDist = ad;
          bestIndex = i;
        }

        const cardSpeed = 0.12;
        const iconSpeed = 0.06;
        const r = prefersReducedMotion.current ? 0.25 : 1;

        newCard[i] = -(dCard * cardSpeed * r);
        newIcon[i] = -(dIcon * iconSpeed * r);
      }

      setCardParallax(newCard);
      setIconParallax(newIcon);
      setActiveIndex(bestIndex);

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Carrusel Capacitaciones (flechas opcionales)
  const railRef = useRef<HTMLDivElement | null>(null);


  /* ===== Nuevo estado y metadatos para la sección Capacitaciones ===== */
  const [activeGroup, setActiveGroup] = useState<string>("Prevención y Conciencia");

  const GROUP_META: Record<
    string,
    {
      icon: React.ComponentType<{ className?: string }>;
      badgeClass: string; // color de la pill
      dotClass: string;   // color del puntito decorativo
    }
  > = {
    "Prevención y Conciencia": {
      icon: ShieldCheck,
      badgeClass: "bg-red-50 text-[#E53935] ring-[#E53935]/30",
      dotClass: "bg-[#E53935]",
    },
    "Técnicas de Conducción": {
      icon: Wrench,
      badgeClass: "bg-blue-50 text-blue-700 ring-blue-200",
      dotClass: "bg-blue-600",
    },
    "Gestión y Normatividad": {
      icon: BookOpen,
      badgeClass: "bg-slate-50 text-slate-800 ring-slate-300",
      dotClass: "bg-slate-700",
    },
    "Habilidades Humanas": {
      icon: Brain,
      badgeClass: "bg-amber-50 text-amber-800 ring-amber-300",
      dotClass: "bg-amber-600",
    },
  };

  const filteredTrainings = TRAININGS.filter((t) => t.group === activeGroup);

  return (
    <section id="services" className="relative isolate w-full">
      {/* Fondo con degradado y textura sutil */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white to-[#e53935]/10" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(rgba(0,0,0,0.6) 1px, transparent 1px)",
          backgroundSize: "10px 10px",
        }}
      />

      <div className="container mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Header global */}
        <header className="mb-12 md:mb-16 text-center">
          <h2 className="text-[clamp(2rem,4.6vw,3rem)] font-black leading-tight tracking-tight text-[#0f172a]">
            Nuestros <span className="text-[#E53935]">Servicios</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[clamp(1rem,2.1vw,1.1rem)] text-slate-600">
            Soluciones integrales para una movilidad más segura: asesoría, diagnóstico y formación especializada.
          </p>
        </header>

        {/* ====== Bloque 1: Asesoría y Diagnóstico con PARALLAX ====== */}
        <section ref={sectionRef} aria-label="Asesoría y Diagnóstico" className="relative">
          {/* Header sticky */}
          <div className="top-4 z-20 mb-10">
            <div className="p-2 md:p-4">
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#0f172a]">
                Asesoría y Diagnóstico: <span className="text-[#E53935]">de 0 a ISO 39001</span>
              </h3>
              <p className="mt-2 text-sm md:text-base text-slate-600">
                Proceso consultivo en 5 etapas con métricas y entregables claros.
              </p>
              {/* Barra simple de progreso por pasos */}
              <div className="mt-4 h-1 rounded-full bg-neutral-200">
                <div
                  className="h-1 rounded-full bg-[#E53935] transition-[width] duration-300"
                  style={{ width: `${(activeIndex / (TIMELINE.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* GRID: col izquierda (íconos + línea) + col derecha (cards) */}
          <div className="relative grid grid-cols-[72px_minmax(0,1fr)] gap-x-6 md:gap-x-10">
            {/* Línea vertical de fondo */}
            <div className="pointer-events-none absolute left-[36px] top-0 bottom-0 w-0.5 bg-neutral-200" />

            {TIMELINE.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === activeIndex;
              const isDone = i < activeIndex;

              return (
                <div key={step.key} className="contents">
                  {/* Col izquierda: nodo con PARALLAX suave */}
                  <div
                    ref={(el) => { iconRefs.current[i] = el; }}
                    className="relative flex items-start justify-center"
                    style={{
                      transform: `translate3d(0, ${iconParallax[i] || 0}px, 0)`,
                      willChange: "transform",
                    }}
                  >
                    {/* Conector superior */}
                    {i > 0 && (
                      <div
                        className={[
                          "absolute top-0 -translate-x-1/2 h-6 w-0.5 -z-10",
                          isDone ? "bg-[#E53935]" : "bg-neutral-200",
                        ].join(" ")}
                        style={{ left: "50%" }}
                      />
                    )}

                    {/* Nodo */}
                    <div
                      className={[
                        "relative grid h-12 w-12 place-items-center rounded-full ring-4 ring-white transition-all z-10",
                        isActive
                          ? "bg-[#E53935] shadow-lg shadow-[#E53935]/30 scale-110"
                          : isDone
                          ? "bg-[#E53935] opacity-80"
                          : "bg-neutral-300",
                      ].join(" ")}
                    >
                      <Icon
                        className={
                          isActive || isDone
                            ? "h-5 w-5 text-white"
                            : "h-5 w-5 text-slate-600"
                        }
                      />
                      <span
                        className={[
                          "absolute -bottom-6 text-xs font-bold",
                          isActive ? "text-[#E53935]" : "text-slate-400",
                        ].join(" ")}
                      >
                        {step.key}
                      </span>
                    </div>

                    {/* Conector inferior */}
                    {i < TIMELINE.length -1 && (
                      <div
                        className={[
                          "absolute bottom-0 -translate-x-1/2 h-full w-0.5 -z-10",
                          isActive || isDone ? "bg-[#E53935]" : "bg-neutral-200",
                        ].join(" ")}
                        style={{ left: "50%" }}
                      />
                    )}
                  </div>

                  {/* Col derecha: CARD con PARALLAX medio */}
                  <div
                    ref={(el) => { rowRefs.current[i] = el; }}
                    className="pb-12"
                    style={{
                      transform: `translate3d(0, ${cardParallax[i] || 0}px, 0)`,
                      willChange: "transform",
                    }}
                  >
                    <div
                      className={[
                        "rounded-2xl border bg-white p-4 md:p-6 shadow-lg ring-1 transition-all duration-700",
                        isActive
                          ? "border-[#E53935]/30 ring-[#E53935]/40 shadow-[#E53935]/20 scale-100 opacity-100"
                          : "border-neutral-200 ring-black/5 scale-95 opacity-75",
                      ].join(" ")}
                    >
                      {/* Header */}
                      <div className="mb-4 flex items-start gap-3">
                        <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-red-50 to-red-100 ring-2 ring-[#E53935]/30">
                          <step.icon className="h-6 w-6 text-[#E53935]" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-extrabold tracking-wider text-[#E53935]">
                            ETAPA {step.key}
                          </div>
                          <h4 className="mt-1 text-xl md:text-2xl font-black text-[#0f172a]">
                            {step.title}
                          </h4>
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h5 className="mb-2 text-xs font-bold uppercase text-slate-500">
                            Actividades clave
                          </h5>
                          <ul className="space-y-2">
                            {step.bullets.map((b) => (
                              <li key={b} className="flex gap-2">
                                <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E53935]" />
                                <span className="text-sm text-slate-700">{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="mb-2 text-xs font-bold uppercase text-slate-500">
                            Servicios incluidos
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {step.services.map((s) => (
                              <span
                                key={s}
                                className="rounded-lg border border-[#E53935]/20 bg-red-50 px-3 py-1.5 text-xs font-semibold text-[#E53935]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <a
                          href="#contact"
                          className="inline-flex items-center rounded-lg bg-[#E53935] px-4 py-2 text-xs font-bold text-white ring-1 ring-[#E53935] shadow-lg shadow-[#E53935]/25 transition-all hover:-translate-y-0.5 hover:bg-[#d32f2f] hover:shadow-xl"
                        >
                          {i < TIMELINE.length - 1
                            ? "Ver entregables"
                            : "Agendar pre-auditoría"}
                        </a>
                        <a
                          href="#contact"
                          className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-xs font-bold text-slate-800 ring-1 ring-slate-300 shadow-md transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-lg"
                        >
                          Solicitar información
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ====== Bloque 2: Capacitaciones (REDISEÑADO) ====== */}
        <section className="mt-16 md:mt-24" aria-label="Capacitaciones">
          <div className="mb-6 md:mb-8 p-2 md:p-4">
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#0f172a]">
              Capacitaciones que <span className="text-[#E53935]">transforman conductores</span>
            </h3>
            <p className="mt-2 text-sm md:text-base text-slate-600">
              Programas presenciales y en línea para fortalecer cultura vial, técnica y cumplimiento.
            </p>
          </div>

          {/* Filtros por categoría */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={[
                  "rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition",
                  activeGroup === g
                    ? "bg-[#E53935] text-white ring-[#E53935]"
                    : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-50",
                ].join(" ")}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Grid / carrusel con scroll-snap en móviles */}
          <div
            ref={railRef}
            className="
              relative grid gap-4
              [grid-template-columns:repeat(1,minmax(0,1fr))]
              sm:[grid-template-columns:repeat(2,minmax(0,1fr))]
              lg:[grid-template-columns:repeat(3,minmax(0,1fr))]
              overflow-x-auto lg:overflow-x-visible
              snap-x snap-mandatory lg:snap-none
              pb-1
              [&>*]:snap-start
              lg:[&>*]:snap-none
              [&::-webkit-scrollbar]:h-2
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-slate-300/70
            "
          >
            {filteredTrainings.map((t, idx) => {
              const meta = GROUP_META[t.group];
              const Icon = meta?.icon ?? ShieldCheck;

              return (
                <article
                  key={t.code}
                  className="
                    group
                    shrink-0
                    rounded-2xl border border-neutral-200 bg-white p-5
                    shadow-sm ring-1 ring-black/5
                    transition-all duration-500 ease-out
                    hover:-translate-y-1 hover:shadow-xl
                    hover:border-[#E53935]/30 hover:ring-[#E53935]/20 hover:shadow-[#E53935]/10
                    animate-fadeInUp
                    opacity-0
                  "
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-neutral-50 ring-1 ring-slate-200 transition-all duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-neutral-800 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                    </span>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={[
                            "rounded-md px-2 py-1 text-xs font-extrabold ring-1",
                            meta?.badgeClass ?? "bg-slate-50 text-slate-800 ring-slate-300",
                          ].join(" ")}
                        >
                          {t.code}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <span
                            className={[
                              "h-1.5 w-1.5 rounded-full",
                              meta?.dotClass ?? "bg-slate-500",
                            ].join(" ")}
                          />
                          {t.group}
                        </span>
                      </div>

                      <h4 className="mt-2 text-base md:text-lg font-bold text-[#0f172a]">
                        {t.name}
                      </h4>

                      <p className="mt-2 text-sm text-slate-600">
                        Enfoque práctico y medible. Modalidad presencial y en línea.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <a
                          href="#contact"
                          className="inline-flex items-center rounded-lg bg-[#E53935] px-3 py-2 text-xs font-bold text-white ring-1 ring-[#E53935] hover:bg-[#d32f2f]"
                        >
                          Solicitar temario
                        </a>
                        <a
                          href="#contact"
                          className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-800 ring-1 ring-slate-300 hover:bg-slate-50"
                        >
                          Cotizar
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>          
        </section>
      </div>

      {/* Fade hacia la siguiente sección */}
      <div
        aria-hidden
        className="absolute -bottom-px left-0 right-0 h-20 bg-gradient-to-b from-transparent via-white/50 to-white"
      />
    </section>
  );
}
