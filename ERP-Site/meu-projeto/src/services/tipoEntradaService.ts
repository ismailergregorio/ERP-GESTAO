import api from "./api";
import type {
 TipoEntrada,
 TipoEntradaRequest,
} from "../types/TipoEntrada";

export async function listarTiposEntradas(): Promise<
  TipoEntrada[]
> {
  const response = await api.get<TipoEntrada[]>(
    "/tipos-entradas"
  );

  return response.data;
}

export async function buscarTipoEntradaPorId(
  id: number
): Promise<TipoEntrada> {
  const response = await api.get<TipoEntrada>(
    `/tipos-entradas/${id}`
  );

  return response.data;
}

export async function criarTipoEntrada(
  dados: TipoEntradaRequest
): Promise<TipoEntrada> {
  const response = await api.post<TipoEntrada>(
    "/tipos-entradas",
    dados
  );

  return response.data;
}

export async function atualizarTipoEntrada(
  id: number,
  dados: TipoEntradaRequest
): Promise<TipoEntrada> {
  const response = await api.put<TipoEntrada>(
    `/tipos-entradas/${id}`,
    dados
  );

  return response.data;
}

export async function excluirTipoEntrada(
  id: number
): Promise<void> {
  await api.delete(`/tipos-entradas/${id}`);
}