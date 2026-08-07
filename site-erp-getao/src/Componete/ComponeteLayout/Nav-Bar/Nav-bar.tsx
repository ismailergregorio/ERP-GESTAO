import { Menu, Bell, CircleUserRound } from "lucide-react";
import "./Nav-bar-css.css";

interface NavBarProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
}

export default function NavBar({ menuOpen, setMenuOpen ,title="Não Definido"}: NavBarProps) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu size={22} />
        </button>

        <h2>{title}</h2>
      </div>

      <div className="navbar-right">
        <button className="icon-button">
          <Bell size={20} />
        </button>

        <button className="icon-button">
          <CircleUserRound size={28} />
        </button>
      </div>
    </header>
  );
}
