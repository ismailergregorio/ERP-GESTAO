import { useState, type ReactNode } from "react";
import Nav from "../Componete/ComponeteLayout/Nav/Nav";
import "./LayoutPages-css.css";
import NavBar from "../Componete/ComponeteLayout/Nav-Bar/Nav-bar";

interface LayoutProps {
  children: ReactNode;
  title: string;
}
export default function Layout({ children, title }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main>
      <Nav open={menuOpen} />
      <div className="nav-var">
        <NavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} title={title} />
        <div className="conteudo">{children}</div>
      </div>
    </main>
  );
}
