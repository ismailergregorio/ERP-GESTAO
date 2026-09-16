import api from "./api";

import type { Entrada, EntradaRequest } from "../types/Entrada";

export async function listarEntradas(): Promise<Entrada[]> {
  const response = await api.get<Entrada[]>("/entradas");

  return response.data;
}

export async function buscarEntradaPorId(id: number): Promise<Entrada> {
  const response = await api.get<Entrada>(`/entradas/${id}`);

  return response.data;
}

export async function listarEntradasPorTipo(
  tipoEntradaId: number,
): Promise<Entrada[]> {
  const response = await api.get<Entrada[]>(`/entradas/tipo/${tipoEntradaId}`);

  return response.data;
}

export async function listarEntradasPorNF(nfId: number): Promise<Entrada[]> {
  const response = await api.get<Entrada[]>(`/entradas/nf/${nfId}`);

  return response.data;
}

export async function criarEntrada(dados: EntradaRequest): Promise<Entrada> {
  const response = await api.post<Entrada>("/entradas", dados);

  return response.data;
}

export async function atualizarEntrada(
  id: number,
  dados: EntradaRequest,
): Promise<Entrada> {
  const response = await api.put<Entrada>(`/entradas/${id}`, dados);

  return response.data;
}

export async function excluirEntrada(id: number): Promise<void> {
  await api.delete(`/entradas/${id}`);
}
