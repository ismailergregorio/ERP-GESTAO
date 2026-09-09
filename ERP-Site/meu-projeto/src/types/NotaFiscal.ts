export interface NotaFiscal {
  id: number;

  numero: string;

  fornecedorId: number;

  razaoSocialFornecedor: string;

  nomeFantasiaFornecedor: string;

  chaveAcesso: string;

  dataCriacao: string;

  dataUpdate: string | null;
}
export interface NotaFiscalRequest {
  numero: string;

  fornecedorId: number;

  chaveAcesso: string;
}
