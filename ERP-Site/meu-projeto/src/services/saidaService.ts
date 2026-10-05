import api from "./api";

import type { Saida, SaidaRequest } from "../types/Saida";

export async function listarSaidas(): Promise<Saida[]> {
  const response = await api.get<Saida[]>("/saidas");
  return response.data;
}

export async function buscarSaidaPorId(id: number): Promise<Saida> {
  const response = await api.get<Saida>(`/saidas/${id}`);
  return response.data;
}

export async function criarSaida(
  dados: SaidaRequest,
): Promise<Saida> {
  const response = await api.post<Saida>("/saidas", dados);
  return response.data;
}

export async function atualizarSaida(
  id: number,
  dados: SaidaRequest,
): Promise<Saida> {
  const response = await api.put<Saida>(`/saidas/${id}`, dados);
  return response.data;
}

export async function desativarSaida(id: number): Promise<void> {
  await api.delete(`/saidas/${id}`);
}
