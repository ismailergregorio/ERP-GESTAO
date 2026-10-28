import api from "../api";
import type { Produto } from "../types";

export async function listarProdutosAtivos(): Promise<Produto[]> {
  const response = await api.get<Produto[]>("/produtos/ativos");
  return response.data;
}
