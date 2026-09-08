import type { CategoriaProdutoGet, CategoriaProdutoPost } from "../types/categoriaType";
import api from "./api";

export async function listarCategoriasProduto(): Promise<CategoriaProdutoGet[]> {

  const response = await api.get<CategoriaProdutoGet[]>(
    "/categorias"
  );

  return response.data;
}

export async function buscarCategoriaProdutoPorId(
  id: number
): Promise<CategoriaProdutoGet> {

  const response =
    await api.get<CategoriaProdutoGet>(
      `/categorias/${id}`
    );

  return response.data;
}

export async function criarCategoriaProduto(
  categoria: CategoriaProdutoPost
): Promise<CategoriaProdutoPost> {

  const response =
    await api.post<CategoriaProdutoPost>(
      "/categorias",
      categoria
    );

  return response.data;
}

export async function atualizarCategoriaProduto(
  id: number,
  categoria: CategoriaProdutoPost
): Promise<CategoriaProdutoGet> {

  const response =
    await api.put<CategoriaProdutoGet>(
      `/categorias/${id}`,
      categoria
    );

  return response.data;
}

export async function excluirCategoriaProduto(
  id: number
): Promise<void> {

  await api.delete(
    `/categorias/${id}`
  );

}