import api from "./api";

import type { EntradaProdutoResponse } from "../types/Entrada";

/*
 * =====================================================
 * LISTAR PRODUTOS DE UMA ENTRADA
 * =====================================================
 */

export async function listarProdutosDaEntrada(
  entradaId: number,
): Promise<EntradaProdutoResponse[]> {
  const response = await api.get<EntradaProdutoResponse[]>(
    `/entrada-produtos/entrada/${entradaId}`,
  );

  return response.data;
}
