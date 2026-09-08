export interface CategoriaProdutoPost {
  nome: string;
}

export interface CategoriaProdutoGet {
  id: number;
  nome: string;
  dataCriacao: Date;
  dataUpdate: Date;
  ativo: boolean;
}
