import api from "../api";
import type { TipoSaida } from "../types";

export async function listarTiposSaida(): Promise<TipoSaida[]> {
  const response = await api.get<TipoSaida[]>("/tipos-saidas");
  return response.data;
}
