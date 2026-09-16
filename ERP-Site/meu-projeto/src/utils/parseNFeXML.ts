import type { FornecedorImportadoNF } from "../types/ImportacaoNF";

function obterElemento(
  elemento: Element | null,
  nome: string
): string {
  if (!elemento) {
    return "";
  }

  const encontrado = Array.from(elemento.getElementsByTagName("*"))
    .find((item) => item.localName === nome);

  return encontrado?.textContent?.trim() ?? "";
}

export function extrairFornecedorDoXML(
  xml: string
): FornecedorImportadoNF {
  const parser = new DOMParser();

  const documento = parser.parseFromString(
    xml,
    "application/xml"
  );

  const erro = documento.querySelector("parsererror");

  if (erro) {
    throw new Error("O arquivo XML é inválido.");
  }

  const emit = Array.from(
    documento.getElementsByTagName("*")
  ).find(
    (elemento) => elemento.localName === "emit"
  );

  if (!emit) {
    throw new Error(
      "Não foi possível localizar o fornecedor no XML."
    );
  }

  const endereco = Array.from(
    emit.getElementsByTagName("*")
  ).find(
    (elemento) => elemento.localName === "enderEmit"
  );

  return {
    cnpj: obterElemento(emit, "CNPJ"),
    razaoSocial: obterElemento(emit, "xNome"),
    nomeFantasia: obterElemento(emit, "xFant"),
    inscricaoEstadual: obterElemento(emit, "IE"),

    logradouro: obterElemento(endereco ?? null, "xLgr"),
    numero: obterElemento(endereco ?? null, "nro"),
    bairro: obterElemento(endereco ?? null, "xBairro"),
    municipio: obterElemento(endereco ?? null, "xMun"),
    uf: obterElemento(endereco ?? null, "UF"),
    cep: obterElemento(endereco ?? null, "CEP"),
  };
}