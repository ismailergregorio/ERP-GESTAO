export interface ProdutoNFCompletaRequest {
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface NotaFiscalCompletaRequest {
  numero: string;
  fornecedorId: number;
  chaveAcesso: string;
  produtos: ProdutoNFCompletaRequest[];
}

export interface ProdutoNFCompletaResponse {
  id: number;
  codigo: string;
  descricao: string;
  dataCriacao: string;
  dataUpdate: string | null;
  ativo: boolean;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  nfId: number;
  numeroNF: string;
}

export interface NotaFiscalCompletaResponse {
  id: number;
  numero: string;
  fornecedorId: number;
  razaoSocialFornecedor: string;
  nomeFantasiaFornecedor: string;
  chaveAcesso: string;
  dataCriacao: string;
  dataUpdate: string | null;
  produtos: ProdutoNFCompletaResponse[];
}