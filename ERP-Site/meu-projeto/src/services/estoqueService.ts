import api from "./api";
import type { EstoqueProduto } from "../types/Estoque";

export async function listarEstoque(): Promise<EstoqueProduto[]> {
  const response = await api.get<EstoqueProduto[]>("/estoque");
  return response.data;
}

export async function buscarEstoqueProduto(produtoId: number): Promise<EstoqueProduto> {
  const response = await api.get<EstoqueProduto>(`/estoque/produto/${produtoId}`);
  return response.data;
}
