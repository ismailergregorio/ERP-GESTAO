export interface Fornecedor {
  id: number;

  razaoSocial: string;

  nomeFantasia: string;

  inscricaoEstadual: string;

  cnpj: string;

  telefone: string;

  email: string;

  dataCriacao: string;

  dataUpdate: string | null;

  ativo: boolean;
}

export interface FornecedorRequest {
  razaoSocial: string;

  nomeFantasia: string;

  inscricaoEstadual: string;

  cnpj: string;

  telefone: string;

  email: string;
}