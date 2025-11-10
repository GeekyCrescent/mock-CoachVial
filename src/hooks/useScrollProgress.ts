import { useEffect, useRef, useState } from "react";

/**
 * Progreso de scroll 0..1 que AUMENTA al scrollear hacia abajo.
 * start y end son umbrales en px sobre la distancia scrolleada "hacia abajo"
 * desde el bottom del viewport.
 *
 * Ejemplo: { start: 0, end: 800 }  → 0 cuando el elemento entra al viewport, 1 tras scrollear 800px.
 */
export function useScrollProgress<T extends HTMLElement>(
  { start = 0, end = 600 }: { start?: number; end?: number } = {}
) {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      if (!ref.current) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Calculamos cuánto ha scrolleado el elemento desde el bottom del viewport
      // Cuando rect.top = vh (apenas entra), scrolled = 0
      // Cuando rect.top = 0 (top del viewport), scrolled = vh
      // Cuando rect.top < 0 (sale por arriba), scrolled > vh
      const scrolled = vh - rect.top;

      // Normalizamos el progreso entre start y end
      const p = Math.min(1, Math.max(0, (scrolled - start) / (end - start)));
      setProgress(p);

      raf = requestAnimationFrame(tick);
    };

    tick();
    const onResize = () => tick();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [start, end]);

  return { ref, progress };
}
