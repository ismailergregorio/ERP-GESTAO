import { Navigate, Outlet } from "react-router-dom";
import { obterUsuario } from "../services/authService";

export default function ProtectedRoute() {
  const token = sessionStorage.getItem("erp_token");
  const usuario = obterUsuario();
  if (!token || !usuario) return <Navigate to="/login" replace />;
  if (usuario.trocarSenha) return <Navigate to="/alterar-senha" replace />;
  return <Outlet />;
}
