import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  ClipboardList,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Package,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "react-toastify";
import { login } from "../services/authService";
import "./Login.css";

export default function Login() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCarregando(true);
    try {
      const resposta = await login(nomeUsuario.trim(), senha);
      if (lembrar)
        localStorage.setItem("erp_ultimo_usuario", nomeUsuario.trim());
      else localStorage.removeItem("erp_ultimo_usuario");
      toast.success(`Bem-vindo, ${resposta.usuario.nome}!`);
      navigate(resposta.trocarSenha ? "/alterar-senha" : "/", {
        replace: true,
      });
    } catch (error: unknown) {
      const e = error as {
        response?: { data?: { message?: string; mensagem?: string } };
      };
      toast.error(
        e.response?.data?.message ||
          e.response?.data?.mensagem ||
          "Não foi possível entrar. Confira usuário e senha.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <aside className="login-presentation">
          <div className="login-brand login-brand-light">
            <span className="login-brand-mark">
              <Box size={34} strokeWidth={2.2} />
            </span>
            <div>
              <strong>
                Dev <em>ERP</em>
              </strong>
              <small>Gestão de Estoque e Controle Interno</small>
            </div>
          </div>
          <div className="login-intro">
            <span className="login-eyebrow">GESTÃO INTELIGENTE</span>
            <h1>
              Mais controle
              <br />
              para o seu negócio.
            </h1>
            <p>
              Gerencie produtos, estoque, entradas e saídas em um só lugar, com
              praticidade e segurança.
            </p>
          </div>
          <div className="login-features">
            <div className="login-feature">
              <span>
                <Package size={23} />
              </span>
              <div>
                <strong>Controle de estoque</strong>
                <small>Acompanhe entradas e saídas</small>
              </div>
            </div>
            <div className="login-feature">
              <span>
                <ClipboardList size={23} />
              </span>
              <div>
                <strong>Gestão de notas fiscais</strong>
                <small>Organize documentos e produtos</small>
              </div>
            </div>
            <div className="login-feature">
              <span>
                <UserRound size={23} />
              </span>
              <div>
                <strong>Controle interno</strong>
                <small>Cadastros e operações centralizados</small>
              </div>
            </div>
            <div className="login-feature">
              <span>
                <ShieldCheck size={23} />
              </span>
              <div>
                <strong>Acesso protegido</strong>
                <small>Permissões por perfil de usuário</small>
              </div>
            </div>
          </div>
          <div className="login-presentation-footer">
            Organização, eficiência e confiança em cada operação.
          </div>
        </aside>

        <section className="login-form-panel">
          <div className="login-form-inner">
            <div className="login-brand login-brand-dark">
              <span className="login-brand-mark">
                <Box size={32} strokeWidth={2.2} />
              </span>
              <strong>
                Dev <em>ERP</em>
              </strong>
            </div>
            <p className="login-subtitle">Faça login para acessar o sistema</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="nomeUsuario">Usuário</label>
              <div className="login-input-wrap">
                <UserRound size={20} />
                <input
                  id="nomeUsuario"
                  autoComplete="username"
                  value={nomeUsuario}
                  onChange={(e) => setNomeUsuario(e.target.value)}
                  placeholder="Digite seu usuário"
                  required
                  autoFocus
                />
              </div>
              <label htmlFor="senha">Senha</label>
              <div className="login-input-wrap">
                <LockKeyhole size={20} />
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  className="login-show-password"
                  type="button"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(e) => setLembrar(e.target.checked)}
                />{" "}
                <span>Lembrar meu usuário</span>
              </label>
              <button
                className="login-submit"
                type="submit"
                disabled={carregando}
              >
                {carregando ? (
                  <span className="login-spinner" />
                ) : (
                  <LogIn size={21} />
                )}
                {carregando ? "Entrando..." : "Entrar"}
              </button>
            </form>
            <div className="login-security">
              <ShieldCheck size={17} />
              <span>Conexão autenticada e acesso controlado</span>
            </div>
            <p className="login-help">
              Problemas para acessar? Entre em contato com o administrador do
              sistema.
            </p>
          </div>
          <footer className="login-copyright">
            © {new Date().getFullYear()} Dev ERP · Sistema de gestão interna
          </footer>
        </section>
      </section>
    </main>
  );
}
