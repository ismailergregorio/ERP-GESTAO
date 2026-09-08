import {
  Menu,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

import "./Navbar.css";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="navbar">

      <button
        className="navbar-menu-button"
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </button>

      <div className="search-box">

        <input
          type="text"
          placeholder="Pesquisar no sistema..."
        />

        <Search size={21} />

      </div>

      <div className="navbar-actions">

        <button className="notification-button">

          <Bell size={22} />

          <span className="notification-badge">
            3
          </span>

        </button>

        <div className="user-profile">

          <div className="user-avatar">
            JS
          </div>

          <div className="user-info">

            <strong>João Silva</strong>

            <span>Administrador</span>

          </div>

          <ChevronDown size={18} />

        </div>

      </div>

    </header>
  );
}