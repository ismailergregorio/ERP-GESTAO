import { useEffect, useState } from "react";

import Modal from "../Modal/Modal";

import type { Produto } from "../../types/Produto";

import type { ProdutoNFCompletaResponse } from "../../types/NotaFiscalCompleta";

import "./ConciliacaoProdutosModal.css";

export interface ConciliacaoProduto {
  produtoNFId: number;
  produtoPadraoId: number | null;

  quantidadeOriginal: number;

  tipoConversao: "MULTIPLICAR" | "DIVIDIR";

  fatorConversao: number;

  quantidadeConvertida: number;
}

interface ConciliacaoProdutosModalProps {
  isOpen: boolean;

  produtosNF: ProdutoNFCompletaResponse[];

  produtosPadrao: Produto[];

  numeroNF?: string;

  onClose: () => void;

  onConfirmar: (
    conciliacoes: ConciliacaoProduto[],
  ) => void;

  loading?: boolean;
}

export default function ConciliacaoProdutosModal({
  isOpen,
  produtosNF,
  produtosPadrao,
  numeroNF,
  onClose,
  onConfirmar,
  loading = false,
}: ConciliacaoProdutosModalProps) {

  const [
    conciliacoes,
    setConciliacoes,
  ] = useState<ConciliacaoProduto[]>([]);

  useEffect(() => {

    if (!isOpen) {
      return;
    }

    const dadosInicial =
      produtosNF.map((produto) => {

        const quantidade =
          Number(
            produto.quantidade ?? 0,
          );

        return {
          produtoNFId: produto.id,

          produtoPadraoId: null,

          quantidadeOriginal:
            quantidade,

          tipoConversao:
            "MULTIPLICAR" as const,

          fatorConversao: 1,

          quantidadeConvertida:
            quantidade,
        };

      });

    setConciliacoes(
      dadosInicial,
    );

  }, [isOpen, produtosNF]);

  const alterarProduto = (
    produtoNFId: number,
    produtoPadraoId: number | null,
  ) => {

    setConciliacoes((lista) =>
      lista.map((item) => {

        if (
          item.produtoNFId !==
          produtoNFId
        ) {
          return item;
        }

        return {
          ...item,
          produtoPadraoId,
        };

      }),
    );

  };

  const alterarTipoConversao = (
    produtoNFId: number,
    tipoConversao:
      | "MULTIPLICAR"
      | "DIVIDIR",
  ) => {

    setConciliacoes((lista) =>
      lista.map((item) => {

        if (
          item.produtoNFId !==
          produtoNFId
        ) {
          return item;
        }

        const quantidadeConvertida =
          calcularQuantidade(
            item.quantidadeOriginal,
            item.fatorConversao,
            tipoConversao,
          );

        return {
          ...item,
          tipoConversao,
          quantidadeConvertida,
        };

      }),
    );

  };

  const alterarFatorConversao = (
    produtoNFId: number,
    valor: string,
  ) => {

    const fator =
      Number(valor);

    const fatorValido =
      Number.isFinite(fator) &&
      fator > 0
        ? fator
        : 1;

    setConciliacoes((lista) =>
      lista.map((item) => {

        if (
          item.produtoNFId !==
          produtoNFId
        ) {
          return item;
        }

        const quantidadeConvertida =
          calcularQuantidade(
            item.quantidadeOriginal,
            fatorValido,
            item.tipoConversao,
          );

        return {
          ...item,

          fatorConversao:
            fatorValido,

          quantidadeConvertida,
        };

      }),
    );

  };

  const calcularQuantidade = (
    quantidade: number,
    fator: number,
    tipo:
      | "MULTIPLICAR"
      | "DIVIDIR",
  ) => {

    if (
      !Number.isFinite(fator) ||
      fator <= 0
    ) {
      return quantidade;
    }

    if (
      tipo === "DIVIDIR"
    ) {
      return quantidade / fator;
    }

    return quantidade * fator;
  };

  const formatarNumero = (
    valor: number,
  ) => {

    return valor.toLocaleString(
      "pt-BR",
      {
        maximumFractionDigits: 4,
      },
    );

  };

  const confirmar = () => {

    if (
      produtosNF.length === 0
    ) {

      alert(
        "Esta NF não possui produtos.",
      );

      return;
    }

    const pendentes =
      conciliacoes.filter(
        (item) =>
          item.produtoPadraoId === null,
      );

    if (
      pendentes.length > 0
    ) {

      alert(
        "Selecione o Produto Padrão para todos os produtos.",
      );

      return;
    }

    onConfirmar(
      conciliacoes,
    );

  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={(aberto) => {

        if (!aberto) {
          onClose();
        }

      }}
      title={
        numeroNF
          ? `Conciliação da NF ${numeroNF}`
          : "Conciliação de Produtos"
      }
      footer={

        <div className="conciliacao-footer">

          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={confirmar}
            disabled={
              loading ||
              produtosNF.length === 0
            }
          >
            Confirmar Conciliação
          </button>

        </div>

      }
    >

      <div className="conciliacao-produtos">

        <div className="conciliacao-header">

          <div>

            <h3>
              Produtos da Nota Fiscal
            </h3>

            <p>
              Faça a associação dos produtos
              da NF com os produtos cadastrados
              no estoque.
            </p>

          </div>

          <div className="conciliacao-contador">

            {produtosNF.length}
            {" "}
            produto(s)

          </div>

        </div>

        <div className="conciliacao-info">

          <strong>
            Conversão de unidade
          </strong>

          <span>
            Utilize a conversão quando a
            unidade da NF for diferente da
            unidade cadastrada no estoque.
          </span>

          <small>
            Exemplo: 2 caixas × 12 unidades
            = 24 unidades.
          </small>

        </div>

        <div className="conciliacao-tabela-wrapper">

          <table className="conciliacao-tabela">

            <thead>

              <tr>

                <th>
                  Código
                </th>

                <th>
                  Descrição
                </th>

                <th>
                  Qtd. NF
                </th>

                <th>
                  Un. NF
                </th>

                <th>
                  Produto Padrão
                </th>

                <th>
                  Conversão
                </th>

                <th>
                  Fator
                </th>

                <th>
                  Qtd. Convertida
                </th>

              </tr>

            </thead>

            <tbody>

              {loading && (

                <tr>

                  <td
                    colSpan={8}
                    className="conciliacao-vazio"
                  >
                    Carregando produtos...
                  </td>

                </tr>

              )}

              {!loading &&
                produtosNF.map(
                  (produtoNF) => {

                    const conciliacao =
                      conciliacoes.find(
                        (item) =>
                          item.produtoNFId ===
                          produtoNF.id,
                      );

                    return (

                      <tr
                        key={
                          produtoNF.id
                        }
                      >

                        <td>
                          {produtoNF.codigo}
                        </td>

                        <td>
                          {produtoNF.descricao}
                        </td>

                        <td>
                          {formatarNumero(
                            Number(
                              produtoNF.quantidade ??
                              0,
                            ),
                          )}
                        </td>

                        <td>

                          <span className="unidade-badge">

                            {
                              produtoNF.unidade ||
                              "-"
                            }

                          </span>

                        </td>

                        <td>

                          <select
                            className="conciliacao-select"
                            value={
                              conciliacao?.produtoPadraoId ??
                              ""
                            }
                            onChange={(event) => {

                              alterarProduto(
                                produtoNF.id,
                                event.target.value
                                  ? Number(
                                      event.target.value,
                                    )
                                  : null,
                              );

                            }}
                            disabled={loading}
                          >

                            <option value="">
                              Selecione...
                            </option>

                            {produtosPadrao.map(
                              (produto) => (

                                <option
                                  key={
                                    produto.id
                                  }
                                  value={
                                    produto.id
                                  }
                                >
                                  {
                                    produto.nome
                                  }
                                </option>

                              ),
                            )}

                          </select>

                        </td>

                        <td>

                          <select
                            className="conciliacao-select"
                            value={
                              conciliacao?.tipoConversao ??
                              "MULTIPLICAR"
                            }
                            onChange={(event) => {

                              alterarTipoConversao(
                                produtoNF.id,
                                event.target.value as
                                  | "MULTIPLICAR"
                                  | "DIVIDIR",
                              );

                            }}
                            disabled={loading}
                          >

                            <option value="MULTIPLICAR">
                              × Multiplicar
                            </option>

                            <option value="DIVIDIR">
                              ÷ Dividir
                            </option>

                          </select>

                        </td>

                        <td>

                          <input
                            type="number"
                            min="0.0001"
                            step="0.0001"
                            className="conciliacao-input"
                            value={
                              conciliacao?.fatorConversao ??
                              1
                            }
                            onChange={(event) => {

                              alterarFatorConversao(
                                produtoNF.id,
                                event.target.value,
                              );

                            }}
                            disabled={loading}
                          />

                        </td>

                        <td>

                          <strong className="quantidade-convertida">

                            {
                              formatarNumero(
                                conciliacao
                                  ?.quantidadeConvertida ??
                                Number(
                                  produtoNF.quantidade ??
                                  0,
                                ),
                              )
                            }

                          </strong>

                        </td>

                      </tr>

                    );

                  },
                )}

            </tbody>

          </table>

        </div>

      </div>

    </Modal>
  );
}