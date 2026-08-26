import Layout from "../../Layout/LayoutPages";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ClipboardList,
  Eye,
  History,
  HistoryIcon,
  List,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";

import HeaderTabela from "../../Componete/HeaderTabela/HeaderTabela";
import Table from "../../Componete/Table/Table";
import Modal from "../../Componete/Modal/Modal";

import type { Column } from "../../Componete/Table/Table.types";

import api from "../../Services/Api";
import covertData from "../../Utils/ConverteDate";

import "./PegeEstoqueEntrada-css.css";
import "./ModelInportNF-css.css";
import ModalFornecedor from "../PageFornecedor/ModalFornecedor";
import ModalEntradaManual from "./ModalEntradaManual";
import ModalViewEntrada from "./ModalVisualizarEntrada";
import type { Entrada, FornecedorNf, Nf, ProdutoNfe, TipoEntrada } from "./Interfaces";

export default function EntradaEstoque() {
  const base = "entradas";

  const baseFornecedores = "fornecedores";
  const baseTiposEntrada = "tipos-entrada";

  /*
  =====================================================
  MODAIS
  =====================================================
  */

  const [modalManualOpen, setModalManualOpen] = useState(false);
  const [modalNfOpen, setModalNfOpen] = useState(false);

  /*
  =====================================================
  DADOS
  =====================================================
  */

  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [fornecedores, setFornecedores] = useState<FornecedorNf[]>([]);
  const [tiposEntrada, setTiposEntrada] = useState<TipoEntrada[]>([]);
  /*
  =====================================================
  XML
  =====================================================
  */

  const [arquivoXml, setArquivoXml] = useState<File | null>(null);
  const [carregandoXml, setCarregandoXml] = useState(false);
  const [contadorImport, setContadorImport] = useState<number>(1);

  /*
  =====================================================
  ENTRADA REGISTRADA
  =====================================================
  */

  async function getEntradas() {
    try {
      const resposta = await api.get(`/${base}`);

      setEntradas(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao buscar entradas.");
    }
  }

  /*
  =====================================================
  BUSCAR FORNECEDORES
  =====================================================
  */

  async function getFornecedores() {
    try {
      const resposta = await api.get(`/${baseFornecedores}`);

      setFornecedores(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao buscar fornecedores.");
    }
  }

  /*
  =====================================================
  BUSCAR TIPOS DE ENTRADA
  =====================================================
  */

  async function getTiposEntrada() {
    try {
      const resposta = await api.get(`/${baseTiposEntrada}`);

      setTiposEntrada(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao buscar tipos de entrada.",
      );
    }
  }

  /*
  =====================================================
  ABRIR MODAL MANUAL
  =====================================================
  */

  function abrirModalManual() {
    // Garante que o modal da NF esteja fechado
    setModalNfOpen(false);

    // Abre modal manual
    setModalManualOpen(true);
  }

  /*
  =====================================================
  ABRIR MODAL NF
  =====================================================
  */

  function abrirModalNf() {
    // Garante que o modal manual esteja fechado
    setModalManualOpen(false);

    setArquivoXml(null);

    // Abre modal da NF
    setModalNfOpen(true);
  }

  /*
  =====================================================
  FECHAR MODAL NF
  =====================================================
  */

  function fecharModalNf() {
    if (carregandoXml) {
      return;
    }
    setContadorImport(1);
    setModalNfOpen(false);
    setArquivoXml(null);
  }

  /*
  =====================================================
  SELECIONAR XML
  =====================================================
  */

  function selecionarXml(event: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    const ehXml =
      arquivo.type === "text/xml" ||
      arquivo.name.toLowerCase().endsWith(".xml");

    if (!ehXml) {
      toast.error("Selecione um arquivo XML.");

      event.target.value = "";

      return;
    }

    setArquivoXml(arquivo);
  }

  /*
  =====================================================
  IMPORTAR XML
  =====================================================
  */
  const [nfe, setNfe] = useState<Nf | null>();
  async function importarXml() {
    if (!arquivoXml) {
      toast.warning("Selecione um arquivo XML.");
      return;
    }

    try {
      setCarregandoXml(true);

      const formData = new FormData();

      formData.append("arquivo", arquivoXml);

      const resposta = await api.post("/nfe/importar", formData);

      console.log("Resposta da NF-e:", resposta.data);

      const produtos = resposta.data.produto.map(
        (produto: any, index: number) => ({
          ...produto,
          id: index + 1,
        }),
      );

      setNfe({
        ...resposta.data,
        produto: produtos,
      });

      toast.success("NF-e importada com sucesso.");

      setArquivoXml(null);

      setContadorImport(2);
    } catch (e: any) {
      console.error("Erro ao importar XML:", e);

      const mensagem = String(
        e.response?.data?.message ?? e.response?.data ?? e.message ?? "",
      );

      if (mensagem.toLowerCase().includes("fornecedor não cadastrado")) {
        window.alert("Fornecedor não cadastrado");
        return ModalFornecedor;
      }

      toast.error(mensagem || "Erro ao importar NF-e.");
    } finally {
      setCarregandoXml(false);
    }
  }

  /*
  =====================================================
  COLUNAS
  =====================================================
  */

  const colunas: Column<Entrada>[] = [
    {
      key: "id",
      title: "Id",
      width: "70px",
      align: "center",
    },

    {
      key: "notaFiscal",
      title: "Nota Fiscal",
    },

    {
      key: "fornecedor_id",
      title: "Fornecedor",

      render: (value) => {
        const fornecedor = fornecedores.find((item) => item.id === value);

        return fornecedor?.razaoSocial ?? "-";
      },
    },

    {
      key: "tipoEntrada_id",
      title: "Tipo",

      render: (value) => {
        const tipo = tiposEntrada.find((item) => item.id === value);

        return tipo?.nome ?? "-";
      },
    },

    {
      key: "observacao",
      title: "Observação",
    },

    {
      key: "dataCriacao",
      title: "Data Criação",

      render: (value) => {
        return value ? covertData(value) : "-";
      },
    },
  ];

  const colunasNf: Column<ProdutoNfe>[] = [
    {
      key: "id",
      title: "Id",
      align: "center",
    },
    {
      key: "codigo",
      title: "Código",
      align: "center",
    },

    {
      key: "descricao",
      title: "Produto",
    },

    {
      key: "quantidade",
      title: "Qtd.",
      align: "center",
    },

    {
      key: "unidadeComercial",
      title: "Un.",
      align: "center",
    },

    {
      key: "valorUnitario",
      title: "V. Unitário",
      align: "right",

      render: (value) => {
        return Number(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },

    {
      key: "valorTotal",
      title: "V. Total",
      align: "right",

      render: (value) => {
        return Number(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
  ];

  /*
  =====================================================
  EFFECT
  =====================================================
  */

  useEffect(() => {
    getEntradas();
    getFornecedores();
    getTiposEntrada();
  }, []);

  const [itenSelecinado, setItenSelecinado] = useState<Entrada|null>(null);
  const [abrirMadolHistorico, setAbrirMadolHistorico] =
    useState<boolean>(false);
  function visualizarItensModal(entradas: Entrada) {
    setAbrirMadolHistorico(true);
    setItenSelecinado(entradas);
  }

  function fecharvisualizarItensModal() {
    setAbrirMadolHistorico(false);
    setItenSelecinado(null);
  }

  /*
  =====================================================
  RETURN
  =====================================================
  */

  return (
    <Layout title="Entrada de Estoque">
      <section>
        {/* =================================================
            TABELA PRINCIPAL
        ================================================= */}

        <HeaderTabela
          title="Entradas"
          onClick={abrirModalManual}
          butonsPlus={
            <button
              type="button"
              className="butto-header-table"
              onClick={abrirModalNf}
            >
              <Upload size={18} />
              Importar NF
            </button>
          }
        >
          <Table columns={colunas} data={entradas}>
            {(entradas) => (
              <>
                {/* EDITAR */}

                <button
                  type="button"
                  title="Editar"
                  className="action-button"
                  onClick={() => visualizarItensModal(entradas)}
                >
                  <Eye size={18} />
                </button>
              </>
            )}
          </Table>
        </HeaderTabela>

        {/* =================================================
            MODAL ENTRADA MANUAL
        ================================================= */}

        <ModalEntradaManual
          stadoModal={modalManualOpen}
          onClose={() => setModalManualOpen(false)}
        />

        <ModalViewEntrada
          stadoModal={abrirMadolHistorico}
          onClose={() => fecharvisualizarItensModal()}
          entrada={itenSelecinado}
        />

        {/* =================================================
            MODAL IMPORTAR NF
        ================================================= */}

        <Modal
          open={modalNfOpen}
          title="Importar Nota Fiscal"
          onClose={fecharModalNf}
          tamanho="max"
        >
          {contadorImport == 1 && (
            <div className="form-modal">
              <div className="form-group">
                <div>
                  <label htmlFor="xml">Arquivo XML da NF-e</label>

                  <input
                    id="xml"
                    type="file"
                    accept=".xml,text/xml"
                    onChange={selecionarXml}
                    disabled={carregandoXml}
                  />
                </div>

                {arquivoXml && (
                  <div className="xml-preview">
                    <Upload size={20} />

                    <div>
                      <strong>Arquivo selecionado</strong>

                      <span>{arquivoXml.name}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={fecharModalNf}
                  disabled={carregandoXml}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={importarXml}
                  disabled={!arquivoXml || carregandoXml}
                >
                  {carregandoXml ? "Enviando..." : "Importar XML"}
                </button>
              </div>
            </div>
          )}
          {contadorImport === 2 && nfe && (
            <div className="nf-confirmacao">
              {/* =========================================
        FORNECEDOR
    ========================================= */}

              <div className="nf-info">
                <div className="nf-section-title">
                  <h3>Fornecedor</h3>
                </div>

                <div className="nf-info-grid">
                  <div className="nf-info-item">
                    <span>Razão Social</span>
                    <strong>{nfe.fornecedor?.razaoSocial ?? "-"}</strong>
                  </div>

                  <div className="nf-info-item">
                    <span>Nome Fantasia</span>
                    <strong>{nfe.fornecedor?.nomeFantasia ?? "-"}</strong>
                  </div>

                  <div className="nf-info-item">
                    <span>CNPJ</span>
                    <strong>{nfe.fornecedor?.cnpj ?? "-"}</strong>
                  </div>

                  <div className="nf-info-item">
                    <span>Inscrição Estadual</span>
                    <strong>{nfe.fornecedor?.inscricaoEstadual ?? "-"}</strong>
                  </div>

                  <div className="nf-info-item">
                    <span>CRT</span>
                    <strong>{nfe.fornecedor?.crt ?? "-"}</strong>
                  </div>
                </div>
              </div>

              {/* =========================================
        PRODUTOS
    ========================================= */}

              <div className="nf-produtos">
                <div className="nf-section-title">
                  <h3>Produtos da Nota</h3>

                  <span>{nfe.produto?.length ?? 0} produto(s)</span>
                </div>

                <Table<ProdutoNfe>
                  columns={colunasNf}
                  data={nfe.produto ?? []}
                />
              </div>

              {/* =========================================
        TOTAL
    ========================================= */}

              <div className="nf-total">
                <span>Total dos Produtos</span>

                <strong>
                  {nfe.produto
                    ?.reduce(
                      (total, produto) =>
                        total + Number(produto.valorTotal ?? 0),
                      0,
                    )
                    .toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                </strong>
              </div>

              {/* =========================================
        AÇÕES
    ========================================= */}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setNfe(null);
                    setArquivoXml(null);
                    setContadorImport(1);
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setContadorImport(3);
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}
        </Modal>
      </section>
    </Layout>
  );
}
