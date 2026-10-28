import api from "../api";

export type Perfil = "ADMIN" | "ESTOQUISTA" | "CONSULTA";

import {
  salvarToken,
  buscarToken,
  removerToken,
} from "./tokenStorage";

export type UsuarioSessao = {
  id: number;
  nome: string;
  nomeUsuario: string;
  perfil: Perfil;
  ativo: boolean;
  trocarSenha: boolean;
  dataCriacao?: string;
};

export type LoginResponse = {
  token: string;
  tipo: string;
  expiraEmSegundos: number;
  trocarSenha: boolean;
  usuario: UsuarioSessao;
};

export async function login(nomeUsuario: string, senha: string) {
  const response = await api.post<LoginResponse>("/auth/login", {
    nomeUsuario: nomeUsuario.trim(),
    senha,
  });
  return response.data;
}

export async function buscarMeuUsuario() {
  const response = await api.get<UsuarioSessao>("/auth/me");
  return response.data;
}

export async function alterarMinhaSenha(senhaAtual: string, novaSenha: string) {
  await api.post("/auth/alterar-senha", { senhaAtual, novaSenha });
}

export async function alterarMeuNome(nome: string) {
  const response = await api.patch<UsuarioSessao>("/auth/me/nome", { nome: nome.trim() });
  return response.data;
}
