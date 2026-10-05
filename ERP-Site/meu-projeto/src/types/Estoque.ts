export interface EstoqueProduto {
  produtoId: number;
  produto: string;
  unidade: string;
  categoria: string;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  valorMedio: number;
  validadeMaisProxima: string | null;
  statusEstoque: "BAIXO" | "MAXIMO" | "NORMAL" | string;
}
