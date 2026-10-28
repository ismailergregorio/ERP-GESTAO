import { useCallback, useEffect, useState } from "react";
import { KeyRound, RefreshCw, UserPlus, Users } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";
import {
  obterUsuario,
  resetarSenhaUsuario,
  type UsuarioAcesso,
} from "../../services/authService";
import "./UsuariosAcesso.css";

export default function UsuariosAcesso() {
  const [usuarios, setUsuarios] = useState<UsuarioAcesso[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [resetandoId, setResetandoId] = useState<number | null>(null);
  const [criando, setCriando] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    nomeUsuario: "",
    senhaTemporaria: "",
    perfil: "ESTOQUISTA" as UsuarioAcesso["perfil"],
  });
  const atual = obterUsuario();
  const isAdmin = atual?.perfil === "ADMIN";

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const response = await api.get<UsuarioAcesso[]>("/usuarios");
      setUsuarios(response.data);
    } catch (e: any) {
      toast.error(
        e.response?.data?.message ||
          "Não foi possível carregar os usuários. Apenas ADMIN pode acessar esta página.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) void carregar();
    else setCarregando(false);
  }, [carregar, isAdmin]);

  async function cadastrarUsuario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      novoUsuario.senhaTemporaria.length < 6 ||
      novoUsuario.senhaTemporaria.length > 72
    ) {
      toast.error("A senha temporária deve ter entre 6 e 72 caracteres.");
      return;
    }
    setCriando(true);
    try {
      await api.post("/usuarios", novoUsuario);
      toast.success(
        "Usuário cadastrado com sucesso. Ele deverá alterar a senha no primeiro acesso.",
      );
      setNovoUsuario({
        nome: "",
        nomeUsuario: "",
        senhaTemporaria: "",
        perfil: "ESTOQUISTA",
      });
      await carregar();
    } catch (e: any) {
      toast.error(
        e.response?.data?.message ||
          "Não foi possível cadastrar o usuário. Verifique se o nome de usuário já existe.",
      );
    } finally {
      setCriando(false);
    }
  }

  async function redefinir(usuario: UsuarioAcesso) {
    if (usuario.id === atual?.id) {
      toast.info("Para alterar sua própria senha, acesse Meu perfil.");
      return;
    }
    const senhaTemporaria = window.prompt(
      `Digite a senha temporária para ${usuario.nome} (6 a 72 caracteres):`,
    );
    if (senhaTemporaria === null) return;
    if (senhaTemporaria.length < 6 || senhaTemporaria.length > 72) {
      toast.error("A senha temporária deve ter entre 12 e 72 caracteres.");
      return;
    }
    setResetandoId(usuario.id);
    try {
      await resetarSenhaUsuario(usuario.id, senhaTemporaria);
      toast.success(
        `Senha redefinida. ${usuario.nome} deverá alterá-la no próximo acesso.`,
      );
    } catch (e: any) {
      toast.error(
        e.response?.data?.message || "Não foi possível redefinir a senha.",
      );
    } finally {
      setResetandoId(null);
    }
  }

  if (!isAdmin)
    return (
      <main className="usuarios-page">
        <section className="usuarios-alerta">
          <h1>Acesso restrito</h1>
          <p>
            Somente administradores podem gerenciar as contas de acesso. Você
            pode alterar seu próprio nome e senha em Meu perfil.
          </p>
        </section>
      </main>
    );

  return (
    <main className="usuarios-page">
      <header className="usuarios-heading">
        <div>
          <h1>Usuários de acesso</h1>
          <p>Administre contas e redefina a senha de outros usuários.</p>
        </div>
        <button onClick={() => void carregar()} disabled={carregando}>
          <RefreshCw size={17} /> Atualizar
        </button>
      </header>
      <section className="usuarios-card usuarios-cadastro-card">
        <div className="usuarios-card-title">
          <UserPlus size={20} />
          <h2>Cadastrar novo usuário</h2>
        </div>
        <form className="usuarios-form" onSubmit={cadastrarUsuario}>
          <label>
            Nome completo
            <input
              value={novoUsuario.nome}
              onChange={(e) =>
                setNovoUsuario((v) => ({ ...v, nome: e.target.value }))
              }
              maxLength={120}
              required
              placeholder="Nome do usuário"
            />
          </label>
          <label>
            Nome de usuário
            <input
              value={novoUsuario.nomeUsuario}
              onChange={(e) =>
                setNovoUsuario((v) => ({ ...v, nomeUsuario: e.target.value }))
              }
              maxLength={80}
              required
              placeholder="Login de acesso"
            />
          </label>
          <label>
            Senha temporária
            <input
              type="password"
              value={novoUsuario.senhaTemporaria}
              onChange={(e) =>
                setNovoUsuario((v) => ({
                  ...v,
                  senhaTemporaria: e.target.value,
                }))
              }
              minLength={6}
              maxLength={72}
              required
              autoComplete="new-password"
              placeholder="Mínimo de 6 caracteres"
            />
          </label>
          <label>
            Perfil
            <select
              value={novoUsuario.perfil}
              onChange={(e) =>
                setNovoUsuario((v) => ({
                  ...v,
                  perfil: e.target.value as UsuarioAcesso["perfil"],
                }))
              }
            >
              <option value="ESTOQUISTA">Estoquista</option>
              <option value="CONSULTA">Consulta</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>
          <button
            className="usuarios-criar-button"
            type="submit"
            disabled={criando}
          >
            <UserPlus size={17} />
            {criando ? "Cadastrando..." : "Cadastrar usuário"}
          </button>
        </form>
        <p className="usuarios-note">
          A senha informada é temporária; o usuário deverá criar uma senha
          própria no primeiro acesso.
        </p>
      </section>
      <section className="usuarios-card">
        <div className="usuarios-card-title">
          <Users size={20} />
          <h2>Contas cadastradas</h2>
          <span>{usuarios.length}</span>
        </div>
        {carregando ? (
          <p className="usuarios-empty">Carregando usuários...</p>
        ) : usuarios.length === 0 ? (
          <p className="usuarios-empty">Nenhum usuário encontrado.</p>
        ) : (
          <div className="usuarios-table-wrap">
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Usuário</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th>Senha</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>
                      {u.nome}
                      {u.id === atual?.id ? " (você)" : ""}
                    </td>
                    <td>{u.nomeUsuario}</td>
                    <td>{u.perfil}</td>
                    <td>
                      <span
                        className={`usuario-status ${u.ativo ? "ativo" : "inativo"}`}
                      >
                        {u.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td>{u.trocarSenha ? "Troca pendente" : "Definida"}</td>
                    <td>
                      <button
                        className="usuario-reset-button"
                        onClick={() => void redefinir(u)}
                        disabled={u.id === atual?.id || resetandoId === u.id}
                        title={
                          u.id === atual?.id
                            ? "Use Meu perfil para alterar sua senha"
                            : "Redefinir senha"
                        }
                      >
                        <KeyRound size={15} />
                        {resetandoId === u.id
                          ? "Redefinindo..."
                          : "Redefinir senha"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="usuarios-note">
          A redefinição só altera a senha da conta selecionada e exige que a
          pessoa defina uma nova senha no próximo acesso. O administrador não
          pode redefinir a própria senha por esta tela.
        </p>
      </section>
    </main>
  );
}
