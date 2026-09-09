export interface ProdutoRegistroNF {
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
