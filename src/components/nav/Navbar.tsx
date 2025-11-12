import { useEffect, useState } from "react";
import { navItems } from "./navItems";
import { CarFront } from "lucide-react"; 

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-4">
      <div
        className={[
          "mx-auto max-w-7xl flex items-center justify-between",
          "rounded-2xl bg-white/90 backdrop-blur border border-neutral-200",
          scrolled ? "shadow-sm" : "shadow-none",
          "transition-all",
        ].join(" ")}
      >
        {/* Brand */}
        <a
          href="#hero"
          className="flex items-center gap-2 px-4 py-2"
          aria-label="Coach Vial - Inicio"
        >
          <span className="inline-grid place-items-center h-9 w-9 rounded-xl bg-red-400">
            <CarFront className="h-5 w-5 text-neutral-900" strokeWidth={2} />
          </span>
          <span className="text-base font-semibold text-neutral-900">
            Coach Vial
          </span>
        </a>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) =>
            item.children ? (
              <li key={item.label} className="relative group">
                <button
                  className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm text-neutral-700 hover:bg-red-50"
                  aria-haspopup="menu"
                >
                  {item.label}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    className="text-neutral-500"
                  >
                    <path
                      d="M7 10l5 5 5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div
                  className="invisible opacity-0 group-hover:visible group-hover:opacity-100
                             absolute left-0 top-10 min-w-[200px] translate-y-2 group-hover:translate-y-0
                             transition-all duration-200"
                >
                  <div className="rounded-xl border border-neutral-200 bg-white shadow-lg p-2">
                    {item.children.map((c) => (
                      <a
                        key={c.label}
                        href={c.href}
                        className="block rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-red-50"
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              </li>
            ) : (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="rounded-xl px-3 py-2 text-sm text-neutral-700 hover:bg-red-50"
                >
                  {item.label}
                </a>
              </li>
            )
          )}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center pr-4">
          <a
            href="#contact"
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition "
          >
            Contáctanos
          </a>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden p-3 text-neutral-800"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            {open ? (
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur mt-2 shadow-sm">
          <ul className="grid gap-1 p-3">
            {navItems.map((item) =>
              item.children ? (
                <li key={item.label}>
                  <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {item.label}
                  </div>
                  <div className="mb-1 grid">
                    {item.children.map((c) => (
                      <a
                        key={c.label}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-red-50"
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-red-50"
                  >
                    {item.label}
                  </a>
                </li>
              )
            )}
          </ul>

          <div className="px-3 pb-4">
            <a
              href="#contact"
              className="block w-full text-center rounded-xl bg-red-500 px-3 py-3 text-sm font-semibold text-white hover:bg-red-600 transition "
            >
              Contáctanos
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
