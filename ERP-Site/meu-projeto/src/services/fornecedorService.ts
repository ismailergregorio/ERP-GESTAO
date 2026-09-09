import api from "./api";

import type {
  Fornecedor,
  FornecedorRequest,
} from "../types/Fornecedor";


/*
 * =====================================================
 * LISTAR FORNECEDORES
 * =====================================================
 */

export async function listarFornecedores(): Promise<
  Fornecedor[]
> {

  const response =
    await api.get<Fornecedor[]>(
      "/fornecedores"
    );

  return response.data;
}


/*
 * =====================================================
 * BUSCAR POR ID
 * =====================================================
 */

export async function buscarFornecedorPorId(
  id: number
): Promise<Fornecedor> {

  const response =
    await api.get<Fornecedor>(
      `/fornecedores/${id}`
    );

  return response.data;
}


/*
 * =====================================================
 * LISTAR ATIVOS
 * =====================================================
 */

export async function listarFornecedoresAtivos(): Promise<
  Fornecedor[]
> {

  const response =
    await api.get<Fornecedor[]>(
      "/fornecedores/ativos"
    );

  return response.data;
}


/*
 * =====================================================
 * CRIAR
 * =====================================================
 */

export async function criarFornecedor(
  fornecedor: FornecedorRequest
): Promise<Fornecedor> {

  const response =
    await api.post<Fornecedor>(
      "/fornecedores",
      fornecedor
    );

  return response.data;
}


/*
 * =====================================================
 * ATUALIZAR
 * =====================================================
 */

export async function atualizarFornecedor(
  id: number,
  fornecedor: FornecedorRequest
): Promise<Fornecedor> {

  const response =
    await api.put<Fornecedor>(
      `/fornecedores/${id}`,
      fornecedor
    );

  return response.data;
}


/*
 * =====================================================
 * EXCLUIR / DESATIVAR
 * =====================================================
 */

export async function excluirFornecedor(
  id: number
): Promise<void> {

  await api.delete(
    `/fornecedores/${id}`
  );

}