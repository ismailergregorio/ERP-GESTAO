import { useEffect, useState } from "react";

import Table from "../../components/Table/Table";

import NotaFiscalModal from "../../components/NotaFiscalModal/NotaFiscalModal";

import type { TableColumn, TableAction } from "../../components/Table/Table";

import type { NotaFiscal } from "../../types/NotaFiscal";

import type { Fornecedor } from "../../types/Fornecedor";

import {
  listarNotasFiscais,
  buscarNotaFiscalPorId,
  criarNotaFiscal,
  atualizarNotaFiscal,
  excluirNotaFiscal as excluirNotaFiscalApi,
} from "../../services/notaFiscalService";

import { listarFornecedores } from "../../services/fornecedorService";

import "./NotasFiscais.css";

export default function NotasFiscais() {
  /*
   * =====================================================
   * ESTADOS
   * =====================================================
   */

  const [notasFiscais, setNotasFiscais] = useState<NotaFiscal[]>([]);

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  const [loading, setLoading] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);

  const [notaFiscalSelecionada, setNotaFiscalSelecionada] =
    useState<NotaFiscal | null>(null);

  const [modoModal, setModoModal] = useState<"criar" | "editar" | "visualizar">(
    "criar",
  );

  /*
   * =====================================================
   * CARREGAR DADOS
   * =====================================================
   */

  const carregarDados = async () => {
    try {
      setLoading(true);

      const [notas, fornecedoresData] = await Promise.all([
        listarNotasFiscais(),

        listarFornecedores(),
      ]);

      setNotasFiscais(notas);

      /*
       * Somente fornecedores ativos
       */

      setFornecedores(
        fornecedoresData.filter((fornecedor) => fornecedor.ativo),
      );
    } catch (error) {
      console.error("Erro ao carregar dados:", error);

      alert("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * CARREGAR AO ABRIR
   * =====================================================
   */

  useEffect(() => {
    carregarDados();
  }, []);

  /*
   * =====================================================
   * NOVA NF
   * =====================================================
   */

  const abrirNovaNota = () => {
    setNotaFiscalSelecionada(null);

    setModoModal("criar");

    setModalAberto(true);
  };

  /*
   * =====================================================
   * VISUALIZAR
   * =====================================================
   */

  const visualizarNota = async (nota: NotaFiscal) => {
    try {
      setLoading(true);

      const dados = await buscarNotaFiscalPorId(nota.id);

      setNotaFiscalSelecionada(dados);

      setModoModal("visualizar");

      setModalAberto(true);
    } catch (error) {
      console.error("Erro ao buscar NF:", error);

      alert("Não foi possível carregar a nota fiscal.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * EDITAR
   * =====================================================
   */

  const editarNota = (nota: NotaFiscal) => {
    setNotaFiscalSelecionada(nota);

    setModoModal("editar");

    setModalAberto(true);
  };

  /*
   * =====================================================
   * FECHAR MODAL
   * =====================================================
   */

  const fecharModal = () => {
    setModalAberto(false);

    setNotaFiscalSelecionada(null);

    setModoModal("criar");
  };

  /*
   * =====================================================
   * SALVAR
   * =====================================================
   */

  const salvarNota = async (dados: {
    numero: string;

    fornecedorId: number;

    chaveAcesso: string;
  }) => {
    try {
      setLoading(true);

      /*
       * EDITAR
       */

      if (notaFiscalSelecionada && modoModal === "editar") {
        const atualizada = await atualizarNotaFiscal(
          notaFiscalSelecionada.id,
          dados,
        );

        setNotasFiscais((notas) =>
          notas.map((nota) => (nota.id === atualizada.id ? atualizada : nota)),
        );
      } else {
        /*
         * CRIAR
         */
        const nova = await criarNotaFiscal(dados);

        setNotasFiscais((notas) => [...notas, nova]);
      }

      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar NF:", error);

      alert("Não foi possível salvar a nota fiscal.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * EXCLUIR
   * =====================================================
   */

  const excluirNota = async (nota: NotaFiscal) => {
    const confirmar = window.confirm(`Deseja excluir a NF "${nota.numero}"?`);

    if (!confirmar) {
      return;
    }

    try {
      setLoading(true);

      await excluirNotaFiscalApi(nota.id);

      setNotasFiscais((notas) => notas.filter((item) => item.id !== nota.id));
    } catch (error) {
      console.error("Erro ao excluir NF:", error);

      alert("Não foi possível excluir a nota fiscal.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * COLUNAS
   * =====================================================
   */

  const columns: TableColumn<NotaFiscal>[] = [
    {
      key: "id",

      label: "#",

      width: "60px",

      align: "center",
    },

    {
      key: "numero",

      label: "Número",

      width: "120px",
    },

    {
      key: "razaoSocialFornecedor",

      label: "Fornecedor",

      width: "230px",
    },

    {
      key: "nomeFantasiaFornecedor",

      label: "Nome Fantasia",

      width: "190px",
    },
    {
      key: "nf_vinculada",

      label: "Vinculacão",

      width: "190px",
      render: (value) => value? "Vinculada":"Não Vinculada",
    },

    {
      key: "chaveAcesso",

      label: "Chave de Acesso",

      width: "260px",

      render: (value) => <span className="chave-tabela">{String(value)}</span>,
    },

    {
      key: "dataCriacao",

      label: "Data de Criação",

      width: "170px",

      render: (value) => formatarData(String(value)),
    },
  ];

  /*
   * =====================================================
   * AÇÕES
   * =====================================================
   */

  const actions: TableAction<NotaFiscal>[] = [
    {
      label: "Visualizar",

      variant: "secondary",

      onClick: visualizarNota,
    },

    {
      label: "Editar",

      variant: "primary",

      onClick: editarNota,
    },

    {
      label: "Excluir",

      variant: "danger",

      onClick: excluirNota,
    },
  ];

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <section className="nf-page">
      {/* =================================================
          CABEÇALHO
         ================================================= */}

      <div className="page-header">
        <div>
          <h2>Notas Fiscais</h2>

          <p>Gerencie as notas fiscais de entrada do sistema.</p>
        </div>

        <button
          type="button"
          className="button-primary"
          onClick={abrirNovaNota}
        >
          + Nova Nota Fiscal
        </button>
      </div>

      {/* =================================================
          TABELA
         ================================================= */}

      <Table
        columns={columns}
        data={notasFiscais}
        actions={actions}
        rowKey="id"
        loading={loading}
      />

      {/* =================================================
          MODAL
         ================================================= */}

      <NotaFiscalModal
        isOpen={modalAberto}
        notaFiscal={notaFiscalSelecionada}
        fornecedores={fornecedores}
        modo={modoModal}
        loading={loading}
        onClose={fecharModal}
        onSave={salvarNota}
      />
    </section>
  );
}

/*
 * =====================================================
 * FORMATAR DATA
 * =====================================================
 */

function formatarData(data: string): string {
  const date = new Date(data);

  if (Number.isNaN(date.getTime())) {
    return data;
  }

  return date.toLocaleString("pt-BR", {
    day: "2-digit",

    month: "2-digit",

    year: "numeric",

    hour: "2-digit",

    minute: "2-digit",
  });
}
