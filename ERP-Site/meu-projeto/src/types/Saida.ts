export interface SaidaProduto {
  id: number;
  produtoId: number;
  produto: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface Saida {
  id: number;
  funcionarioId: number;
  funcionario: string;
  setorId: number;
  setor: string;
  tipoSaidaId: number;
  tipoSaida: string;
  finalidade: string;
  obs: string | null;
  ativo: boolean;
  dataCriacao: string;
  dataUpdate: string | null;
  produtos: SaidaProduto[];
  saidaEpi?: boolean;
  assinaturaColetada?: boolean;
  dataAssinatura?: string | null;
}

export interface SaidaProdutoRequest {
  produtoId: number;
  quantidade: number;
}

export interface SaidaRequest {
  funcionarioId: number;
  setorId: number;
  tipoSaidaId: number;
  finalidade: string;
  obs?: string;
  produtos: SaidaProdutoRequest[];
}

export interface SaidaEpiRequest extends SaidaRequest {
  assinaturaBase64: string;
}

export interface AssinaturaSaidaRequest {
  assinaturaBase64: string;
}
