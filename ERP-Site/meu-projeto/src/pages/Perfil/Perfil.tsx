import { FormEvent, useEffect, useState } from "react";
import { KeyRound, Save, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import {
  atualizarMeuNome,
  alterarSenha,
  obterMeuPerfil,
  type UsuarioAcesso,
} from "../../services/authService";
import "./Perfil.css";

export default function Perfil() {
  const [usuario, setUsuario] = useState<UsuarioAcesso | null>(null);
  const [nome, setNome] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [salvandoNome, setSalvandoNome] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  useEffect(() => {
    obterMeuPerfil()
      .then((u) => {
        setUsuario(u);
        setNome(u.nome);
      })
      .catch(() => toast.error("Não foi possível carregar seu perfil."));
  }, []);

  async function enviarNome(event: FormEvent) {
    event.preventDefault();
    if (!nome.trim() || nome.trim().length > 120)
      return toast.error("Informe um nome com até 120 caracteres.");
    setSalvandoNome(true);
    try {
      const atualizado = await atualizarMeuNome(nome.trim());
      setUsuario(atualizado);
      setNome(atualizado.nome);
      toast.success("Seu nome foi atualizado.");
    } catch (e: any) {
      toast.error(
        e.response?.data?.message || "Não foi possível atualizar o nome.",
      );
    } finally {
      setSalvandoNome(false);
    }
  }

  async function enviarSenha(event: FormEvent) {
    event.preventDefault();
    if (novaSenha.length < 6 || novaSenha.length > 72)
      return toast.error("A nova senha deve ter entre 6 e 72 caracteres.");
    if (novaSenha !== confirmacao)
      return toast.error("A confirmação da senha não confere.");
    setSalvandoSenha(true);
    try {
      await alterarSenha(senhaAtual, novaSenha);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmacao("");
      toast.success("Senha alterada com sucesso.");
      const atualizado = await obterMeuPerfil();
      setUsuario(atualizado);
      setNome(atualizado.nome);
    } catch (e: any) {
      toast.error(
        e.response?.data?.message ||
          e.message ||
          "Não foi possível alterar a senha.",
      );
    } finally {
      setSalvandoSenha(false);
    }
  }

  return (
    <main className="perfil-page">
      <header className="perfil-heading">
        <div>
          <h1>Meu perfil</h1>
          <p>Atualize seu nome e gerencie sua senha pessoal.</p>
        </div>
      </header>
      <section className="perfil-card">
        <div className="perfil-card-title">
          <UserRound />
          <div>
            <h2>Dados pessoais</h2>
            <p>Você só pode alterar os dados da sua própria conta.</p>
          </div>
        </div>
        <form onSubmit={enviarNome} className="perfil-form">
          <label>
            Nome completo
            <input
              value={nome}
              maxLength={120}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </label>
          <label>
            Nome de usuário
            <input value={usuario?.nomeUsuario || ""} readOnly />
          </label>
          <label>
            Perfil
            <input value={usuario?.perfil || ""} readOnly />
          </label>
          <button type="submit" disabled={salvandoNome}>
            <Save size={17} />
            {salvandoNome ? "Salvando..." : "Salvar nome"}
          </button>
        </form>
      </section>
      <section className="perfil-card">
        <div className="perfil-card-title">
          <KeyRound />
          <div>
            <h2>Alterar minha senha</h2>
            <p>
              Informe sua senha atual. A nova senha deve ter de 6 a 72
              caracteres.
            </p>
          </div>
        </div>
        <form onSubmit={enviarSenha} className="perfil-form">
          <label>
            Senha atual
            <input
              type="password"
              autoComplete="current-password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              required
            />
          </label>
          <label>
            Nova senha
            <input
              type="password"
              autoComplete="new-password"
              minLength={6}
              maxLength={72}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
          </label>
          <label>
            Confirmar nova senha
            <input
              type="password"
              autoComplete="new-password"
              minLength={6}
              maxLength={72}
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={salvandoSenha}>
            <KeyRound size={17} />
            {salvandoSenha ? "Alterando..." : "Alterar senha"}
          </button>
        </form>
      </section>
    </main>
  );
}
