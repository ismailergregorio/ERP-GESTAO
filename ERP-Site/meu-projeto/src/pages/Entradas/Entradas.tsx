import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";

import Table, {
  type TableColumn,
  type TableAction,
} from "../../components/Table/Table";

import Modal from "../../components/Modal/Modal";

import EntradaComNFModal from "../../components/EntradaComNFModal/EntradaComNFModal";

import FornecedorModal from "../../components/FornecedorModal/FornecedorModal";

import ConciliacaoProdutosModal, {
  type ConciliacaoProduto,
} from "../../components/ConciliacaoProdutosModal/ConciliacaoProdutosModal";

import {
  listarEntradas,
  excluirEntrada,
} from "../../services/entradaService";

import {
  criarFornecedor,
  listarFornecedores,
} from "../../services/fornecedorService";

import {
  criarNotaFiscalCompleta,
} from "../../services/notaFiscalCompletaServices";

import {
  listarProdutos,
} from "../../services/produtoService";

import api from "../../services/api";

import type { Entrada } from "../../types/Entrada";

import type {
  Fornecedor,
  FornecedorRequest,
} from "../../types/Fornecedor";

import type {
  Produto,
} from "../../types/Produto";

import type {
  FornecedorImportadoNF,
  NotaFiscalImportada,
} from "../../types/ImportacaoNF";

import type {
  NotaFiscalCompletaResponse,
  ProdutoNFCompletaResponse,
} from "../../types/NotaFiscalCompleta";

import "./Entradas.css";

/*
 * =====================================================
 * TIPO DAS NFS LISTADAS
 * =====================================================
 */

interface NotaFiscalLista {
  id: number;
  numero: string;
  fornecedorId: number;
  razaoSocialFornecedor: string;
  nomeFantasiaFornecedor: string;
  chaveAcesso: string;
  dataCriacao: string;
  dataUpdate: string | null;
}

/*
 * =====================================================
 * COMPONENTE
 * =====================================================
 */

export default function Entradas() {

  /*
   * =====================================================
   * ENTRADAS
   * =====================================================
   */

  const [
    entradas,
    setEntradas,
  ] = useState<Entrada[]>([]);

  const [
    entradaSelecionada,
    setEntradaSelecionada,
  ] = useState<Entrada | null>(null);

  /*
   * =====================================================
   * NOTAS FISCAIS
   * =====================================================
   */

  const [
    notasFiscais,
    setNotasFiscais,
  ] = useState<NotaFiscalLista[]>([]);

  /*
   * =====================================================
   * NF ATUAL DA CONCILIAÇÃO
   *
   * Essa variável será usada tanto para:
   *
   * - NF recém-importada
   * - NF antiga
   * =====================================================
   */

  const [
    notaFiscalParaConciliacao,
    setNotaFiscalParaConciliacao,
  ] = useState<NotaFiscalCompletaResponse | null>(
    null,
  );

  /*
   * =====================================================
   * PRODUTOS PADRÃO
   * =====================================================
   */

  const [
    produtosPadrao,
    setProdutosPadrao,
  ] = useState<Produto[]>([]);

  /*
   * =====================================================
   * MODAIS
   * =====================================================
   */

  const [
    modalVisualizacaoAberto,
    setModalVisualizacaoAberto,
  ] = useState(false);

  const [
    modalNovaEntradaAberto,
    setModalNovaEntradaAberto,
  ] = useState(false);

  const [
    modalEntradaNFAberto,
    setModalEntradaNFAberto,
  ] = useState(false);

  const [
    modalFornecedorAberto,
    setModalFornecedorAberto,
  ] = useState(false);

  const [
    modalConciliacaoAberto,
    setModalConciliacaoAberto,
  ] = useState(false);

  const [
    modalNFsAberto,
    setModalNFsAberto,
  ] = useState(false);

  const [
    modalSucessoImportacao,
    setModalSucessoImportacao,
  ] = useState(false);

  /*
   * =====================================================
   * DADOS TEMPORÁRIOS DA IMPORTAÇÃO
   * =====================================================
   */

  const [
    fornecedorImportado,
    setFornecedorImportado,
  ] = useState<FornecedorImportadoNF | null>(null);

  const [
    dadosNFImportada,
    setDadosNFImportada,
  ] = useState<NotaFiscalImportada | null>(null);

  const [
    arquivoXML,
    setArquivoXML,
  ] = useState<File | null>(null);

  /*
   * =====================================================
   * NF RECÉM-IMPORTADA
   * =====================================================
   */

  const [
    notaFiscalImportada,
    setNotaFiscalImportada,
  ] = useState<NotaFiscalCompletaResponse | null>(
    null,
  );

  /*
   * =====================================================
   * FORNECEDOR
   * =====================================================
   */

  const [
    fornecedorIdImportacao,
    setFornecedorIdImportacao,
  ] = useState<number | null>(null);

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */

  const [
    loadingDados,
    setLoadingDados,
  ] = useState(false);

  const [
    loadingFornecedor,
    setLoadingFornecedor,
  ] = useState(false);

  const [
    loadingNFs,
    setLoadingNFs,
  ] = useState(false);

  const [
    loadingProdutosNF,
    setLoadingProdutosNF,
  ] = useState(false);

  /*
   * =====================================================
   * CARREGAR ENTRADAS
   * =====================================================
   */

  useEffect(() => {

    carregarEntradas();

  }, []);

  const carregarEntradas = async () => {

    try {

      setLoadingDados(true);

      const dados =
        await listarEntradas();

      setEntradas(
        dados,
      );

    } catch (error) {

      console.error(
        "Erro ao carregar entradas:",
        error,
      );

    } finally {

      setLoadingDados(false);

    }

  };

  /*
   * =====================================================
   * LIMPAR DADOS DA IMPORTAÇÃO
   * =====================================================
   */

  const limparDadosImportacao = () => {

    setFornecedorImportado(
      null,
    );

    setDadosNFImportada(
      null,
    );

    setArquivoXML(
      null,
    );

    setFornecedorIdImportacao(
      null,
    );

  };

  /*
   * =====================================================
   * LIMPAR FLUXO
   * =====================================================
   */

  const limparFluxoNF = () => {

    limparDadosImportacao();

    setNotaFiscalImportada(
      null,
    );

    setNotaFiscalParaConciliacao(
      null,
    );

    setProdutosPadrao(
      [],
    );

  };

  /*
   * =====================================================
   * NOVA ENTRADA
   * =====================================================
   */

  const abrirNovaEntrada = () => {

    setModalNovaEntradaAberto(
      true,
    );

  };

  const fecharNovaEntrada = () => {

    setModalNovaEntradaAberto(
      false,
    );

  };

  /*
   * =====================================================
   * ENTRADA COM NF
   * =====================================================
   */

  const abrirEntradaComNF = () => {

    fecharNovaEntrada();

    limparFluxoNF();

    setModalEntradaNFAberto(
      true,
    );

  };

  const fecharEntradaComNF = () => {

    setModalEntradaNFAberto(
      false,
    );

    limparFluxoNF();

  };

  /*
   * =====================================================
   * SALVAR NF COMPLETA
   * =====================================================
   */

  const finalizarImportacaoNF = async (
    fornecedorId: number,
    dadosNF: NotaFiscalImportada,
  ) => {

    try {

      setLoadingDados(true);

      /*
       * =================================================
       * PAYLOAD
       * =================================================
       */

      const payload = {

        numero:
          dadosNF.numero,

        fornecedorId:
          fornecedorId,

        chaveAcesso:
          dadosNF.chaveAcesso,

        produtos:
          dadosNF.produtos.map(
            (produto) => ({

              codigo:
                produto.codigo,

              descricao:
                produto.descricao,

              unidade:
                produto.unidade,

              quantidade:
                produto.quantidade,

              valorUnitario:
                produto.valorUnitario,

              valorTotal:
                produto.valorTotal,

            }),
          ),

      };

      console.log(
        "=================================",
      );

      console.log(
        "SALVANDO NF COMPLETA",
      );

      console.log(
        payload,
      );

      console.log(
        "=================================",
      );

      /*
       * =================================================
       * SALVA NF
       * =================================================
       */

      const resposta =
        await criarNotaFiscalCompleta(
          payload,
        );

      console.log(
        "NF salva:",
        resposta,
      );

      /*
       * Guarda NF recém-importada.
       */

      setNotaFiscalImportada(
        resposta,
      );

      /*
       * Guarda também como NF para conciliação.
       */

      setNotaFiscalParaConciliacao(
        resposta,
      );

      /*
       * Fecha modal de importação.
       */

      setModalEntradaNFAberto(
        false,
      );

      /*
       * Abre modal de sucesso.
       */

      setModalSucessoImportacao(
        true,
      );

      /*
       * Não abrimos a conciliação automaticamente.
       */

      /*
       * =================================================
       * CARREGAR PRODUTOS PADRÃO
       * =================================================
       */

      try {

        const produtos =
          await listarProdutos();

        setProdutosPadrao(
          produtos,
        );

      } catch (error) {

        console.error(
          "Erro ao carregar produtos padrão:",
          error,
        );

      }

    } catch (error: unknown) {

      console.error(
        "Erro ao salvar NF:",
        error,
      );

      if (
        axios.isAxiosError(error)
      ) {

        const mensagem =
          error.response?.data?.message ??
          error.response?.data?.erro ??
          error.response?.data?.mensagem;

        alert(
          mensagem ??
          "Erro ao salvar a Nota Fiscal.",
        );

      } else {

        alert(
          "Erro inesperado ao salvar a Nota Fiscal.",
        );

      }

    } finally {

      setLoadingDados(false);

    }

  };

  /*
   * =====================================================
   * FORNECEDOR NÃO ENCONTRADO
   * =====================================================
   */

  const tratarFornecedorNaoEncontrado = (
    fornecedor: FornecedorImportadoNF,
    dadosNF: NotaFiscalImportada,
    arquivo: File,
  ) => {

    console.log(
      "Fornecedor não encontrado.",
    );

    setFornecedorImportado(
      fornecedor,
    );

    setDadosNFImportada(
      dadosNF,
    );

    setArquivoXML(
      arquivo,
    );

    setFornecedorIdImportacao(
      null,
    );

    setModalEntradaNFAberto(
      false,
    );

    setModalFornecedorAberto(
      true,
    );

  };

  /*
   * =====================================================
   * FECHAR FORNECEDOR
   * =====================================================
   */

  const fecharFornecedor = () => {

    if (
      loadingFornecedor
    ) {
      return;
    }

    setModalFornecedorAberto(
      false,
    );

    limparFluxoNF();

  };

  /*
   * =====================================================
   * CADASTRAR FORNECEDOR
   * =====================================================
   */

  const handleSalvarFornecedor = async (
    dados: FornecedorRequest,
  ) => {

    try {

      setLoadingFornecedor(true);

      const fornecedor =
        await criarFornecedor(
          dados,
        );

      console.log(
        "Fornecedor cadastrado:",
        fornecedor,
      );

      setFornecedorIdImportacao(
        fornecedor.id,
      );

      if (
        !dadosNFImportada
      ) {

        alert(
          "Fornecedor cadastrado, mas os dados da NF não estão disponíveis.",
        );

        setModalFornecedorAberto(
          false,
        );

        limparFluxoNF();

        return;

      }

      /*
       * Salva NF + produtos.
       */

      await finalizarImportacaoNF(
        fornecedor.id,
        dadosNFImportada,
      );

      setModalFornecedorAberto(
        false,
      );

    } catch (error: unknown) {

      console.error(
        "Erro ao cadastrar fornecedor:",
        error,
      );

      if (
        axios.isAxiosError(error)
      ) {

        const mensagem =
          error.response?.data?.message ??
          error.response?.data?.erro ??
          error.response?.data?.mensagem;

        alert(
          mensagem ??
          "Erro ao cadastrar fornecedor.",
        );

      } else {

        alert(
          "Erro inesperado ao cadastrar fornecedor.",
        );

      }

    } finally {

      setLoadingFornecedor(false);

    }

  };

  /*
   * =====================================================
   * IMPORTAÇÃO CONCLUÍDA
   * =====================================================
   */

  const handleImportacaoConcluida = async (
    dados: NotaFiscalImportada,
  ) => {

    try {

      setLoadingDados(true);

      setDadosNFImportada(
        dados,
      );

      /*
       * CNPJ
       */

      const cnpj =
        dados.fornecedor?.cnpj;

      if (!cnpj) {

        alert(
          "O CNPJ do fornecedor não foi encontrado.",
        );

        return;

      }

      /*
       * Busca fornecedores.
       */

      const fornecedores =
        await listarFornecedores();

      const cnpjImportado =
        cnpj.replace(
          /\D/g,
          "",
        );

      /*
       * Procura fornecedor.
       */

      const fornecedorEncontrado =
        fornecedores.find(
          (fornecedor: Fornecedor) =>
            fornecedor.cnpj?.replace(
              /\D/g,
              "",
            ) === cnpjImportado,
        );

      if (
        !fornecedorEncontrado
      ) {

        alert(
          "O fornecedor informado na NF não foi encontrado no cadastro.",
        );

        return;

      }

      setFornecedorIdImportacao(
        fornecedorEncontrado.id,
      );

      /*
       * Salva NF.
       */

      await finalizarImportacaoNF(
        fornecedorEncontrado.id,
        dados,
      );

    } catch (error: unknown) {

      console.error(
        "Erro ao processar importação:",
        error,
      );

      if (
        axios.isAxiosError(error)
      ) {

        const mensagem =
          error.response?.data?.message ??
          error.response?.data?.erro ??
          error.response?.data?.mensagem;

        alert(
          mensagem ??
          "Erro ao processar a importação.",
        );

      } else {

        alert(
          "Erro inesperado ao processar a importação.",
        );

      }

    } finally {

      setLoadingDados(false);

    }

  };

  /*
   * =====================================================
   * SEGUIR PARA CONCILIAÇÃO
   * =====================================================
   */

  const seguirParaConciliacao = async () => {

    if (
      !notaFiscalImportada
    ) {

      alert(
        "Nenhuma NF importada foi encontrada.",
      );

      return;

    }

    try {

      /*
       * Fecha modal de sucesso.
       */

      setModalSucessoImportacao(
        false,
      );

      /*
       * Define a NF.
       */

      setNotaFiscalParaConciliacao(
        notaFiscalImportada,
      );

      /*
       * Carrega produtos padrão.
       */

      setLoadingProdutosNF(
        true,
      );

      const produtos =
        await listarProdutos();

      setProdutosPadrao(
        produtos,
      );

      /*
       * Abre conciliação.
       */

      setModalConciliacaoAberto(
        true,
      );

    } catch (error) {

      console.error(
        "Erro ao abrir conciliação:",
        error,
      );

      alert(
        "Não foi possível carregar os produtos para conciliação.",
      );

    } finally {

      setLoadingProdutosNF(
        false,
      );

    }

  };

  /*
   * =====================================================
   * LISTAR NFS EXISTENTES
   * =====================================================
   */

  const abrirNFsExistentes = async () => {

    try {

      setLoadingNFs(
        true,
      );

      const response =
        await api.get<NotaFiscalLista[]>(
          "/nf",
        );

      setNotasFiscais(
        response.data,
      );

      setModalNFsAberto(
        true,
      );

    } catch (error) {

      console.error(
        "Erro ao carregar notas fiscais:",
        error,
      );

      alert(
        "Não foi possível carregar as notas fiscais.",
      );

    } finally {

      setLoadingNFs(
        false,
      );

    }

  };

  /*
   * =====================================================
   * ABRIR NF EXISTENTE PARA CONCILIAÇÃO
   * =====================================================
   */

  const abrirNFParaConciliacao = async (
    nf: NotaFiscalLista,
  ) => {

    try {

      setLoadingProdutosNF(
        true,
      );

      /*
       * Busca produtos da NF.
       */

      const response =
        await api.get<
          ProdutoNFCompletaResponse[]
        >(
          `/produtos-registro-nf/nf/${nf.id}`,
        );

      /*
       * Busca produtos padrão.
       */

      const produtos =
        await listarProdutos();

      setProdutosPadrao(
        produtos,
      );

      /*
       * Monta NF completa.
       */

      const nota: NotaFiscalCompletaResponse = {

        id:
          nf.id,

        numero:
          nf.numero,

        fornecedorId:
          nf.fornecedorId,

        razaoSocialFornecedor:
          nf.razaoSocialFornecedor,

        nomeFantasiaFornecedor:
          nf.nomeFantasiaFornecedor,

        chaveAcesso:
          nf.chaveAcesso,

        dataCriacao:
          nf.dataCriacao,

        dataUpdate:
          nf.dataUpdate,

        produtos:
          response.data,

      };

      /*
       * Guarda NF para conciliação.
       */

      setNotaFiscalParaConciliacao(
        nota,
      );

      /*
       * Fecha lista.
       */

      setModalNFsAberto(
        false,
      );

      /*
       * Abre conciliação.
       */

      setModalConciliacaoAberto(
        true,
      );

    } catch (error) {

      console.error(
        "Erro ao carregar NF:",
        error,
      );

      alert(
        "Não foi possível carregar os produtos desta NF.",
      );

    } finally {

      setLoadingProdutosNF(
        false,
      );

    }

  };

  /*
   * =====================================================
   * CONFIRMAR CONCILIAÇÃO
   * =====================================================
   */

  const confirmarConciliacao = (
    conciliacoes: ConciliacaoProduto[],
  ) => {

    console.log(
      "=================================",
    );

    console.log(
      "CONCILIAÇÃO",
    );

    console.log(
      "NF:",
      notaFiscalParaConciliacao,
    );

    console.log(
      "PRODUTOS:",
      conciliacoes,
    );

    console.log(
      "=================================",
    );

    /*
     * Exemplo de dados recebidos:
     *
     * produtoNFId
     * produtoPadraoId
     * quantidadeOriginal
     * tipoConversao
     * fatorConversao
     * quantidadeConvertida
     */

    conciliacoes.forEach(
      (item) => {

        console.log(
          "Produto NF:",
          item.produtoNFId,
        );

        console.log(
          "Produto padrão:",
          item.produtoPadraoId,
        );

        console.log(
          "Quantidade original:",
          item.quantidadeOriginal,
        );

        console.log(
          "Tipo conversão:",
          item.tipoConversao,
        );

        console.log(
          "Fator:",
          item.fatorConversao,
        );

        console.log(
          "Quantidade convertida:",
          item.quantidadeConvertida,
        );

      },
    );

    alert(
      "Conciliação preparada com sucesso.",
    );

    fecharConciliacao();

  };

  /*
   * =====================================================
   * FECHAR CONCILIAÇÃO
   * =====================================================
   */

  const fecharConciliacao = () => {

    setModalConciliacaoAberto(
      false,
    );

    setNotaFiscalParaConciliacao(
      null,
    );

    setProdutosPadrao(
      [],
    );

    carregarEntradas();

  };

  /*
   * =====================================================
   * FECHAR MODAL DE SUCESSO
   * =====================================================
   */

  const fecharSucessoImportacao = () => {

    setModalSucessoImportacao(
      false,
    );

    limparFluxoNF();

    carregarEntradas();

  };

  /*
   * =====================================================
   * VISUALIZAR ENTRADA
   * =====================================================
   */

  const visualizarEntrada = (
    entrada: Entrada,
  ) => {

    setEntradaSelecionada(
      entrada,
    );

    setModalVisualizacaoAberto(
      true,
    );

  };

  const fecharVisualizacao = () => {

    setModalVisualizacaoAberto(
      false,
    );

    setEntradaSelecionada(
      null,
    );

  };

  /*
   * =====================================================
   * EXCLUIR
   * =====================================================
   */

  const excluir = async (
    entrada: Entrada,
  ) => {

    const confirmar =
      window.confirm(
        `Deseja realmente excluir a entrada #${entrada.id}?`,
      );

    if (!confirmar) {
      return;
    }

    try {

      setLoadingDados(
        true,
      );

      await excluirEntrada(
        entrada.id,
      );

      setEntradas(
        (lista) =>
          lista.filter(
            (item) =>
              item.id !==
              entrada.id,
          ),
      );

    } catch (error) {

      console.error(
        "Erro ao excluir entrada:",
        error,
      );

      alert(
        "Não foi possível excluir a entrada.",
      );

    } finally {

      setLoadingDados(
        false,
      );

    }

  };

  /*
   * =====================================================
   * FORMATAÇÃO
   * =====================================================
   */

  const formatarData = (
    data: string | null,
  ): string => {

    if (!data) {
      return "-";
    }

    const dataFormatada =
      new Date(data);

    if (
      Number.isNaN(
        dataFormatada.getTime(),
      )
    ) {

      return "-";

    }

    return dataFormatada.toLocaleString(
      "pt-BR",
    );

  };

  /*
   * =====================================================
   * COLUNAS
   * =====================================================
   */

  const columns: TableColumn<Entrada>[] =
    [

      {
        key: "id",
        label: "ID",
        width: "70px",
        align: "center",
      },

      {
        key: "nomeTipoEntrada",
        label: "Tipo de entrada",
      },

      {
        key: "numeroNF",
        label: "Nota Fiscal",

        render: (
          value: unknown,
        ): ReactNode => {

          if (
            value === null ||
            value === undefined ||
            value === ""
          ) {

            return "Sem NF";

          }

          return String(
            value,
          );

        },

      },

      {
        key: "obs",
        label: "Observação",

        render: (
          value: unknown,
        ): ReactNode => {

          if (
            value === null ||
            value === undefined ||
            value === ""
          ) {

            return "-";

          }

          return String(
            value,
          );

        },

      },

      {
        key: "dataCriacao",
        label: "Data",

        render: (
          value: unknown,
        ): ReactNode => {

          if (!value) {
            return "-";
          }

          return formatarData(
            String(value),
          );

        },

      },

      {
        key: "dataUpdate",
        label: "Atualização",

        render: (
          value: unknown,
        ): ReactNode => {

          if (!value) {
            return "-";
          }

          return formatarData(
            String(value),
          );

        },

      },

    ];

  /*
   * =====================================================
   * AÇÕES
   * =====================================================
   */

  const actions: TableAction<Entrada>[] =
    [

      {
        label: "Visualizar",

        variant: "secondary",

        onClick:
          visualizarEntrada,

      },

      {
        label: "Editar",

        variant: "primary",

        onClick: (
          entrada: Entrada,
        ) => {

          console.log(
            "Editar entrada:",
            entrada,
          );

        },

      },

      {
        label: "Excluir",

        variant: "danger",

        onClick:
          excluir,

      },

    ];

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (

    <div className="entradas-page">

      {/* =====================================
          CABEÇALHO
      ====================================== */}

      <div className="entradas-header">

        <div>

          <h1>
            Entradas
          </h1>

          <p>
            Gerencie as entradas de
            produtos realizadas no estoque.
          </p>

        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >

          <button
            type="button"
            className="btn-secondary"
            onClick={
              abrirNFsExistentes
            }
          >
            Conciliar NF Existente
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={
              abrirNovaEntrada
            }
          >
            Nova Entrada
          </button>

        </div>

      </div>

      {/* =====================================
          TABELA
      ====================================== */}

      <div className="entradas-card">

        <Table
          columns={columns}
          data={entradas}
          actions={actions}
          rowKey="id"
          loading={loadingDados}
        />

      </div>

      {/* =====================================
          NOVA ENTRADA
      ====================================== */}

      <Modal
        isOpen={
          modalNovaEntradaAberto
        }

        onClose={
          fecharNovaEntrada
        }

        onOpenChange={(aberto) => {

          if (!aberto) {
            fecharNovaEntrada();
          }

        }}

        title="Nova Entrada"

        footer={

          <button
            type="button"
            className="btn-secondary"
            onClick={
              fecharNovaEntrada
            }
          >
            Cancelar
          </button>

        }
      >

        <div className="nova-entrada-opcoes">

          <button
            type="button"
            className="entrada-opcao"
            onClick={() => {

              console.log(
                "Abrir entrada sem NF",
              );

            }}
          >

            <div className="entrada-opcao-conteudo">

              <strong>
                Entrada sem NF
              </strong>

              <span>
                Registrar uma entrada de
                produtos sem vincular uma
                nota fiscal.
              </span>

            </div>

          </button>

          <button
            type="button"
            className="entrada-opcao"
            onClick={
              abrirEntradaComNF
            }
          >

            <div className="entrada-opcao-conteudo">

              <strong>
                Entrada com NF
              </strong>

              <span>
                Registrar uma entrada
                vinculada a uma nota fiscal.
              </span>

            </div>

          </button>

        </div>

      </Modal>

      {/* =====================================
          IMPORTAÇÃO NF
      ====================================== */}

      <EntradaComNFModal
        isOpen={
          modalEntradaNFAberto
        }

        onClose={
          fecharEntradaComNF
        }

        onFornecedorNaoEncontrado={
          tratarFornecedorNaoEncontrado
        }

        onImportacaoConcluida={
          handleImportacaoConcluida
        }
      />

      {/* =====================================
          FORNECEDOR
      ====================================== */}

      <FornecedorModal
        isOpen={
          modalFornecedorAberto
        }

        fornecedor={null}

        modo="criar"

        loading={
          loadingFornecedor
        }

        dadosIniciais={{

          razaoSocial:
            fornecedorImportado
              ?.razaoSocial,

          nomeFantasia:
            fornecedorImportado
              ?.nomeFantasia,

          inscricaoEstadual:
            fornecedorImportado
              ?.inscricaoEstadual,

          cnpj:
            fornecedorImportado
              ?.cnpj,

        }}

        onClose={
          fecharFornecedor
        }

        onSave={
          handleSalvarFornecedor
        }

      />

      {/* =====================================
          SUCESSO DA IMPORTAÇÃO
      ====================================== */}

      <Modal
        isOpen={
          modalSucessoImportacao
        }

        onClose={
          fecharSucessoImportacao
        }

        onOpenChange={(aberto) => {

          if (!aberto) {
            fecharSucessoImportacao();
          }

        }}

        title="NF Importada com Sucesso"

        footer={

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >

            <button
              type="button"
              className="btn-secondary"
              onClick={
                fecharSucessoImportacao
              }
            >
              Fechar
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={
                seguirParaConciliacao
              }
            >
              Seguir para Conciliação
            </button>

          </div>

        }
      >

        <div
          style={{
            padding: "10px 0",
          }}
        >

          <h3>
            Nota Fiscal importada com sucesso!
          </h3>

          {notaFiscalImportada && (

            <>

              <p>
                Número da NF:{" "}
                <strong>
                  {
                    notaFiscalImportada.numero
                  }
                </strong>
              </p>

              <p>
                Fornecedor:{" "}
                <strong>
                  {
                    notaFiscalImportada
                      .nomeFantasiaFornecedor
                  }
                </strong>
              </p>

              <p>
                Produtos importados:{" "}
                <strong>
                  {
                    notaFiscalImportada
                      .produtos
                      .length
                  }
                </strong>
              </p>

              <p>
                A NF foi salva com sucesso.
              </p>

              <p>
                Você pode fazer a conciliação
                agora ou posteriormente.
              </p>

            </>

          )}

        </div>

      </Modal>

      {/* =====================================
          NFS EXISTENTES
      ====================================== */}

      <Modal
        isOpen={
          modalNFsAberto
        }

        onClose={() =>
          setModalNFsAberto(false)
        }

        onOpenChange={(aberto) => {

          if (!aberto) {
            setModalNFsAberto(false);
          }

        }}

        title="Notas Fiscais"

        footer={

          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              setModalNFsAberto(false)
            }
          >
            Fechar
          </button>

        }
      >

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >

          {loadingNFs && (

            <p>
              Carregando notas fiscais...
            </p>

          )}

          {!loadingNFs &&
            notasFiscais.length === 0 && (

              <p>
                Nenhuma nota fiscal encontrada.
              </p>

            )}

          {!loadingNFs &&
            notasFiscais.map(
              (nf) => (

                <div
                  key={nf.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "15px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    gap: "15px",
                  }}
                >

                  <div>

                    <strong>
                      NF {nf.numero}
                    </strong>

                    <div>
                      {
                        nf.nomeFantasiaFornecedor ||
                        nf.razaoSocialFornecedor
                      }
                    </div>

                    <small>
                      Criada em{" "}
                      {
                        formatarData(
                          nf.dataCriacao,
                        )
                      }
                    </small>

                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() =>
                      abrirNFParaConciliacao(
                        nf,
                      )
                    }
                    disabled={
                      loadingProdutosNF
                    }
                  >
                    Conciliar
                  </button>

                </div>

              ),
            )}

        </div>

      </Modal>

      {/* =====================================
          CONCILIAÇÃO
      ====================================== */}

      <ConciliacaoProdutosModal
        isOpen={
          modalConciliacaoAberto
        }

        produtosNF={
          notaFiscalParaConciliacao?.produtos ?? []
        }

        produtosPadrao={
          produtosPadrao
        }

        numeroNF={
          notaFiscalParaConciliacao?.numero
        }

        onClose={
          fecharConciliacao
        }

        onConfirmar={
          confirmarConciliacao
        }

        loading={
          loadingProdutosNF
        }
      />

      {/* =====================================
          VISUALIZAÇÃO
      ====================================== */}

      <Modal
        isOpen={
          modalVisualizacaoAberto
        }

        onClose={
          fecharVisualizacao
        }

        onOpenChange={(aberto) => {

          if (!aberto) {
            fecharVisualizacao();
          }

        }}

        title="Visualizar Entrada"

        footer={

          <button
            type="button"
            className="btn-secondary"
            onClick={
              fecharVisualizacao
            }
          >
            Fechar
          </button>

        }
      >

        {entradaSelecionada && (

          <div className="entrada-visualizacao">

            <section className="entrada-section">

              <h3>
                Informações da entrada
              </h3>

              <div className="entrada-info-grid">

                <div className="entrada-info">

                  <span>
                    ID
                  </span>

                  <strong>
                    {
                      entradaSelecionada.id
                    }
                  </strong>

                </div>

                <div className="entrada-info">

                  <span>
                    Tipo de entrada
                  </span>

                  <strong>
                    {
                      entradaSelecionada
                        .nomeTipoEntrada
                    }
                  </strong>

                </div>

                <div className="entrada-info">

                  <span>
                    Data de criação
                  </span>

                  <strong>
                    {
                      formatarData(
                        entradaSelecionada
                          .dataCriacao,
                      )
                    }
                  </strong>

                </div>

                <div className="entrada-info">

                  <span>
                    Última atualização
                  </span>

                  <strong>
                    {
                      formatarData(
                        entradaSelecionada
                          .dataUpdate,
                      )
                    }
                  </strong>

                </div>

              </div>

            </section>

            <section className="entrada-section">

              <h3>
                Nota Fiscal
              </h3>

              <div className="entrada-info-grid">

                <div className="entrada-info">

                  <span>
                    NF
                  </span>

                  <strong>
                    {
                      entradaSelecionada
                        .numeroNF ||
                      "Sem NF"
                    }
                  </strong>

                </div>

                <div className="entrada-info">

                  <span>
                    ID da NF
                  </span>

                  <strong>
                    {
                      entradaSelecionada
                        .nfId ??
                      "-"
                    }
                  </strong>

                </div>

              </div>

            </section>

            <section className="entrada-section">

              <h3>
                Observação
              </h3>

              <div className="entrada-observacao">

                {
                  entradaSelecionada.obs ||
                  "Nenhuma observação informada."
                }

              </div>

            </section>

          </div>

        )}

      </Modal>

    </div>

  );

}