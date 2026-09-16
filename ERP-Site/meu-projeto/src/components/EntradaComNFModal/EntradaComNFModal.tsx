import { useState } from "react";
import axios from "axios";

import Modal from "../Modal/Modal";

import type {
  ErroImportacaoNF,
  FornecedorImportadoNF,
  NotaFiscalImportada,
  ResultadoImportacaoNF,
} from "../../types/ImportacaoNF";

import {
  importarXMLNotaFiscal,
} from "../../services/importacaoNFService";

import "./EntradaComNFModal.css";

interface EntradaComNFModalProps {
  isOpen: boolean;

  onClose: () => void;

  /*
   * =====================================================
   * FORNECEDOR NÃO CADASTRADO
   * =====================================================
   */

  onFornecedorNaoEncontrado: (
    fornecedor: FornecedorImportadoNF,
    dadosNF: NotaFiscalImportada,
    arquivo: File
  ) => void;

  /*
   * =====================================================
   * IMPORTAÇÃO CONCLUÍDA
   * =====================================================
   */

  onImportacaoConcluida?: (
    dadosNF: NotaFiscalImportada
  ) => void;

  arquivoInicial?: File | null;
}

export default function EntradaComNFModal({
  isOpen,
  onClose,
  onFornecedorNaoEncontrado,
  onImportacaoConcluida,
  arquivoInicial = null,
}: EntradaComNFModalProps) {

  const [arquivo, setArquivo] =
    useState<File | null>(
      arquivoInicial
    );

  const [carregando, setCarregando] =
    useState(false);

  const [erro, setErro] =
    useState("");

  const [dadosNF, setDadosNF] =
    useState<NotaFiscalImportada | null>(
      null
    );

  /*
   * =====================================================
   * VERIFICAR RESPOSTA DE ERRO
   * =====================================================
   */

  function isErroImportacaoNF(
    resposta:
      | ResultadoImportacaoNF
      | ErroImportacaoNF
  ): resposta is ErroImportacaoNF {

    return "erro" in resposta;
  }

  /*
   * =====================================================
   * SELECIONAR XML
   * =====================================================
   */

  function selecionarArquivo(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Verifica extensão
     */

    if (
      !file.name
        .toLowerCase()
        .endsWith(".xml")
    ) {

      setErro(
        "Selecione um arquivo XML."
      );

      setArquivo(null);
      setDadosNF(null);

      return;
    }

    setArquivo(file);
    setErro("");
    setDadosNF(null);
  }

  /*
   * =====================================================
   * IMPORTAR XML
   * =====================================================
   */

  async function importar() {

    if (!arquivo) {

      setErro(
        "Selecione um arquivo XML."
      );

      return;
    }

    try {

      setCarregando(true);
      setErro("");

      console.log(
        "Importando XML:",
        arquivo.name
      );

      const resposta =
        await importarXMLNotaFiscal(
          arquivo
        );

      console.log(
        "Resposta da importação:",
        resposta
      );

      /*
       * =================================================
       * FORNECEDOR NÃO CADASTRADO
       *
       * Resposta:
       *
       * {
       *   erro: "...",
       *   dados: {...}
       * }
       * =================================================
       */

      if (
        isErroImportacaoNF(
          resposta
        )
      ) {

        console.log(
          "Fornecedor não cadastrado."
        );

        console.log(
          "Mensagem:",
          resposta.erro
        );

        console.log(
          "Dados:",
          resposta.dados
        );

        /*
         * Verifica se os dados foram
         * realmente enviados pelo backend.
         */

        if (
          !resposta.dados ||
          !resposta.dados.fornecedor
        ) {

          setErro(
            resposta.erro ??
              "Fornecedor não encontrado e os dados não foram retornados."
          );

          return;
        }

        /*
         * Guarda os dados da NF.
         */

        setDadosNF(
          resposta.dados
        );

        /*
         * Informa a página.
         *
         * A página irá fechar este modal
         * e abrir o cadastro do fornecedor.
         */

        onFornecedorNaoEncontrado(
          resposta.dados.fornecedor,
          resposta.dados,
          arquivo
        );

        return;
      }

      /*
       * =================================================
       * FORNECEDOR CADASTRADO
       * =================================================
       */

      if (!resposta.dados) {

        setErro(
          "O servidor não retornou os dados da nota fiscal."
        );

        return;
      }

      const dadosImportados =
        resposta.dados;

      console.log(
        "Nota fiscal importada:",
        dadosImportados
      );

      setDadosNF(
        dadosImportados
      );

      onImportacaoConcluida?.(
        dadosImportados
      );

    } catch (
      error: unknown
    ) {

      console.error(
        "Erro ao importar XML:",
        error
      );

      /*
       * =================================================
       * AXIOS
       * =================================================
       */

      if (
        axios.isAxiosError(error)
      ) {

        /*
         * ===============================================
         * FORNECEDOR NÃO CADASTRADO
         * HTTP 404
         * ===============================================
         */

        if (
          error.response?.status === 404
        ) {

          const resposta =
            error.response
              .data as ErroImportacaoNF;

          console.log(
            "Fornecedor não cadastrado:",
            resposta
          );

          /*
           * Backend retornou os dados.
           */

          if (
            resposta?.dados &&
            resposta.dados.fornecedor
          ) {

            setDadosNF(
              resposta.dados
            );

            onFornecedorNaoEncontrado(
              resposta.dados.fornecedor,
              resposta.dados,
              arquivo
            );

            return;
          }

          setErro(
            resposta?.erro ??
              "Fornecedor não encontrado."
          );

          return;
        }

        /*
         * ===============================================
         * OUTROS ERROS HTTP
         * ===============================================
         */

        const mensagem =
          error.response?.data?.message ??
          error.response?.data?.erro ??
          error.response?.data?.mensagem;

        setErro(
          mensagem ??
            "Erro ao importar a nota fiscal."
        );

        return;
      }

      /*
       * =================================================
       * ERRO DESCONHECIDO
       * =================================================
       */

      setErro(
        "Erro inesperado ao importar a nota fiscal."
      );

    } finally {

      setCarregando(false);
    }
  }

  /*
   * =====================================================
   * FECHAR MODAL
   * =====================================================
   */

  function fechar() {

    if (carregando) {
      return;
    }

    setArquivo(null);
    setDadosNF(null);
    setErro("");

    onClose();
  }

  /*
   * =====================================================
   * FORMATAR MOEDA
   * =====================================================
   */

  function formatarMoeda(
    valor:
      | number
      | null
      | undefined
  ): string {

    if (
      valor === null ||
      valor === undefined ||
      Number.isNaN(
        Number(valor)
      )
    ) {

      return "R$ 0,00";
    }

    return Number(
      valor
    ).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }

  /*
   * =====================================================
   * FORMATAR DATA
   * =====================================================
   */

  function formatarData(
    data:
      | string
      | null
      | undefined
  ): string {

    if (!data) {
      return "-";
    }

    const dataFormatada =
      new Date(data);

    if (
      Number.isNaN(
        dataFormatada.getTime()
      )
    ) {

      return "-";
    }

    return dataFormatada.toLocaleString(
      "pt-BR"
    );
  }

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <Modal
      isOpen={isOpen}
      onClose={fechar}
      title="Entrada com Nota Fiscal"
    >

      <div className="entrada-nf-modal">

        {/* =================================================
            UPLOAD
        ================================================= */}

        <div className="xml-upload">

          <label htmlFor="arquivo-xml">
            Arquivo XML da Nota Fiscal
          </label>

          <input
            id="arquivo-xml"
            type="file"
            accept=".xml,text/xml"
            onChange={selecionarArquivo}
            disabled={carregando}
          />

          {arquivo && (
            <div className="arquivo-selecionado">

              <strong>
                Arquivo:
              </strong>{" "}

              {arquivo.name}

            </div>
          )}

        </div>

        {/* =================================================
            ERRO
        ================================================= */}

        {erro && (
          <div className="entrada-nf-erro">
            {erro}
          </div>
        )}

        {/* =================================================
            BOTÕES
        ================================================= */}

        <div className="entrada-nf-actions">

          <button
            type="button"
            className="btn-secondary"
            onClick={fechar}
            disabled={carregando}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={importar}
            disabled={
              !arquivo ||
              carregando
            }
          >
            {carregando
              ? "Importando..."
              : "Importar XML"}
          </button>

        </div>

        {/* =================================================
            DADOS DA NF
        ================================================= */}

        {dadosNF && (

          <div className="nf-importada">

            <h3>
              Nota Fiscal
            </h3>

            <div className="nf-grid">

              <div>
                <span>
                  Número
                </span>

                <strong>
                  {dadosNF.numero}
                </strong>
              </div>

              <div>
                <span>
                  Série
                </span>

                <strong>
                  {dadosNF.serie}
                </strong>
              </div>

              <div>
                <span>
                  Data de Emissão
                </span>

                <strong>
                  {formatarData(
                    dadosNF.dataEmissao
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Valor Total
                </span>

                <strong>
                  {formatarMoeda(
                    dadosNF.valorTotal
                  )}
                </strong>
              </div>

              <div className="nf-chave">

                <span>
                  Chave de Acesso
                </span>

                <strong>
                  {dadosNF.chaveAcesso}
                </strong>

              </div>

            </div>

            {/* =================================================
                FORNECEDOR
            ================================================= */}

            <h3>
              Fornecedor
            </h3>

            {dadosNF.fornecedor ? (

              <div className="fornecedor-info">

                <p>
                  <strong>
                    Razão Social:
                  </strong>{" "}
                  {dadosNF.fornecedor
                    .razaoSocial || "-"}
                </p>

                <p>
                  <strong>
                    Nome Fantasia:
                  </strong>{" "}
                  {dadosNF.fornecedor
                    .nomeFantasia || "-"}
                </p>

                <p>
                  <strong>
                    CNPJ:
                  </strong>{" "}
                  {dadosNF.fornecedor
                    .cnpj || "-"}
                </p>

                <p>
                  <strong>
                    Inscrição Estadual:
                  </strong>{" "}
                  {dadosNF.fornecedor
                    .inscricaoEstadual || "-"}
                </p>

                <p>
                  <strong>
                    Endereço:
                  </strong>{" "}
                  {dadosNF.fornecedor
                    .logradouro || "-"}

                  {dadosNF.fornecedor
                    .numero
                    ? `, ${dadosNF.fornecedor.numero}`
                    : ""}
                </p>

                <p>
                  <strong>
                    Bairro:
                  </strong>{" "}
                  {dadosNF.fornecedor
                    .bairro || "-"}
                </p>

                <p>
                  <strong>
                    Município:
                  </strong>{" "}
                  {dadosNF.fornecedor
                    .municipio || "-"}
                </p>

                <p>
                  <strong>
                    UF:
                  </strong>{" "}
                  {dadosNF.fornecedor
                    .uf || "-"}
                </p>

                <p>
                  <strong>
                    CEP:
                  </strong>{" "}
                  {dadosNF.fornecedor
                    .cep || "-"}
                </p>

              </div>

            ) : (

              <div className="entrada-nf-erro">
                Dados do fornecedor não
                encontrados.
              </div>

            )}

            {/* =================================================
                PRODUTOS
            ================================================= */}

            <h3>
              Produtos (
              {dadosNF.produtos?.length ?? 0}
              )
            </h3>

            <div className="produtos-nf">

              {dadosNF.produtos &&
              dadosNF.produtos.length > 0 ? (

                dadosNF.produtos.map(
                  (
                    produto,
                    index
                  ) => (

                    <div
                      key={`${produto.codigo}-${index}`}
                      className="produto-nf"
                    >

                      <strong>
                        {produto.codigo}
                      </strong>

                      <span>
                        {produto.descricao}
                      </span>

                      <span>
                        {produto.unidade}
                      </span>

                      <span>
                        Qtd:{" "}
                        {produto.quantidade ?? 0}
                      </span>

                      <span>
                        {formatarMoeda(
                          produto.valorTotal
                        )}
                      </span>

                    </div>

                  )
                )

              ) : (

                <div>
                  Nenhum produto
                  encontrado.
                </div>

              )}

            </div>

          </div>

        )}

      </div>

    </Modal>
  );
}