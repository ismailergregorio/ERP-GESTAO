export interface Movimentacao {
  id: number;
  tipo: "ENTRADA" | "SAIDA" | string;
  produtoId: number;
  produto: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  validade: string | null;
  data: string;
  documentoId: number | null;
  documento: string | null;
  responsavel: string | null;
  setor: string | null;
  finalidade: string | null;
}
