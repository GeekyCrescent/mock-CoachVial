export type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export const navItems: NavItem[] = [
  { label: "Inicio", href: "#hero" },
  { label: "Nosotros", href: "#about" },
  {
    label: "Servicios",
    children: [
      { label: "Asesoría y Diagnóstico", href: "#asesoria" },
      { label: "Capacitaciones", href: "#capacitaciones" },
    ],
  },
  { label: "Flotillas", href: "#flotillas" },
  { label: "Beneficios", href: "#beneficios" },
];
