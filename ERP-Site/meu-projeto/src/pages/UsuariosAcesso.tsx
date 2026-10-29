import {useCallback, useEffect, useState} from "react";
import type {FormEvent} from "react"
import {
  KeyRound,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  Users,
  UserRound,
  Power,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  alterarStatusUsuario,
  criarUsuario,
  listarUsuarios,
  obterMeuPerfil,
  obterUsuario,
  type PerfilAcesso,
  type UsuarioAcesso,
} from "../services/authService";
import "./UsuariosAcesso.css";

const mensagemErro = (error: unknown, padrao: string) => {
  const e = error as {
    response?: {
      data?: { message?: string; mensagem?: string; error?: string };
    };
    message?: string;
  };
  return (
    e.response?.data?.message ||
    e.response?.data?.mensagem ||
    e.response?.data?.error ||
    e.message ||
    padrao
  );
};

export default function UsuariosAcesso() {
  const [perfil, setPerfil] = useState<UsuarioAcesso | null>(obterUsuario());
  const [usuarios, setUsuarios] = useState<UsuarioAcesso[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [nome, setNome] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [senhaTemporaria, setSenhaTemporaria] = useState("");
  const [novoPerfil, setNovoPerfil] = useState<PerfilAcesso>("ESTOQUISTA");

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const eu = await obterMeuPerfil();
      setPerfil(eu);
      if (eu.perfil === "ADMIN") setUsuarios(await listarUsuarios());
    } catch (error) {
      toast.error(
        mensagemErro(error, "Não foi possível carregar os dados da conta."),
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  async function handleCriar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (senhaTemporaria.length < 6 || senhaTemporaria.length > 72) {
      toast.error("A senha temporária deve ter entre 12 e 72 caracteres.");
      return;
    }
    setSalvando(true);
    try {
      await criarUsuario({
        nome: nome.trim(),
        nomeUsuario: nomeUsuario.trim(),
        senhaTemporaria,
        perfil: novoPerfil,
      });
      toast.success(
        "Usuário criado. Ele deverá trocar a senha no primeiro acesso.",
      );
      setNome("");
      setNomeUsuario("");
      setSenhaTemporaria("");
      setNovoPerfil("ESTOQUISTA");
      setUsuarios(await listarUsuarios());
    } catch (error) {
      toast.error(mensagemErro(error, "Não foi possível criar o usuário."));
    } finally {
      setSalvando(false);
    }
  }

  async function alternarStatus(usuario: UsuarioAcesso) {
    const novoStatus = !usuario.ativo;
    try {
      await alterarStatusUsuario(usuario.id, novoStatus);
      toast.success(novoStatus ? "Usuário ativado." : "Usuário desativado.");
      setUsuarios(await listarUsuarios());
    } catch (error) {
      toast.error(mensagemErro(error, "Não foi possível alterar o status."));
    }
  }

  return (
    <div className="usuarios-acesso-page">
      <header className="ua-page-header">
        <div>
          <span className="ua-eyebrow">CONTA E PERMISSÕES</span>
          <h1>Usuários e perfil</h1>
          <p>
            Consulte seus dados de acesso e gerencie contas conforme suas
            permissões.
          </p>
        </div>
        <button
          className="ua-button ua-button-light"
          onClick={() => void carregar()}
          disabled={carregando}
        >
          <RefreshCw size={16} /> Atualizar
        </button>
      </header>
      <section className="ua-profile-card">
        <div className="ua-avatar">
          <UserRound size={30} />
        </div>
        <div className="ua-profile-main">
          <h2>{perfil?.nome || "Carregando perfil..."}</h2>
          <p>@{perfil?.nomeUsuario || "—"}</p>
          <div className="ua-tags">
            <span>
              <ShieldCheck size={14} />
              {perfil?.perfil || "—"}
            </span>
            <span className={perfil?.ativo ? "ua-active" : "ua-inactive"}>
              {perfil?.ativo ? "Conta ativa" : "Conta inativa"}
            </span>
            {perfil?.trocarSenha && (
              <span className="ua-warning">Troca de senha pendente</span>
            )}
          </div>
        </div>
        <div className="ua-profile-id">
          <small>ID da conta</small>
          <strong>{perfil?.id ?? "—"}</strong>
          <small>Criada em</small>
          <strong>
            {perfil?.dataCriacao
              ? new Date(perfil.dataCriacao).toLocaleDateString("pt-BR")
              : "Não informado"}
          </strong>
        </div>
      </section>
      {perfil?.perfil === "ADMIN" ? (
        <>
          <section className="ua-section">
            <div className="ua-section-heading">
              <div className="ua-heading-icon">
                <UserPlus size={20} />
              </div>
              <div>
                <h2>Criar usuário de acesso</h2>
                <p>
                  O novo usuário receberá uma senha temporária e deverá
                  alterá-la no primeiro login.
                </p>
              </div>
            </div>
            <form className="ua-form" onSubmit={handleCriar}>
              <div className="ua-field">
                <label htmlFor="ua-nome">Nome completo</label>
                <input
                  id="ua-nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  maxLength={120}
                  required
                  placeholder="Nome do usuário"
                />
              </div>
              <div className="ua-field">
                <label htmlFor="ua-usuario">Nome de usuário</label>
                <input
                  id="ua-usuario"
                  value={nomeUsuario}
                  onChange={(e) => setNomeUsuario(e.target.value)}
                  minLength={3}
                  maxLength={60}
                  required
                  placeholder="ex.: operador01"
                  autoComplete="off"
                />
              </div>
              <div className="ua-field">
                <label htmlFor="ua-senha">Senha temporária</label>
                <input
                  id="ua-senha"
                  type="password"
                  value={senhaTemporaria}
                  onChange={(e) => setSenhaTemporaria(e.target.value)}
                  minLength={6}
                  maxLength={72}
                  required
                  placeholder="Mínimo de 6 caracteres"
                  autoComplete="new-password"
                />
                <small>16 a 72 caracteres</small>
              </div>
              <div className="ua-field">
                <label htmlFor="ua-perfil">Perfil de acesso</label>
                <select
                  id="ua-perfil"
                  value={novoPerfil}
                  onChange={(e) =>
                    setNovoPerfil(e.target.value as PerfilAcesso)
                  }
                >
                  <option value="ESTOQUISTA">Estoquista</option>
                  <option value="CONSULTA">Consulta</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className="ua-form-actions">
                <button className="ua-button" type="submit" disabled={salvando}>
                  <UserPlus size={17} />
                  {salvando ? "Criando..." : "Criar usuário"}
                </button>
              </div>
            </form>
          </section>
          <section className="ua-section">
            <div className="ua-section-heading">
              <div className="ua-heading-icon">
                <Users size={20} />
              </div>
              <div>
                <h2>Contas cadastradas</h2>
                <p>
                  {usuarios.length} conta(s) encontrada(s). Somente
                  administradores podem gerenciar usuários.
                </p>
              </div>
            </div>
            {carregando ? (
              <p className="ua-empty">Carregando usuários...</p>
            ) : usuarios.length === 0 ? (
              <p className="ua-empty">Nenhum usuário encontrado.</p>
            ) : (
              <div className="ua-table-wrap">
                <table className="ua-table">
                  <thead>
                    <tr>
                      <th>Usuário</th>
                      <th>Login</th>
                      <th>Perfil</th>
                      <th>Status</th>
                      <th>Senha inicial</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <strong>{u.nome}</strong>
                          <small>ID {u.id}</small>
                        </td>
                        <td>{u.nomeUsuario}</td>
                        <td>
                          <span className="ua-role">{u.perfil}</span>
                        </td>
                        <td>
                          <span
                            className={
                              u.ativo
                                ? "ua-status ua-active"
                                : "ua-status ua-inactive"
                            }
                          >
                            {u.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td>
                          {u.trocarSenha ? (
                            <span className="ua-warning">Pendente</span>
                          ) : (
                            "Atualizada"
                          )}
                        </td>
                        <td>
                          <button
                            className={`ua-icon-button ${u.ativo ? "ua-danger" : "ua-success"}`}
                            title={
                              u.ativo ? "Desativar usuário" : "Ativar usuário"
                            }
                            disabled={u.id === perfil?.id}
                            onClick={() => void alternarStatus(u)}
                          >
                            <Power size={16} />
                            {u.ativo ? "Desativar" : "Ativar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="ua-section ua-no-admin">
          <KeyRound size={22} />
          <div>
            <h2>Gerenciamento administrativo</h2>
            <p>
              Seu perfil é <strong>{perfil?.perfil || "—"}</strong>. A criação,
              listagem e ativação de contas está disponível somente para o
              perfil ADMIN.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
