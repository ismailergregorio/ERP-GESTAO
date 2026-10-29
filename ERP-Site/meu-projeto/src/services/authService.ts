import api from "./api";

export interface UsuarioAcesso {
  id: number;
  nome: string;
  nomeUsuario: string;
  perfil: "ADMIN" | "ESTOQUISTA" | "CONSULTA";
  ativo: boolean;
  trocarSenha: boolean;
  dataCriacao?: string;
}

export interface LoginResposta {
  token: string;
  tipo: string;
  expiraEmSegundos: number;
  trocarSenha: boolean;
  usuario: UsuarioAcesso;
}

function salvarUsuario(usuario: UsuarioAcesso) {
  sessionStorage.setItem("erp_usuario", JSON.stringify(usuario));
}

export async function login(nomeUsuario: string, senha: string): Promise<LoginResposta> {
  sessionStorage.removeItem("erp_token");
  sessionStorage.removeItem("erp_usuario");
  localStorage.removeItem("erp_token");
  const resposta = await api.post<LoginResposta>("/auth/login", { nomeUsuario, senha }, {
    headers: { Authorization: undefined },
  });
  const dados = resposta.data;
  if (!dados.token || !dados.usuario) throw new Error("A API não retornou o token ou os dados do usuário.");
  sessionStorage.setItem("erp_token", dados.token);
  salvarUsuario(dados.usuario);
  return dados;
}

export async function obterMeuPerfil(): Promise<UsuarioAcesso> {
  const response = await api.get<UsuarioAcesso>("/auth/me");
  salvarUsuario(response.data);
  return response.data;
}

export async function atualizarMeuNome(nome: string): Promise<UsuarioAcesso> {
  const response = await api.patch<UsuarioAcesso>("/auth/me/nome", { nome });
  salvarUsuario(response.data);
  return response.data;
}

export async function alterarSenha(senhaAtual: string, novaSenha: string): Promise<void> {
  await api.post("/auth/alterar-senha", { senhaAtual, novaSenha });
  try {
    await obterMeuPerfil();
  } catch {
    const usuario = obterUsuario();
    if (usuario) salvarUsuario({ ...usuario, trocarSenha: false });
  }
}

export async function resetarSenhaUsuario(id: number, senhaTemporaria: string): Promise<void> {
  await api.post(`/usuarios/${id}/resetar-senha`, { senhaTemporaria });
}

export function sair(): void {
  sessionStorage.removeItem("erp_token");
  sessionStorage.removeItem("erp_usuario");
  localStorage.removeItem("erp_token");
}

export function obterUsuario(): UsuarioAcesso | null {
  const raw = sessionStorage.getItem("erp_usuario");
  if (!raw) return null;
  try { return JSON.parse(raw) as UsuarioAcesso; } catch { return null; }
}


export type PerfilAcesso = UsuarioAcesso["perfil"];

export interface CriarUsuarioRequest {
  nome: string;
  nomeUsuario: string;
  senhaTemporaria: string;
  perfil: PerfilAcesso;
}

/**
 * Lista todos os usuários cadastrados.
 */
export async function listarUsuarios(): Promise<UsuarioAcesso[]> {
  const response = await api.get<UsuarioAcesso[]>("/usuarios");
  return response.data;
}

/**
 * Cria um novo usuário.
 */
export async function criarUsuario(
  dados: CriarUsuarioRequest
): Promise<UsuarioAcesso> {
  const response = await api.post<UsuarioAcesso>("/usuarios", dados);
  return response.data;
}

/**
 * Altera o status de um usuário.
 */
export async function alterarStatusUsuario(
  id: number,
  ativo: boolean
): Promise<UsuarioAcesso> {
  const response = await api.patch<UsuarioAcesso>(
    `/usuarios/${id}/status`,
    { ativo }
  );

  return response.data;
}

