import api from "./api";

import type {
  NotaFiscalCompletaRequest,
  NotaFiscalCompletaResponse,
} from "../types/NotaFiscalCompleta";

export async function criarNotaFiscalCompleta(
  dados: NotaFiscalCompletaRequest
): Promise<NotaFiscalCompletaResponse> {
  const response = await api.post<NotaFiscalCompletaResponse>(
    "/nf/completa",
    dados
  );

  return response.data;
}