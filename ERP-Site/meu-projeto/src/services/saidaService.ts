import api from "./api";

import type { Saida, SaidaEpiRequest, SaidaRequest } from "../types/Saida";

export async function listarSaidas(): Promise<Saida[]> {
  const response = await api.get<Saida[]>("/saidas");
  return response.data;
}

export async function buscarSaidaPorId(id: number): Promise<Saida> {
  const response = await api.get<Saida>(`/saidas/${id}`);
  return response.data;
}

export async function criarSaida(
  dados: SaidaRequest,
): Promise<Saida> {
  const response = await api.post<Saida>("/saidas", dados);
  return response.data;
}

export async function atualizarSaida(
  id: number,
  dados: SaidaRequest,
): Promise<Saida> {
  const response = await api.put<Saida>(`/saidas/${id}`, dados);
  return response.data;
}

export async function desativarSaida(id: number): Promise<void> {
  await api.delete(`/saidas/${id}`);
}


/** Cria saída especializada para EPI/uniforme, com assinatura obrigatória. */
export async function criarSaidaEpi(dados: SaidaEpiRequest): Promise<Saida> {
  const response = await api.post<Saida>("/saidas/epi", dados);
  return response.data;
}

/** Abre o PDF da saída em uma nova aba. */
export async function abrirPdfSaida(id: number): Promise<void> {
  const response = await api.get<Blob>(`/saidas/${id}/pdf`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(response.data);
  const janela = window.open(url, "_blank", "noopener,noreferrer");
  if (!janela) {
    const link = document.createElement("a");
    link.href = url;
    link.download = `saida-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
