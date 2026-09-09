import api from "./api";
import type { ProdutoRegistroNF } from "../types/ProdutoRegistroNF";

export async function listarProdutosRegistroNF(): Promise<ProdutoRegistroNF[]> {
  const response = await api.get<ProdutoRegistroNF[]>("/produtos-registro-nf");

  return response.data;
}

export async function listarProdutosRegistroNFAtivos(): Promise<
  ProdutoRegistroNF[]
> {
  const response = await api.get<ProdutoRegistroNF[]>(
    "/produtos-registro-nf/ativos",
  );

  return response.data;
}

export async function buscarProdutoRegistroNFPorId(
  id: number,
): Promise<ProdutoRegistroNF> {
  const response = await api.get<ProdutoRegistroNF>(
    `/produtos-registro-nf/${id}`,
  );

  return response.data;
}

export async function listarProdutosPorNF(
  nfId: number,
): Promise<ProdutoRegistroNF[]> {
  const response = await api.get<ProdutoRegistroNF[]>(
    `/produtos-registro-nf/nf/${nfId}`,
  );

  return response.data;
}
