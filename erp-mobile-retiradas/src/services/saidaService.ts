import api from "../api";
import type { Saida, SaidaRequest, SaidaEpiRequest } from "../types";

export async function listarSaidas(): Promise<Saida[]> {
  const response = await api.get<Saida[]>("/saidas");
  return response.data;
}

export async function criarSaida(dados: SaidaRequest): Promise<Saida> {
  const response = await api.post<Saida>("/saidas", dados);
  return response.data;
}

export async function criarSaidaEpi(dados: SaidaEpiRequest): Promise<Saida> {
  const response = await api.post<Saida>("/saidas/epi", dados);
  return response.data;
}
