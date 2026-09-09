export interface Produto {
  id: number;

  nome: string;

  unidadeMedidaId: number;

  unidadeMedida: string;

  siglaUnidadeMedida: string;

  categoriaId: number;

  categoria: string;

  dataCriacao: string;

  dataUpdate: string | null;

  ativo: boolean;

  estoque: number;

  estoqueMinimo: number;

  estoqueMaximo: number;

  valorUnitario: number;
}

export interface ProdutoRequest {
  nome: string;

  unidadeMedidaId: number;

  categoriaId: number;

  estoque: number;

  estoqueMinimo: number;

  estoqueMaximo: number;

  valorUnitario: number;
}