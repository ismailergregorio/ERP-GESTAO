export interface TipoEntrada {
  id: number;
  nome: string;
  dataCriacao: string;
  dataUpdate: string | null;
}

export interface TipoEntradaRequest {
  nome: string;
}
