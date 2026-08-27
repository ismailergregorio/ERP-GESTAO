import Layout from "../../Layout/LayoutPages";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Eye, Upload } from "lucide-react";

import HeaderTabela from "../../Componete/HeaderTabela/HeaderTabela";
import Table from "../../Componete/Table/Table";

import type { Column } from "../../Componete/Table/Table.types";

import api from "../../Services/Api";
import covertData from "../../Utils/ConverteDate";

import "./PegeEstoqueEntrada-css.css";
import "./ModelInportNF-css.css";
import ModalEntradaManual from "./ModalEntradaManual";
import ModalViewEntrada from "./ModalVisualizarEntrada";
import type { Entrada, FornecedorNf, TipoEntrada } from "./Interfaces";
import ModalEntradaNfXML from "./ModalEntradaXML/MainEntradaXML";

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
  const [carregandoXml, setCarregandoXml] = useState(false);

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

    setModalNfOpen(false);
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

  const [itenSelecinado, setItenSelecinado] = useState<Entrada | null>(null);
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

        <ModalEntradaNfXML stadoModal={modalNfOpen} onClose={fecharModalNf} />
      </section>
    </Layout>
  );
}
