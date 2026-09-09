import api from "./api";

import type { NotaFiscal, NotaFiscalRequest } from "../types/NotaFiscal";

/*
 * =====================================================
 * LISTAR NFS
 * =====================================================
 */

export async function listarNotasFiscais(): Promise<NotaFiscal[]> {
  const response = await api.get<NotaFiscal[]>("/nf");

  return response.data;
}

/*
 * =====================================================
 * BUSCAR NF POR ID
 * =====================================================
 */

export async function buscarNotaFiscalPorId(id: number): Promise<NotaFiscal> {
  const response = await api.get<NotaFiscal>(`/nf/${id}`);

  return response.data;
}

/*
 * =====================================================
 * LISTAR NFS DO FORNECEDOR
 * =====================================================
 */

export async function listarNotasPorFornecedor(
  fornecedorId: number,
): Promise<NotaFiscal[]> {
  const response = await api.get<NotaFiscal[]>(
    `/nf/fornecedor/${fornecedorId}`,
  );

  return response.data;
}

/*
 * =====================================================
 * CRIAR NF
 * =====================================================
 */

export async function criarNotaFiscal(
  notaFiscal: NotaFiscalRequest,
): Promise<NotaFiscal> {
  const response = await api.post<NotaFiscal>("/nf", notaFiscal);

  return response.data;
}

/*
 * =====================================================
 * ATUALIZAR NF
 * =====================================================
 */

export async function atualizarNotaFiscal(
  id: number,
  notaFiscal: NotaFiscalRequest,
): Promise<NotaFiscal> {
  const response = await api.put<NotaFiscal>(`/nf/${id}`, notaFiscal);

  return response.data;
}

/*
 * =====================================================
 * EXCLUIR NF
 * =====================================================
 */

export async function excluirNotaFiscal(id: number): Promise<void> {
  await api.delete(`/nf/${id}`);
}
