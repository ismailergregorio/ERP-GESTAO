export type Funcionario = {
  id: number;
  nome: string;
  cpf?: string | null;
  ativo: boolean;
};

export type Produto = {
  id: number;
  nome: string;
  categoria: string;
  ativo: boolean;
  estoque: number;
  siglaUnidadeMedida?: string;
  unidadeMedida?: string;
  valorUnitario?: number;
};

export type Setor = { id: number; nome: string; ativo: boolean };
export type TipoSaida = { id: number; nome: string; ativo: boolean };

export type SaidaProdutoRequest = { produtoId: number; quantidade: number };

export type SaidaRequest = {
  funcionarioId: number;
  setorId: number;
  tipoSaidaId: number;
  finalidade: string;
  obs?: string;
  produtos: SaidaProdutoRequest[];
  assinaturaBase64?: string;
};

export type SaidaEpiRequest = SaidaRequest & { assinaturaBase64: string };

export type Saida = {
  id: number;
  funcionario?: string;
  dataCriacao?: string;
  saidaEpi?: boolean;
  assinaturaColetada?: boolean;
};
