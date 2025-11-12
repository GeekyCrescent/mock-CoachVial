import { useEffect, useRef, useState } from "react";
import { Building2, ShieldCheck, Users } from "lucide-react";

export default function About() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  // Animación de entrada suave al hacer scroll
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative isolate w-full"
      aria-label="About Coach Vial"
    >
      {/* Fondo muy sutil para conectar con el Hero */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white to-[#e53935]/10" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.6) 1px, transparent 1px)",
          backgroundSize: "10px 10px",
        }}
      />

      <div className="container mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div
          className={[
            "grid items-start gap-12 md:grid-cols-2",
            "transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ].join(" ")}
        >
          {/* Columna izquierda: texto */}
          <div className="order-2 md:order-1">
            <h2 className="text-[clamp(2rem,4.6vw,3rem)] font-black leading-tight tracking-tight text-[#0f172a]">
              Formamos conductores{" "}
              <span className="text-[#E53935]">seguros</span>, construimos{" "}
              <span className="text-[#E53935]">cultura vial</span>.
            </h2>

            <div className="mt-6 space-y-5 text-[clamp(1rem,2.1vw,1.1rem)] leading-relaxed text-slate-600">
              <p>
                En <strong>Coach Vial</strong> creemos que la seguridad no se
                limita a la teoría: se construye con experiencia, acompañamiento
                y conciencia. Ayudamos a las empresas y a sus equipos a
                desarrollar <strong>hábitos seguros al volante</strong>,
                reduciendo riesgos y fortaleciendo su cultura organizacional.
              </p>
              <p>
                A través de <strong>capacitaciones</strong>,{" "}
                <strong>auditorías</strong> y <strong>programas
                personalizados</strong>, transformamos la forma en que se
                entiende la conducción. Cada curso y evaluación se diseña para{" "}
                <strong>medir resultados reales</strong> y fomentar una
                conducción responsable, profesional y sostenible.
              </p>
              <p>
                Más que una empresa, somos una comunidad comprometida con la{" "}
                <strong>vida</strong> y la <strong>seguridad en las
                carreteras</strong>. Acompañamos a nuestros clientes antes,
                durante y después de cada proceso formativo.
              </p>
            </div>

            {/* Frase de cierre */}
            <p className="mt-6 italic text-slate-500">
              "Conducir seguro no es una meta, es un compromiso diario."
            </p>
          </div>

          {/* Columna derecha: imagen y cards */}
          <div className="order-1 md:order-2 space-y-8">
            <div
              className="group relative w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10"
              // Parallax sutil en hover para dar vida sin distraer
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900">
                {/* Reemplaza la ruta por tu foto real del equipo */}
                <img
                  src="/assets/SobreNosotrosImagen.png"
                  alt="Equipo Coach Vial durante una capacitación"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                {/* Overlay muy suave para integrar con la paleta */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
              </div>
            </div>

            {/* Métricas / sellos de confianza */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-red-50 ring-1 ring-[#E53935]/30">
                    <Users className="h-5 w-5 text-[#E53935]" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-[#0f172a]">
                      +500
                    </div>
                    <div className="text-sm text-slate-600">
                      Conductores capacitados
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-red-50 ring-1 ring-[#E53935]/30">
                    <Building2 className="h-5 w-5 text-[#E53935]" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-[#0f172a]">
                      +100
                    </div>
                    <div className="text-sm text-slate-600">
                      Empresas aliadas
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-red-50 ring-1 ring-[#E53935]/30">
                    <ShieldCheck className="h-5 w-5 text-[#E53935]" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-[#0f172a]">
                      10+
                    </div>
                    <div className="text-sm text-slate-600">
                      Años de experiencia
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transición sutil hacia la siguiente sección */}
      <div
        aria-hidden
        className="absolute -bottom-px left-0 right-0 h-20 bg-gradient-to-b from-transparent via-white/50 to-white"
      />
    </section>
  );
}
