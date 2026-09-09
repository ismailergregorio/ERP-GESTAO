import api from "./api";

import type { UnidadeMedida } from "../types/UnidadeMedida";

export interface UnidadeMedidaRequest {
  nome: string;
  sigla: string;
}

/*
 * =====================================================
 * LISTAR TODAS
 * =====================================================
 */

export async function listarUnidadesMedida(): Promise<UnidadeMedida[]> {
  const response = await api.get<UnidadeMedida[]>("/unidades-medida");

  return response.data;
}

/*
 * =====================================================
 * BUSCAR POR ID
 * =====================================================
 */

export async function buscarUnidadeMedidaPorId(
  id: number,
): Promise<UnidadeMedida> {
  const response = await api.get<UnidadeMedida>(`/unidades-medida/${id}`);

  return response.data;
}

/*
 * =====================================================
 * LISTAR APENAS ATIVAS
 * =====================================================
 */

export async function listarUnidadesMedidaAtivas(): Promise<UnidadeMedida[]> {
  const response = await api.get<UnidadeMedida[]>("/unidades-medida/ativas");

  return response.data;
}

/*
 * =====================================================
 * CRIAR
 * =====================================================
 */

export async function criarUnidadeMedida(
  unidade: UnidadeMedidaRequest,
): Promise<UnidadeMedida> {
  const response = await api.post<UnidadeMedida>("/unidades-medida", unidade);

  return response.data;
}

/*
 * =====================================================
 * ATUALIZAR
 * =====================================================
 */

export async function atualizarUnidadeMedida(
  id: number,
  unidade: UnidadeMedidaRequest,
): Promise<UnidadeMedida> {
  const response = await api.put<UnidadeMedida>(
    `/unidades-medida/${id}`,
    unidade,
  );

  return response.data;
}

/*
 * =====================================================
 * EXCLUIR
 * =====================================================
 */

export async function excluirUnidadeMedida(id: number): Promise<void> {
  await api.delete(`/unidades-medida/${id}`);
}
