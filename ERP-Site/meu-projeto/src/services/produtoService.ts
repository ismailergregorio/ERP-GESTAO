import api from "./api";

import type { Produto, ProdutoRequest } from "../types/Produto";

/*
 * =====================================================
 * LISTAR PRODUTOS
 * =====================================================
 */

export async function listarProdutos(): Promise<Produto[]> {
  const response = await api.get<Produto[]>("/produtos");

  return response.data;
}

/*
 * =====================================================
 * BUSCAR PRODUTO POR ID
 * =====================================================
 */

export async function buscarProdutoPorId(id: number): Promise<Produto> {
  const response = await api.get<Produto>(`/produtos/${id}`);

  return response.data;
}

/*
 * =====================================================
 * LISTAR PRODUTOS ATIVOS
 * =====================================================
 */

export async function listarProdutosAtivos(): Promise<Produto[]> {
  const response = await api.get<Produto[]>("/produtos/ativos");

  return response.data;
}

/*
 * =====================================================
 * CRIAR PRODUTO
 * =====================================================
 */

export async function criarProduto(produto: ProdutoRequest): Promise<Produto> {
  const response = await api.post<Produto>("/produtos", produto);

  return response.data;
}

/*
 * =====================================================
 * ATUALIZAR PRODUTO
 * =====================================================
 */

export async function atualizarProduto(
  id: number,
  produto: ProdutoRequest,
): Promise<Produto> {
  const response = await api.put<Produto>(`/produtos/${id}`, produto);

  return response.data;
}

/*
 * =====================================================
 * EXCLUIR PRODUTO
 * =====================================================
 */

export async function excluirProduto(id: number): Promise<void> {
  await api.delete(`/produtos/${id}`);
}
