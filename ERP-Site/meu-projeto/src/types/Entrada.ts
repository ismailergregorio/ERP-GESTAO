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

/*
 * =====================================================
 * PRODUTO DA FINALIZAÇÃO DA ENTRADA
 * =====================================================
 */

export interface EntradaFinalizarProdutoRequest {
  produtoId: number;

  produtoNFId: number;

  dataValidade: string | null;

  quantidadeItens: number;

  valorUnitario: number;

  valorTotal: number;
}

/*
 * =====================================================
 * REQUEST FINAL DA ENTRADA
 * =====================================================
 */

export interface FinalizarEntradaRequest {
  tiposEntradaId: number;

  obs: string;

  nfId: number | null;

  produtos: EntradaFinalizarProdutoRequest[];
}

/*
 * =====================================================
 * PRODUTO RETORNADO PELA API
 * =====================================================
 */

export interface EntradaProdutoResponse {
  id: number;

  entradaId: number;

  produtoId: number;

  nomeProduto: string;

  produtoNFId: number;

  codigoProdutoNF: string;

  descricaoProdutoNF: string;

  dataValidade: string | null;

  quantidadeItens: number;

  valorUnitario: number;

  valorTotal: number;

  dataCriacao: string;

  dataUpdate: string | null;
}

/*
 * =====================================================
 * RETORNO DA FINALIZAÇÃO
 * =====================================================
 */

export interface FinalizarEntradaResponse {
  id: number;

  tiposEntradaId: number;

  nomeTipoEntrada: string;

  obs: string | null;

  dataCriacao: string;

  dataUpdate: string | null;

  nfId: number | null;

  numeroNF: string | null;

  produtos: EntradaProdutoResponse[];
}