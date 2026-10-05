export interface EntradaRequest {
  tiposEntradaId: number;
  obs: string;
  nfId: number | null;
  numeroNF?: string | null;
}

export interface Entrada {
  id: number;

  tiposEntradaId: number;

  nomeTipoEntrada: string;

  obs: string | null;

  dataCriacao: string;

  dataUpdate: string | null;

  nfId: number | null;

  numeroNF: string | null;

  numeroNFManual?: string | null;

  ativo: boolean;
}

/*
 * =====================================================
 * PRODUTO DA FINALIZAÇÃO DA ENTRADA
 * =====================================================
 */

export interface EntradaFinalizarProdutoRequest {
  produtoId: number;

  produtoNFId: number | null;

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

  numeroNF?: string | null;

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

  produtoNFId: number | null;

  codigoProdutoNF: string | null;

  descricaoProdutoNF: string | null;

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