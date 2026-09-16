import api from "./api";

import type {
  ResultadoImportacaoNF,
  ErroImportacaoNF,
} from "../types/ImportacaoNF";

/*
 * =====================================================
 * IMPORTAR XML DA NOTA FISCAL
 * =====================================================
 */

export async function importarXMLNotaFiscal(
  arquivo: File,
): Promise<ResultadoImportacaoNF | ErroImportacaoNF> {
  const formData = new FormData();

  formData.append("arquivo", arquivo);

  const response = await api.post<ResultadoImportacaoNF | ErroImportacaoNF>(
    "/notas-fiscais/importar",
    formData,
    {
      headers: {
        // Isso deleta o "application/json" global apenas para esta requisição!
        "Content-Type": undefined,
      },
    },
  );

  return response.data;
}
