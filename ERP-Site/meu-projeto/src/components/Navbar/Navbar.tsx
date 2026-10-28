import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  UserRound,
} from "lucide-react";
import { obterUsuario, sair } from "../../services/authService";
import "./Navbar.css";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const usuario = obterUsuario();
  const iniciais = (usuario?.nome || "Usuário")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  function handleSair() {
    sair();
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <button
        className="navbar-menu-button"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>
      <div className="search-box">
        <input type="text" placeholder="Pesquisar no sistema..." />
        <Search size={21} />
      </div>
      <div className="navbar-actions">
        <button className="notification-button" aria-label="Notificações">
          <Bell size={22} />
        </button>
        <button
          className="user-profile"
          onClick={() => navigate("/perfil")}
          title="Ver perfil"
          style={{
            border: 0,
            background: "transparent",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div className="user-avatar">
            {iniciais || <UserRound size={18} />}
          </div>
          <div className="user-info">
            <strong>{usuario?.nome || "Usuário"}</strong>
            <span>{usuario?.perfil || "Conta"}</span>
          </div>
          <ChevronDown size={18} />
        </button>
        <button
          className="notification-button"
          onClick={handleSair}
          title="Sair da conta"
          aria-label="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
