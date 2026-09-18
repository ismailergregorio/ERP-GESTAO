export interface ProdutosRelacionado {
  codigo: string;
  descricao: string;
  quantidade: number;
  unidade: string;

  produtoSistemaId: number | null;

  tipoCalculo: "MULTIPLICAR" | "DIVIDIR";

  fatorCalculo: number;

  quantidadeCalculada: number;

  possuiValidade: boolean;

  dataValidade: string | null;
}

export interface ProdutosRelacionado {
  id: number;
  codigo: string;
  descricao: string;
  quantidade: number;
  unidade: string;

  produtoSistemaId: number | null;

  tipoCalculo: "MULTIPLICAR" | "DIVIDIR";

  fatorCalculo: number;

  quantidadeCalculada: number;

  possuiValidade: boolean;

  dataValidade: string | null;
}
