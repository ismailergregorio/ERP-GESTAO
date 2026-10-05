import api from "./api";
import type { Movimentacao } from "../types/Movimentacao";

export async function listarMovimentacoes(): Promise<Movimentacao[]> {
  const response = await api.get<Movimentacao[]>("/movimentacoes");
  return response.data;
}

export async function listarMovimentacoesProduto(produtoId: number): Promise<Movimentacao[]> {
  const response = await api.get<Movimentacao[]>(`/movimentacoes/produto/${produtoId}`);
  return response.data;
}
