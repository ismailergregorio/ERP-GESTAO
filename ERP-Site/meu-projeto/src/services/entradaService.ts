import api from "./api";

import type {
  Entrada,
  EntradaRequest,
  FinalizarEntradaRequest,
  FinalizarEntradaResponse,
} from "../types/Entrada";

/*
 * =====================================================
 * LISTAR ENTRADAS
 * =====================================================
 */

export async function listarEntradas(): Promise<Entrada[]> {

  const response =
    await api.get<Entrada[]>(
      "/entradas",
    );

  return response.data;
}

/*
 * =====================================================
 * BUSCAR POR ID
 * =====================================================
 */

export async function buscarEntradaPorId(
  id: number,
): Promise<Entrada> {

  const response =
    await api.get<Entrada>(
      `/entradas/${id}`,
    );

  return response.data;
}

/*
 * =====================================================
 * LISTAR POR TIPO
 * =====================================================
 */

export async function listarEntradasPorTipo(
  tipoEntradaId: number,
): Promise<Entrada[]> {

  const response =
    await api.get<Entrada[]>(
      `/entradas/tipo/${tipoEntradaId}`,
    );

  return response.data;
}

/*
 * =====================================================
 * LISTAR POR NF
 * =====================================================
 */

export async function listarEntradasPorNF(
  nfId: number,
): Promise<Entrada[]> {

  const response =
    await api.get<Entrada[]>(
      `/entradas/nf/${nfId}`,
    );

  return response.data;
}

/*
 * =====================================================
 * CRIAR ENTRADA SIMPLES
 * =====================================================
 */

export async function criarEntrada(
  data: EntradaRequest,
): Promise<Entrada> {

  const response =
    await api.post<Entrada>(
      "/entradas",
      data,
    );

  return response.data;
}

/*
 * =====================================================
 * ATUALIZAR ENTRADA
 * =====================================================
 */

export async function atualizarEntrada(
  id: number,

  data: EntradaRequest,
): Promise<Entrada> {

  const response =
    await api.put<Entrada>(
      `/entradas/${id}`,
      data,
    );

  return response.data;
}

/*
 * =====================================================
 * EXCLUIR ENTRADA
 * =====================================================
 */

export async function excluirEntrada(
  id: number,
): Promise<void> {

  await api.delete(
    `/entradas/${id}`,
  );
}

/*
 * =====================================================
 * FINALIZAR ENTRADA
 *
 * POST /api/entradas/finalizar
 * =====================================================
 */

export async function finalizarEntrada(
  data: FinalizarEntradaRequest,
): Promise<FinalizarEntradaResponse> {

  const response =
    await api.post<FinalizarEntradaResponse>(
      "/entradas/finalizar",
      data,
    );

  return response.data;
}