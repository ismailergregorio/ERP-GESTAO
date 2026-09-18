import { useRef, useState } from "react";

import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";

import type { TableColumn } from "../../components/Table/Table";

import "./Entradas.css";
import "./InportacaoNf.css";
import "./ModalPrevilNF.css";
import "./ModalRelacionamento.css";

import { importarXMLNotaFiscal } from "../../services/importacaoNFService";

import FornecedorModal from "../../components/FornecedorModal/FornecedorModal";

import {
  criarFornecedor,
  listarFornecedores,
} from "../../services/fornecedorService";

import type { FornecedorRequest } from "../../types/Fornecedor";

import { toast } from "react-toastify";

import type {
  NotaFiscalImportada,
  ProdutoImportadoNF,
} from "../../types/ImportacaoNF";

import { criarNotaFiscalCompleta } from "../../services/notaFiscalCompletaServices";

import type {
  NotaFiscalCompletaRequest,
  ProdutoNFCompletaRequest,
} from "../../types/NotaFiscalCompleta";

import RelacionarProdutosModal from "../../components/Sidebar/RelacionarProdutosModal/RelacionarProdutosModal";

import type { Produto } from "../../types/Produto";

import { listarProdutos } from "../../services/produtoService";

import type { ProdutosRelacionado } from "../../types/ProdutosRelacionado";

export default function Entradas() {
  // =========================================================
  // MODAL - SELECIONAR TIPO DE ENTRADA
  // =========================================================

  const [openModalSelecionarTipoEntrada, setOpenModalSelecionarTipoEntrada] =
    useState<boolean>(false);

  function abriModalTipoEntrada() {
    setOpenModalSelecionarTipoEntrada(true);
  }

  function fecharModalTipoEntrada() {
    setOpenModalSelecionarTipoEntrada(false);
  }

  // =========================================================
  // MODAL - IMPORTAÇÃO DA NF
  // =========================================================

  const [openModalInportacaoNf, setOpenModalInportacaoNf] =
    useState<boolean>(false);

  function abriModalInportacaoNf() {
    setOpenModalInportacaoNf(true);
    fecharModalTipoEntrada();
  }

  function fecharModalInportacaoNf() {
    setArquivoNF(null);
    setOpenModalInportacaoNf(false);
  }

  // =========================================================
  // ARQUIVO XML
  // =========================================================

  const [arquivoNF, setArquivoNF] = useState<File | null>(null);

  const inputArquivoRef = useRef<HTMLInputElement>(null);

  const handleArquivoSelecionado = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    if (!arquivo.name.toLowerCase().endsWith(".xml")) {
      toast.error("Selecione um arquivo XML.");

      event.target.value = "";

      return;
    }

    setArquivoNF(arquivo);
  };

  // =========================================================
  // DADOS DO FORNECEDOR
  // =========================================================

  const [fornecedor, setFornecedor] = useState<FornecedorRequest | null>(null);

  // =========================================================
  // DADOS DA NF IMPORTADA
  // =========================================================

  const [dadosNF, setDadosNF] = useState<NotaFiscalImportada | null>(null);

  // =========================================================
  // IMPORTAR NF
  // =========================================================

  async function impotortarNf(arquivo: File | null) {
    if (!arquivo) {
      toast.error("Selecione um arquivo XML.");

      return;
    }

    try {
      const dados = await importarXMLNotaFiscal(arquivo);

      // =====================================================
      // FORNECEDOR NÃO CADASTRADO
      // =====================================================

      if ("erro" in dados) {
        const confirmar = window.confirm(
          "Fornecedor não cadastrado. Deseja cadastrar?",
        );

        if (!confirmar) {
          toast.error(dados.erro);

          return;
        }

        setFornecedor({
          razaoSocial: dados.dados.fornecedor.razaoSocial,

          nomeFantasia: dados.dados.fornecedor.nomeFantasia,

          inscricaoEstadual: dados.dados.fornecedor.inscricaoEstadual,

          cnpj: dados.dados.fornecedor.cnpj,

          telefone: "",

          email: "",
        });

        fecharModalInportacaoNf();

        openModalCadastroDeFornecedor();

        return;
      }

      // =====================================================
      // NF IMPORTADA COM SUCESSO
      // =====================================================

      setDadosNF(dados.dados);

      toast.success(`NF importada: ${dados.dados.numero}`);

      openModalConfimacaoInportacao();
    } catch (error) {
      console.error("Erro ao importar NF:", error);

      toast.error("Erro ao importar a Nota Fiscal.");
    }
  }

  // =========================================================
  // MODAL - CADASTRO DE FORNECEDOR
  // =========================================================

  const [abrirModalCadastroDeFornecedor, setAbrirModalCadastroDeFornecedor] =
    useState(false);

  function openModalCadastroDeFornecedor() {
    setAbrirModalCadastroDeFornecedor(true);
  }

  function fecharModalCadastroDeFornecedor() {
    setAbrirModalCadastroDeFornecedor(false);
  }

  const [loadingFornecedor, setLoadingFornecedor] = useState(false);

  // =========================================================
  // SALVAR FORNECEDOR
  // =========================================================

  async function salvarFornecedor(dados: {
    razaoSocial: string;
    nomeFantasia: string;
    inscricaoEstadual: string;
    cnpj: string;
    telefone: string;
    email: string;
  }) {
    try {
      setLoadingFornecedor(true);

      const fornecedorCriado = await criarFornecedor({
        razaoSocial: dados.razaoSocial,

        nomeFantasia: dados.nomeFantasia,

        inscricaoEstadual: dados.inscricaoEstadual,

        cnpj: dados.cnpj,

        telefone: dados.telefone,

        email: dados.email,
      });

      console.log("Fornecedor criado:", fornecedorCriado);

      toast.success("Fornecedor cadastrado com sucesso!");

      fecharModalCadastroDeFornecedor();
    } catch (error: any) {
      console.error("Erro ao criar fornecedor:", error);

      toast.error(error.response?.data?.message || "Erro ao criar fornecedor.");
    } finally {
      setLoadingFornecedor(false);
    }
  }

  // =========================================================
  // MODAL - CONFIRMAÇÃO DA IMPORTAÇÃO
  // =========================================================

  const [modalConfimacaoInportacao, setModalConfimacaoInportacao] =
    useState(false);

  function openModalConfimacaoInportacao() {
    setOpenModalInportacaoNf(false);

    setModalConfimacaoInportacao(true);
  }

  function fecharModalConfimacaoInportacao() {
    setArquivoNF(null);

    setDadosNF(null);

    setModalConfimacaoInportacao(false);
  }

  // =========================================================
  // COLUNAS - PRODUTOS DA NF
  // =========================================================

  const colunasProdutosNF: TableColumn<ProdutoImportadoNF>[] = [
    {
      key: "codigo",

      label: "Código",

      width: "100px",
    },

    {
      key: "descricao",

      label: "Descrição",
    },

    {
      key: "unidade",

      label: "UN",

      width: "70px",

      align: "center",
    },

    {
      key: "quantidade",

      label: "Quantidade",

      width: "110px",

      align: "right",

      render: (value) =>
        Number(value).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 3,
        }),
    },

    {
      key: "valorUnitario",

      label: "Valor Unit.",

      width: "120px",

      align: "right",

      render: (value) =>
        Number(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
    },

    {
      key: "valorTotal",

      label: "Valor Total",

      width: "120px",

      align: "right",

      render: (value) =>
        Number(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
    },
  ];

  // =========================================================
  // PRODUTOS RELACIONADOS
  // =========================================================

  const [listaProdutosRelacionados, setListaProdutosRelacionados] = useState<
    ProdutosRelacionado[]
  >([]);

  // =========================================================
  // CADASTRAR NF
  // =========================================================

  async function cadastraNF(dadosNf: NotaFiscalImportada) {
    try {
      // =====================================================
      // 1. BUSCAR FORNECEDORES
      // =====================================================

      const fornecedores = await listarFornecedores();

      // =====================================================
      // 2. LOCALIZAR FORNECEDOR PELO CNPJ
      // =====================================================

      const cnpjNF = dadosNf.fornecedor.cnpj.replace(/\D/g, "");

      const fornecedorEncontrado = fornecedores.find(
        (fornecedor) => fornecedor.cnpj.replace(/\D/g, "") === cnpjNF,
      );

      if (!fornecedorEncontrado) {
        toast.error(
          `Fornecedor não encontrado para o CNPJ ${dadosNf.fornecedor.cnpj}`,
        );

        return;
      }

      // =====================================================
      // 3. MONTAR PRODUTOS
      // =====================================================

      const produtos: ProdutoNFCompletaRequest[] = dadosNf.produtos.map(
        (produto: ProdutoImportadoNF) => ({
          codigo: produto.codigo,

          descricao: produto.descricao,

          unidade: produto.unidade,

          quantidade: produto.quantidade,

          valorUnitario: produto.valorUnitario,

          valorTotal: produto.valorTotal,
        }),
      );

      // =====================================================
      // 4. MONTAR NF
      // =====================================================

      const dados: NotaFiscalCompletaRequest = {
        numero: dadosNf.numero,

        fornecedorId: fornecedorEncontrado.id,

        chaveAcesso: dadosNf.chaveAcesso,

        produtos,
      };

      console.log("Dados enviados para NF:", dados);

      // =====================================================
      // 5. CADASTRAR NF
      // =====================================================

      const resp = await criarNotaFiscalCompleta(dados);

      console.log("NF cadastrada:", resp);

      // =====================================================
      // 6. CRIAR LISTA PARA RELACIONAMENTO
      // =====================================================

      const lista: ProdutosRelacionado[] = resp.produtos.map((p) => ({
        id: p.id,

        codigo: p.codigo,

        descricao: p.descricao,

        quantidade: p.quantidade,

        unidade: p.unidade,

        produtoSistemaId: null,

        tipoCalculo: "MULTIPLICAR",

        fatorCalculo: 1,

        quantidadeCalculada: p.quantidade,

        possuiValidade: false,

        dataValidade: null,
      }));

      setListaProdutosRelacionados(lista);

      toast.success(`Nota fiscal ${dadosNf.numero} cadastrada com sucesso!`);

      // =====================================================
      // 7. FECHAR MODAL DE CONFIRMAÇÃO
      // =====================================================

      fecharModalConfimacaoInportacao();

      // =====================================================
      // 8. ABRIR MODAL SIM/NÃO
      // =====================================================

      abrirModalRelacionarProdutos();

      return resp;
    } catch (error: any) {
      console.error("Erro ao cadastrar NF:", error);

      toast.error(
        error.response?.data?.message || "Erro ao cadastrar a nota fiscal.",
      );
    }
  }

  // =========================================================
  // MODAL - PERGUNTAR SE DESEJA RELACIONAR
  // =========================================================

  const [openModalRelacionarProdutos, setOpenModalRelacionarProdutos] =
    useState(false);

  function abrirModalRelacionarProdutos() {
    setOpenModalRelacionarProdutos(true);
  }

  function fecharModalRelacionarProdutos() {
    setOpenModalRelacionarProdutos(false);
  }

  // =========================================================
  // MODAL - RELACIONAMENTO
  // =========================================================

  const [openModalRelacionaMento, setOpenModalRelacionaMento] =
    useState<boolean>(false);

  function abrirModalRelacionaMento() {
    setOpenModalRelacionaMento(true);
  }

  function fecharModalRelacionaMento() {
    setOpenModalRelacionaMento(false);
  }

  // =========================================================
  // PRODUTOS DO SISTEMA
  // =========================================================

  const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);

  const [loadingProdutos, setLoadingProdutos] = useState(false);

  async function buscarListaProdutos() {
    try {
      setLoadingProdutos(true);

      const resp = await listarProdutos();

      setListaProdutos(resp);
    } catch (error: any) {
      console.error("Erro ao buscar produtos:", error);

      toast.error(error.response?.data?.message || "Erro ao buscar produtos.");
    } finally {
      setLoadingProdutos(false);
    }
  }

  // =========================================================
  // SIM - RELACIONAR PRODUTOS
  // =========================================================

  async function confirmarRelacionamentoProdutos() {
    fecharModalRelacionarProdutos();

    await buscarListaProdutos();

    abrirModalRelacionaMento();
  }

  // =========================================================
  // NÃO - NÃO RELACIONAR
  // =========================================================

  function naoRelacionarProdutos() {
    fecharModalRelacionarProdutos();

    console.log("Usuário escolheu não relacionar os produtos.");

    // Aqui você poderá continuar
    // o processo da entrada.
  }

  // =========================================================
  // ALTERAR PRODUTO DO SISTEMA
  // =========================================================

  function alterarProdutoSistema(id: number, produtoSistemaId: number | null) {
    setListaProdutosRelacionados((produtos) =>
      produtos.map((produto) =>
        produto.id === id
          ? {
              ...produto,
              produtoSistemaId,
            }
          : produto,
      ),
    );
  }

  // =========================================================
  // ALTERAR TIPO DE CÁLCULO
  // =========================================================

  function alterarTipoCalculo(
    id: number,
    tipoCalculo: "MULTIPLICAR" | "DIVIDIR",
  ) {
    setListaProdutosRelacionados((produtos) =>
      produtos.map((produto) => {
        if (produto.id !== id) {
          return produto;
        }

        const fator = produto.fatorCalculo || 1;

        const quantidadeCalculada =
          tipoCalculo === "MULTIPLICAR"
            ? produto.quantidade * fator
            : produto.quantidade / fator;

        return {
          ...produto,

          tipoCalculo,

          quantidadeCalculada,
        };
      }),
    );
  }

  // =========================================================
  // ALTERAR FATOR
  // =========================================================

  function alterarFatorCalculo(id: number, fatorCalculo: number) {
    setListaProdutosRelacionados((produtos) =>
      produtos.map((produto) => {
        if (produto.id !== id) {
          return produto;
        }

        const fator = fatorCalculo || 1;

        const quantidadeCalculada =
          produto.tipoCalculo === "MULTIPLICAR"
            ? produto.quantidade * fator
            : produto.quantidade / fator;

        return {
          ...produto,

          fatorCalculo,

          quantidadeCalculada,
        };
      }),
    );
  }

  // =========================================================
  // ALTERAR VALIDADE
  // =========================================================

  function alterarValidade(id: number, possuiValidade: boolean) {
    setListaProdutosRelacionados((produtos) =>
      produtos.map((produto) =>
        produto.id === id
          ? {
              ...produto,

              possuiValidade,

              dataValidade: possuiValidade ? "" : null,
            }
          : produto,
      ),
    );
  }

  // =========================================================
  // ALTERAR DATA DE VALIDADE
  // =========================================================

  function alterarDataValidade(id: number, dataValidade: string) {
    setListaProdutosRelacionados((produtos) =>
      produtos.map((produto) =>
        produto.id === id
          ? {
              ...produto,
              dataValidade,
            }
          : produto,
      ),
    );
  }

  // =========================================================
  // COLUNAS - RELACIONAMENTO
  // =========================================================

  const colunasRelacionamento: TableColumn<ProdutosRelacionado>[] = [
    // -------------------------------------------------------
    // CÓDIGO
    // -------------------------------------------------------

    {
      key: "codigo",

      label: "Cód. Produto",

      width: "110px",
    },

    // -------------------------------------------------------
    // DESCRIÇÃO
    // -------------------------------------------------------

    {
      key: "descricao",

      label: "Descrição do Produto da NF",

      width: "250px",
    },

    // -------------------------------------------------------
    // QUANTIDADE
    // -------------------------------------------------------

    {
      key: "quantidade",

      label: "Quantidade",

      width: "110px",

      align: "right",

      render: (value) =>
        Number(value).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 3,
        }),
    },

    // -------------------------------------------------------
    // UNIDADE
    // -------------------------------------------------------

    {
      key: "unidade",

      label: "Unidade da NF",

      width: "100px",

      align: "center",
    },

    // -------------------------------------------------------
    // PRODUTO DO SISTEMA
    // -------------------------------------------------------

    {
      key: "produtoSistemaId",

      label: "Produto do Sistema",

      width: "220px",

      render: (_, row) => (
        <select
          className="campo-tabela select-produto"
          value={row.produtoSistemaId ?? ""}
          onChange={(event) => {
            const valor = event.target.value;

            alterarProdutoSistema(
              row.id,

              valor ? Number(valor) : null,
            );
          }}
        >
          <option value="">Selecionar produto</option>

          {listaProdutos.map((produto) => (
            <option key={produto.id} value={produto.id}>
              {produto.nome}
            </option>
          ))}
        </select>
      ),
    },

    // -------------------------------------------------------
    // CÁLCULO
    // -------------------------------------------------------

    {
      key: "tipoCalculo",

      label: "Cálculo",

      width: "130px",

      render: (_, row) => (
        <select
          className="campo-tabela select-calculo"
          value={row.tipoCalculo}
          onChange={(event) => {
            alterarTipoCalculo(
              row.id,

              event.target.value as "MULTIPLICAR" | "DIVIDIR",
            );
          }}
        >
          <option value="MULTIPLICAR">Multiplicar</option>

          <option value="DIVIDIR">Dividir</option>
        </select>
      ),
    },

    // -------------------------------------------------------
    // FATOR
    // -------------------------------------------------------

    {
      key: "fatorCalculo",

      label: "Fator",

      width: "90px",

      align: "right",

      render: (_, row) => (
        <input
          type="number"
          className="campo-tabela input-fator"
          min="1"
          step="1"
          value={row.fatorCalculo}
          onChange={(event) => {
            alterarFatorCalculo(
              row.id,

              Number(event.target.value),
            );
          }}
        />
      ),
    },

    // -------------------------------------------------------
    // QUANTIDADE CALCULADA
    // -------------------------------------------------------

    {
      key: "quantidadeCalculada",

      label: "Quantidade Calculada",

      width: "150px",

      align: "right",

      render: (value) => (
        <span className="quantidade-calculada">
          {Number(value).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 3,
          })}
        </span>
      ),
    },

    // -------------------------------------------------------
    // VALIDADE
    // -------------------------------------------------------

    {
      key: "possuiValidade",

      label: "Possui Validade",

      width: "120px",

      align: "center",

      render: (_, row) => (
        <select
          className="campo-tabela select-validade"
          value={row.possuiValidade ? "SIM" : "NAO"}
          onChange={(event) => {
            alterarValidade(
              row.id,

              event.target.value === "SIM",
            );
          }}
        >
          <option value="NAO">Não</option>

          <option value="SIM">Sim</option>
        </select>
      ),
    },

    // -------------------------------------------------------
    // DATA DE VALIDADE
    // -------------------------------------------------------

    {
      key: "dataValidade",

      label: "Data de Validade",

      width: "150px",

      render: (_, row) => (
        <input
          type="date"
          className="campo-tabela input-validade"
          value={row.dataValidade ?? ""}
          disabled={!row.possuiValidade}
          onChange={(event) => {
            alterarDataValidade(
              row.id,

              event.target.value,
            );
          }}
        />
      ),
    },
  ];

  // =========================================================
  // FINALIZAR RELACIONAMENTO
  // =========================================================

  function finalizarRelacionamento() {
    console.log("Produtos relacionados:", listaProdutosRelacionados);

    // Aqui posteriormente
    // você enviará os relacionamentos
    // para o backend.

    fecharModalRelacionaMento();
  }

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="entradas-page">
      {/* =====================================================
          CABEÇALHO
      ====================================================== */}

      <div className="page-header">
        <div>
          <h1>Entradas</h1>

          <p>Controle de entradas de produtos</p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={abriModalTipoEntrada}
        >
          + Nova Entrada
        </button>
      </div>

      {/* =====================================================
          TABELA PRINCIPAL
      ====================================================== */}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>

              <th>Tipo de Entrada</th>

              <th>NF</th>

              <th>Observação</th>

              <th>Data</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td
                colSpan={5}
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                Nenhuma entrada carregada.
              </td>
            </tr>
          </tbody>
        </table>

        {/* ===================================================
            MODAL - TIPOS DE ENTRADA
        ==================================================== */}

        <Modal
          isOpen={openModalSelecionarTipoEntrada}
          onClose={fecharModalTipoEntrada}
          title="Tipos De Entrada"
        >
          <div className="tipo-entrada-selection">
            <div className="tipo-entrada-header">
              <h3>Selecione o tipo de entrada</h3>

              <p>Escolha como deseja realizar o registro da entrada.</p>
            </div>

            <div className="tipo-entrada-options">
              {/* ENTRADA COM NF */}

              <div className="tipo-entrada-card">
                <div className="tipo-entrada-icon">
                  <span>NF</span>
                </div>

                <div className="tipo-entrada-info">
                  <h4>Entrada com NF</h4>

                  <p>Registre uma entrada vinculada a uma Nota Fiscal.</p>
                </div>

                <button
                  type="button"
                  className="tipo-entrada-button"
                  onClick={abriModalInportacaoNf}
                >
                  Selecionar
                </button>
              </div>

              {/* ENTRADA SEM NF */}

              <div className="tipo-entrada-card">
                <div className="tipo-entrada-icon tipo-entrada-icon-sem-nf">
                  <span>↗</span>
                </div>

                <div className="tipo-entrada-info">
                  <h4>Entrada sem NF</h4>

                  <p>Registre uma entrada sem vínculo com uma Nota Fiscal.</p>
                </div>

                <button type="button" className="tipo-entrada-button">
                  Selecionar
                </button>
              </div>
            </div>
          </div>
        </Modal>

        {/* ===================================================
            MODAL - IMPORTAR NF
        ==================================================== */}

        <Modal
          isOpen={openModalInportacaoNf}
          onClose={fecharModalInportacaoNf}
          title="Importar NF"
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={fecharModalInportacaoNf}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={!arquivoNF}
                onClick={() => impotortarNf(arquivoNF)}
              >
                Visualizar Nota
              </button>
            </>
          }
        >
          <div className="importacao-nf">
            <div className="importacao-nf-header">
              <h3>Importar Nota Fiscal</h3>

              <p>
                Selecione o arquivo XML da Nota Fiscal para realizar a
                importação.
              </p>
            </div>

            <div className="upload-nf">
              <div className="upload-nf-icon">
                <span>XML</span>
              </div>

              <div className="upload-nf-content">
                <h4>Arquivo XML da Nota Fiscal</h4>

                <p>Selecione o arquivo XML da Nota Fiscal.</p>

                <input
                  ref={inputArquivoRef}
                  type="file"
                  accept=".xml,text/xml"
                  onChange={handleArquivoSelecionado}
                />

                <span className="upload-nf-format">Formato aceito: .xml</span>
              </div>
            </div>

            {/* ARQUIVO */}

            {arquivoNF && (
              <div className="arquivo-nf-selecionado">
                <div className="arquivo-nf-icon">XML</div>

                <div className="arquivo-nf-info">
                  <strong>{arquivoNF.name}</strong>

                  <span>{(arquivoNF.size / 1024).toFixed(2)} KB</span>
                </div>

                <button
                  type="button"
                  className="arquivo-nf-remover"
                  onClick={() => setArquivoNF(null)}
                >
                  Remover
                </button>
              </div>
            )}
          </div>
        </Modal>

        {/* ===================================================
            MODAL - CADASTRO FORNECEDOR
        ==================================================== */}

        <FornecedorModal
          isOpen={abrirModalCadastroDeFornecedor}
          fornecedor={null}
          modo="criar"
          dadosIniciais={{
            razaoSocial: fornecedor?.razaoSocial,

            nomeFantasia: fornecedor?.nomeFantasia,

            inscricaoEstadual: fornecedor?.inscricaoEstadual,

            cnpj: fornecedor?.cnpj,
          }}
          loading={loadingFornecedor}
          onClose={fecharModalCadastroDeFornecedor}
          onSave={salvarFornecedor}
        />

        {/* ===================================================
            MODAL - PREVISUALIZAÇÃO DA NF
        ==================================================== */}

        <Modal
          isOpen={modalConfimacaoInportacao}
          onClose={fecharModalConfimacaoInportacao}
          width="100%"
          title={`Nota Fiscal - ${
            dadosNF?.fornecedor?.nomeFantasia ||
            dadosNF?.fornecedor?.razaoSocial ||
            "Fornecedor"
          } - Nº ${dadosNF?.numero || "-"}`}
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={fecharModalConfimacaoInportacao}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  if (!dadosNF) {
                    toast.error("Nenhuma nota fiscal foi carregada.");

                    return;
                  }

                  await cadastraNF(dadosNF);
                }}
              >
                Confirmar Importação
              </button>
            </>
          }
        >
          <div className="preview-nf">
            {/* DADOS DA NOTA */}

            <section className="preview-nf-section">
              <div className="preview-nf-section-header">
                <h3>Dados da Nota Fiscal</h3>
              </div>

              <div className="preview-nf-grid">
                <div className="preview-nf-field">
                  <span>Número da NF</span>

                  <strong>{dadosNF?.numero || "-"}</strong>
                </div>

                <div className="preview-nf-field">
                  <span>Série</span>

                  <strong>{dadosNF?.serie || "-"}</strong>
                </div>

                <div className="preview-nf-field">
                  <span>Data de Emissão</span>

                  <strong>
                    {dadosNF?.dataEmissao
                      ? new Date(dadosNF.dataEmissao).toLocaleDateString(
                          "pt-BR",
                        )
                      : "-"}
                  </strong>
                </div>

                <div className="preview-nf-field">
                  <span>Valor Total</span>

                  <strong>
                    {dadosNF?.valorTotal != null
                      ? dadosNF.valorTotal.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "-"}
                  </strong>
                </div>

                <div className="preview-nf-field preview-nf-field-full">
                  <span>Chave de Acesso</span>

                  <strong className="chave-acesso">
                    {dadosNF?.chaveAcesso || "-"}
                  </strong>
                </div>
              </div>
            </section>

            {/* FORNECEDOR */}

            <section className="preview-nf-section">
              <div className="preview-nf-section-header">
                <h3>Fornecedor</h3>
              </div>

              <div className="preview-nf-grid">
                <div className="preview-nf-field preview-nf-field-full">
                  <span>Razão Social</span>

                  <strong>{dadosNF?.fornecedor?.razaoSocial || "-"}</strong>
                </div>

                <div className="preview-nf-field">
                  <span>Nome Fantasia</span>

                  <strong>{dadosNF?.fornecedor?.nomeFantasia || "-"}</strong>
                </div>

                <div className="preview-nf-field">
                  <span>CNPJ</span>

                  <strong>{dadosNF?.fornecedor?.cnpj || "-"}</strong>
                </div>

                <div className="preview-nf-field">
                  <span>Inscrição Estadual</span>

                  <strong>
                    {dadosNF?.fornecedor?.inscricaoEstadual || "-"}
                  </strong>
                </div>

                <div className="preview-nf-field">
                  <span>Município</span>

                  <strong>{dadosNF?.fornecedor?.municipio || "-"}</strong>
                </div>

                <div className="preview-nf-field">
                  <span>UF</span>

                  <strong>{dadosNF?.fornecedor?.uf || "-"}</strong>
                </div>
              </div>
            </section>

            {/* PRODUTOS */}

            <section className="preview-nf-section">
              <div className="preview-nf-section-header">
                <h3>
                  Produtos
                  <span className="preview-nf-count">
                    {dadosNF?.produtos?.length || 0}
                  </span>
                </h3>
              </div>

              <div className="preview-nf-produtos">
                <Table
                  columns={colunasProdutosNF}
                  data={dadosNF?.produtos || []}
                  loading={false}
                />
              </div>
            </section>
          </div>
        </Modal>

        {/* ===================================================
            MODAL - PERGUNTA RELACIONAMENTO
        ==================================================== */}

        <RelacionarProdutosModal
          isOpen={openModalRelacionarProdutos}
          onClose={fecharModalRelacionarProdutos}
          onSim={confirmarRelacionamentoProdutos}
          onNao={naoRelacionarProdutos}
          title="Relacionamento de Produtos"
          subtitulo="Deseja realizar o relacionamento dos produtos desta Nota?"
          descriacao="O relacionamento permite associar os produtos da NF aos produtos cadastrados no sistema."
        />

        {/* ===================================================
            MODAL - RELACIONAMENTO DOS PRODUTOS
        ==================================================== */}

        <Modal
          isOpen={openModalRelacionaMento}
          onClose={fecharModalRelacionaMento}
          title="Relacionamento de Produtos"
          width="1400px"
          footer={
            <div className="relacionamento-footer">
              <button
                type="button"
                className="btn-relacionamento btn-cancelar"
                onClick={fecharModalRelacionaMento}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-relacionamento btn-finalizar"
                onClick={finalizarRelacionamento}
              >
                Finalizar
              </button>
            </div>
          }
        >
          <div className="relacionamento-container">
            {/* DADOS DA NF */}

            <div className="dados-nota">
              <div className="campo-nota">
                <label>Número da NF</label>

                <span>{dadosNF?.numero || "-"}</span>
              </div>

              <div className="campo-nota">
                <label>Fornecedor</label>

                <span>
                  {dadosNF?.fornecedor?.nomeFantasia ||
                    dadosNF?.fornecedor?.razaoSocial ||
                    "-"}
                </span>
              </div>

              <div className="campo-nota">
                <label>Chave de Acesso</label>

                <span>{dadosNF?.chaveAcesso || "-"}</span>
              </div>
            </div>

            {/* TÍTULO */}

            <div className="relacionamento-header">
              <div>
                <h3>Produtos da Nota Fiscal</h3>

                <p>
                  Relacione os produtos da nota fiscal com os produtos
                  cadastrados no sistema.
                </p>
              </div>
            </div>

            {/* TABLE */}

            <div className="relacionamento-tabela">
              <Table
                columns={colunasRelacionamento}
                data={listaProdutosRelacionados}
                rowKey="id"
                loading={loadingProdutos}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
