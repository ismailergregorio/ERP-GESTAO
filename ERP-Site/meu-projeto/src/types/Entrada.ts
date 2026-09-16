export interface Entrada {
  id: number;

  tiposEntradaId: number;
  nomeTipoEntrada: string;

  obs: string | null;

  dataCriacao: string;
  dataUpdate: string | null;

  nfId: number | null;
  numeroNF: string | null;
}

export interface EntradaRequest {
  tiposEntradaId: number;
  obs: string;
  nfId?: number | null;
}