import Navbar from "../components/nav/Navbar";
import Hero from "../sections/Hero";
import React from "react";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      {/* Elementos fijos */}
      <Navbar />

      {/* Contenido principal */}
      <main className="relative">
        <Hero />
        {children}
      </main>
    </>
  );
}
