export interface FornecedorImportadoNF {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;

  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
}

export interface ProdutoImportadoNF {
  codigo: string;
  descricao: string;
  ncm: string;
  cfop: string;
  unidade: string;

  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface NotaFiscalImportada {
  chaveAcesso: string;
  numero: string;
  serie: string;
  dataEmissao: string;
  valorTotal: number;

  fornecedor: FornecedorImportadoNF;

  produtos: ProdutoImportadoNF[];
}

/*
 * =====================================================
 * IMPORTAÇÃO COM SUCESSO
 * =====================================================
 */

export interface ResultadoImportacaoNF {
  dados: NotaFiscalImportada;
}

/*
 * =====================================================
 * FORNECEDOR NÃO CADASTRADO
 * =====================================================
 */

export interface ErroImportacaoNF {
  erro: string;
  dados: NotaFiscalImportada;
}