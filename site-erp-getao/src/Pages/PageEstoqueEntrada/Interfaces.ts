export interface Entrada {
  id: number;
  notaFiscal: number;
  fornecedor_id: number;
  tipoEntrada_id: number;
  observacao: string;
  dataCriacao: string;
}

export interface TipoEntrada {
  id: number;
  nome: string;
}

export interface FornecedorNf {
  id: number;
  cnpj: string;
  crt: string;
  inscricaoEstadual: string;
  nomeFantasia: string;
  razaoSocial: string;
}

export interface ProdutoNfe {
  id: number;
  cest: string;
  cfop: string;
  codigo: string;
  codigoEAN: string;
  descricao: string;
  ncm: string;

  quantidade: number;
  quantidadeTributaria: number;

  unidadeComercial: string;
  unidadeTributaria: string;

  valorTotal: number;
  valorUnitario: number;
  valorUnitarioTributario: number;
}

export interface Nf {
  notaFiscal: number;
  chaveAcesso: string;
  dataEmissao: string;
  valorTotal: number;

  fornecedor: FornecedorNf;
  produto: ProdutoNfe[];
}

export interface ProdutoEntrada {
  id: number;
  produto_id: number;
  nome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface ProdutoEntradaApi {
  entrada_id: number;
  produto_id: number;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface Produto {
  id: number;
  nome: string;
  valorUnitario?: number;
}
