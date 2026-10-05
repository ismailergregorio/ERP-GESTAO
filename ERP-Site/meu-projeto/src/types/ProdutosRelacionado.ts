export interface ProdutosRelacionado {
  id: number;
  codigo: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  valorTotal: number;

  produtoSistemaId: number | null;

  tipoCalculo: "MULTIPLICAR" | "DIVIDIR";

  fatorCalculo: number;

  quantidadeCalculada: number;

  possuiValidade: boolean;

  dataValidade: string | null;
}
