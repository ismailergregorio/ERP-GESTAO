import api from "../api";
import type { Setor } from "../types";

export async function listarSetores(): Promise<Setor[]> {
  const response = await api.get<Setor[]>("/setores");
  return response.data;
}
