import { useEffect, useState } from "react";

import Modal from "../../Componete/Modal/Modal";
import Table from "../../Componete/Table/Table";
import type { Column } from "../../Componete/Table/Table.types";

import api from "../../Services/Api";
import { toast } from "react-toastify";

import { getProduto, getFornecedor } from "./Functions";

import type { Entrada, FornecedorNf } from "./PageEstoqueEntrada";

/* =========================================================
   PROPS
========================================================= */

interface ConfigModalprops {
  stadoModal?: boolean;
  onClose: () => void;
  entrada?: Entrada | null;
}

/* =========================================================
   PRODUTO DA ENTRADA
========================================================= */

interface ProdutoEntrada {
  id: number;
  entrada_id: number;
  produto_id: number;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  dataCriacao: string;
  dataAtualizacao: string;
}

/* =========================================================
   PRODUTO
========================================================= */

interface Produto {
  id: number;
  nome: string;
  valorUnitario?: number;
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function ModalViewEntrada({
  stadoModal = false,
  onClose,
  entrada = null,
}: ConfigModalprops) {
  /* =========================================================
     ESTADOS
  ========================================================= */

  /*
   * Produtos relacionados à entrada.
   */
  const [produtosEntrada, setProdutosEntrada] = useState<ProdutoEntrada[]>([]);

  /*
   * Produtos cadastrados.

   * Exemplo:

   * {
   *   1: Produto,
   *   2: Produto,
   *   5: Produto
   * }
   */
  const [produtos, setProdutos] = useState<Record<number, Produto>>({});

  /*
   * Fornecedor da entrada.
   */
  const [fornecedor, setFornecedor] = useState<FornecedorNf | null>(null);

  /*
   * Estado de carregamento.
   */
  const [carregando, setCarregando] = useState(false);

  /* =========================================================
     BUSCAR DADOS DA ENTRADA
  ========================================================= */

  useEffect(() => {
    /*
     * Se o modal estiver fechado ou não existir
     * uma entrada selecionada, não faz nada.
     */
    if (!stadoModal || !entrada?.id) {
      return;
    }

    async function buscarDadosEntrada() {
      try {
        setCarregando(true);

        /* =====================================================
           BUSCAR FORNECEDOR
        ===================================================== */

        /*
         * A entrada possui:
         *
         * fornecedor_id
         *
         * Usamos esse ID para buscar os dados
         * completos do fornecedor.
         */
        let fornecedorEncontrado = null;

        if (entrada?.fornecedor_id !== undefined) {
          fornecedorEncontrado = await getFornecedor(entrada.fornecedor_id);
        }

        /*
         * A função pode retornar null.
         */
        if (fornecedorEncontrado) {
          setFornecedor(fornecedorEncontrado);
        } else {
          setFornecedor(null);
        }

        /* =====================================================
           BUSCAR PRODUTOS DA ENTRADA
        ===================================================== */

        const resposta = await api.get(
          `/entrada-produtos/entrada/${entrada?.id}`,
        );

        const produtosApi: ProdutoEntrada[] = resposta.data;

        console.log("Produtos da entrada:", produtosApi);

        setProdutosEntrada(produtosApi);

        /* =====================================================
           BUSCAR PRODUTOS
        ===================================================== */

        /*
         * Busca os dados completos de cada produto.
         */
        const produtosEncontrados = await Promise.all(
          produtosApi.map(async (item) => {
            try {
              const produto = await getProduto(item.produto_id);

              /*
               * getProduto pode retornar null.
               */
              if (!produto) {
                return null;
              }

              return {
                id: item.produto_id,
                produto,
              };
            } catch (error) {
              console.error(
                `Erro ao buscar produto ${item.produto_id}:`,
                error,
              );

              return null;
            }
          }),
        );

        /* =====================================================
           CRIAR MAPA DE PRODUTOS
        ===================================================== */

        const mapaProdutos: Record<number, Produto> = {};

        produtosEncontrados.forEach((item) => {
          if (item) {
            mapaProdutos[item.id] = item.produto;
          }
        });

        setProdutos(mapaProdutos);

        console.log("Mapa de produtos:", mapaProdutos);
      } catch (e: any) {
        console.error(e);

        toast.error(
          e.response?.data?.message ?? "Erro ao buscar os dados da entrada.",
        );

        setProdutosEntrada([]);

        setProdutos({});

        setFornecedor(null);
      } finally {
        setCarregando(false);
      }
    }

    buscarDadosEntrada();
  }, [stadoModal, entrada?.id, entrada?.fornecedor_id]);

  /* =========================================================
     FECHAR MODAL
  ========================================================= */

  function fecharModal() {
    setProdutosEntrada([]);

    setProdutos({});

    setFornecedor(null);

    onClose();
  }

  /* =========================================================
     COLUNAS DA TABELA
  ========================================================= */

  const colunasProdutos: Column<ProdutoEntrada>[] = [
    /* =======================================================
       PRODUTO
    ======================================================= */

    {
      key: "produto_id",

      title: "Produto",

      align: "center",

      render: (valor) => {
        /*
         * Procura o produto no mapa.
         */
        const produto = produtos[Number(valor)];

        /*
         * Caso ainda não tenha encontrado
         * o produto.
         */
        if (!produto) {
          return "Produto não encontrado";
        }

        return produto.nome;
      },
    },

    /* =======================================================
       QUANTIDADE
    ======================================================= */

    {
      key: "quantidade",

      title: "Quantidade",

      align: "center",
    },

    /* =======================================================
       VALOR UNITÁRIO
    ======================================================= */

    {
      key: "valorUnitario",

      title: "Valor Unitário",

      align: "right",

      render: (value) => {
        return Number(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },

    /* =======================================================
       VALOR TOTAL
    ======================================================= */

    {
      key: "valorTotal",

      title: "Valor Total",

      align: "right",

      render: (value) => {
        return Number(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },

    /* =======================================================
       DATA
    ======================================================= */

    {
      key: "dataCriacao",

      title: "Data de Criação",

      render: (value) => {
        if (!value) {
          return "-";
        }

        return new Date(value).toLocaleString("pt-BR");
      },
    },
  ];

  /* =========================================================
     TOTAL DA ENTRADA
  ========================================================= */

  const totalEntrada = produtosEntrada.reduce(
    (total, produto) => {
      return total + Number(produto.valorTotal);
    },

    0,
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Modal
      open={stadoModal}
      title={`Visualizar Entrada #${entrada?.id ?? ""}`}
      onClose={fecharModal}
      tamanho="max"
    >
      {/* =====================================================
          CARREGANDO
      ===================================================== */}

      {carregando && (
        <div>
          <p>Carregando informações...</p>
        </div>
      )}

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      {!carregando && entrada && (
        <>
          {/* =================================================
              INFORMAÇÕES DA ENTRADA
          ================================================= */}

          <div className="entrada-view-header">
            <h3>Informações da Entrada</h3>
          </div>

          <div className="entrada-informacoes">
            {/* ===============================================
                ID
            =============================================== */}

            <div className="entrada-info-item">
              <span>Nº da Entrada</span>

              <strong>{entrada.id}</strong>
            </div>

            {/* ===============================================
                NOTA FISCAL
            =============================================== */}

            <div className="entrada-info-item">
              <span>Nota Fiscal</span>

              <strong>{entrada.notaFiscal}</strong>
            </div>

            {/* ===============================================
                FORNECEDOR
            =============================================== */}

            <div className="entrada-info-item">
              <span>Fornecedor</span>

              <strong>{fornecedor?.nomeFantasia ?? "-"}</strong>
            </div>

            {/* ===============================================
                RAZÃO SOCIAL
            =============================================== */}

            <div className="entrada-info-item">
              <span>Razão Social</span>

              <strong>{fornecedor?.razaoSocial ?? "-"}</strong>
            </div>

            {/* ===============================================
                CNPJ
            =============================================== */}

            <div className="entrada-info-item">
              <span>CNPJ</span>

              <strong>{fornecedor?.cnpj ?? "-"}</strong>
            </div>

            {/* ===============================================
                INSCRIÇÃO ESTADUAL
            =============================================== */}

            <div className="entrada-info-item">
              <span>Inscrição Estadual</span>

              <strong>{fornecedor?.inscricaoEstadual ?? "-"}</strong>
            </div>

            {/* ===============================================
                OBSERVAÇÃO
            =============================================== */}

            <div className="entrada-info-item entrada-observacao">
              <span>Observação</span>

              <strong>{entrada.observacao || "Nenhuma observação"}</strong>
            </div>

            {/* ===============================================
                DATA
            =============================================== */}

            <div className="entrada-info-item">
              <span>Data da Entrada</span>

              <strong>
                {entrada.dataCriacao
                  ? new Date(entrada.dataCriacao).toLocaleString("pt-BR")
                  : "-"}
              </strong>
            </div>
          </div>

          {/* =================================================
              PRODUTOS
          ================================================= */}

          <div className="entrada-view-header">
            <h3>Produtos da Entrada</h3>

            <span>
              {produtosEntrada.length}{" "}
              {produtosEntrada.length === 1 ? "produto" : "produtos"}
            </span>
          </div>

          {/* =================================================
              SEM PRODUTOS
          ================================================= */}

          {produtosEntrada.length === 0 && (
            <div>
              <p>Nenhum produto encontrado para esta entrada.</p>
            </div>
          )}

          {/* =================================================
              TABELA
          ================================================= */}

          {produtosEntrada.length > 0 && (
            <>
              <Table<ProdutoEntrada>
                columns={colunasProdutos}
                data={produtosEntrada}
              />

              {/* =============================================
                  TOTAL
              ============================================= */}

              <div className="nf-total">
                <span>Total da Entrada:</span>

                <strong>
                  {totalEntrada.toLocaleString("pt-BR", {
                    style: "currency",

                    currency: "BRL",
                  })}
                </strong>
              </div>
            </>
          )}
        </>
      )}
    </Modal>
  );
}
