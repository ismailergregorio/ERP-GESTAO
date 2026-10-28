import api from "../api";
import type { Funcionario } from "../types";

export type FuncionarioRequest = { nome: string; cpf?: string };

export async function listarFuncionarios(): Promise<Funcionario[]> {
  const response = await api.get<Funcionario[]>("/funcionarios");
  return response.data;
}

export async function criarFuncionario(dados: FuncionarioRequest): Promise<Funcionario> {
  const response = await api.post<Funcionario>("/funcionarios", dados);
  return response.data;
}
