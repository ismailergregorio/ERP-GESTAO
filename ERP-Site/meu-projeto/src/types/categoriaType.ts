export interface CategoriaProdutoPost {
  nome: string;
}

export interface CategoriaProdutoGet {
  id: number;
  nome: string;
  dataCriacao: Date;
  dataUpdate: Date;
  ativo: boolean | "Ativa" | "Inativa";
  
}

export interface Categoria {
  id: number;

  nome: string;

  descricao: string;

  ativo?: boolean | "Ativa" | "Inativa";

  dataCriacao?: string;
}
