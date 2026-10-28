import type { Produto } from "../types";

export const normalizar = (valor?: string | null): string =>
  (valor || "").trim().toLocaleLowerCase("pt-BR");

export const ehEpi = (produto: Produto): boolean =>
  ["epi", "uniforme"].includes(normalizar(produto.categoria));
