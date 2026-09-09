import { useEffect, useState } from "react";

import Table from "../../components/Table/Table";

import FornecedorModal from "../../components/FornecedorModal/FornecedorModal";

import type { TableColumn, TableAction } from "../../components/Table/Table";

import type { Fornecedor } from "../../types/Fornecedor";

import {
  listarFornecedores,
  buscarFornecedorPorId,
  criarFornecedor,
  atualizarFornecedor,
  excluirFornecedor as excluirFornecedorApi,
} from "../../services/fornecedorService";

import "./Fornecedores.css";

export default function Fornecedores() {
  /*
   * =====================================================
   * ESTADOS
   * =====================================================
   */

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  const [loading, setLoading] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);

  const [fornecedorSelecionado, setFornecedorSelecionado] =
    useState<Fornecedor | null>(null);

  const [modoModal, setModoModal] = useState<"criar" | "editar" | "visualizar">(
    "criar",
  );

  /*
   * =====================================================
   * CARREGAR
   * =====================================================
   */

  const carregarFornecedores = async () => {
    try {
      setLoading(true);

      const dados = await listarFornecedores();

      setFornecedores(dados);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);

      alert("Não foi possível carregar os fornecedores.");
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
    carregarFornecedores();
  }, []);

  /*
   * =====================================================
   * NOVO
   * =====================================================
   */

  const abrirNovoFornecedor = () => {
    setFornecedorSelecionado(null);

    setModoModal("criar");

    setModalAberto(true);
  };

  /*
   * =====================================================
   * VISUALIZAR
   * =====================================================
   */

  const visualizarFornecedor = async (fornecedor: Fornecedor) => {
    try {
      setLoading(true);

      const dados = await buscarFornecedorPorId(fornecedor.id);

      setFornecedorSelecionado(dados);

      setModoModal("visualizar");

      setModalAberto(true);
    } catch (error) {
      console.error("Erro ao buscar fornecedor:", error);

      alert("Não foi possível carregar o fornecedor.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * EDITAR
   * =====================================================
   */

  const editarFornecedor = (fornecedor: Fornecedor) => {
    setFornecedorSelecionado(fornecedor);

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

    setFornecedorSelecionado(null);

    setModoModal("criar");
  };

  /*
   * =====================================================
   * SALVAR
   * =====================================================
   */

  const salvarFornecedor = async (dados: {
    razaoSocial: string;
    nomeFantasia: string;
    inscricaoEstadual: string;
    cnpj: string;
    telefone: string;
    email: string;
  }) => {
    try {
      setLoading(true);

      /*
       * EDITAR
       */

      if (fornecedorSelecionado && modoModal === "editar") {
        const atualizado = await atualizarFornecedor(
          fornecedorSelecionado.id,
          dados,
        );

        setFornecedores((fornecedores) =>
          fornecedores.map((fornecedor) =>
            fornecedor.id === atualizado.id ? atualizado : fornecedor,
          ),
        );
      } else {

      /*
       * CRIAR
       */
        const novo = await criarFornecedor(dados);

        setFornecedores((fornecedores) => [...fornecedores, novo]);
      }

      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);

      alert("Não foi possível salvar o fornecedor.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * EXCLUIR / DESATIVAR
   * =====================================================
   */

  const excluirFornecedor = async (fornecedor: Fornecedor) => {
    const confirmar = window.confirm(
      `Deseja desativar o fornecedor "${fornecedor.nomeFantasia}"?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      setLoading(true);

      await excluirFornecedorApi(fornecedor.id);

      /*
       * O DELETE do backend é
       * uma DESATIVAÇÃO.
       *
       * Portanto não removemos
       * fisicamente da lista.
       */

      setFornecedores((fornecedores) =>
        fornecedores.map((item) =>
          item.id === fornecedor.id
            ? {
                ...item,
                ativo: false,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Erro ao desativar fornecedor:", error);

      alert("Não foi possível desativar o fornecedor.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * COLUNAS
   * =====================================================
   */

  const columns: TableColumn<Fornecedor>[] = [
    {
      key: "id",

      label: "#",

      width: "60px",

      align: "center",
    },

    {
      key: "razaoSocial",

      label: "Razão Social",

      width: "220px",
    },

    {
      key: "nomeFantasia",

      label: "Nome Fantasia",

      width: "190px",
    },

    {
      key: "cnpj",

      label: "CNPJ",

      width: "170px",
    },

    {
      key: "telefone",

      label: "Telefone",

      width: "150px",
    },

    {
      key: "email",

      label: "E-mail",

      width: "220px",
    },

    {
      key: "ativo",

      label: "Status",

      width: "100px",

      align: "center",

      render: (value) => (
        <span className={value ? "status-active" : "status-inactive"}>
          {value ? "Ativo" : "Inativo"}
        </span>
      ),
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

  const actions: TableAction<Fornecedor>[] = [
    {
      label: "Visualizar",

      variant: "secondary",

      onClick: visualizarFornecedor,
    },

    {
      label: "Editar",

      variant: "primary",

      onClick: editarFornecedor,

      disabled: (fornecedor) => !fornecedor.ativo,
    },

    {
      label: "Desativar",

      variant: "danger",

      onClick: excluirFornecedor,

      disabled: (fornecedor) => !fornecedor.ativo,
    },
  ];

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <section className="fornecedor-page">
      {/* =================================================
          CABEÇALHO
         ================================================= */}

      <div className="page-header">
        <div>
          <h2>Fornecedores</h2>

          <p>Gerencie os fornecedores cadastrados no sistema.</p>
        </div>

        <button
          type="button"
          className="button-primary"
          onClick={abrirNovoFornecedor}
        >
          + Novo Fornecedor
        </button>
      </div>

      {/* =================================================
          TABELA
         ================================================= */}

      <Table
        columns={columns}
        data={fornecedores}
        actions={actions}
        rowKey="id"
        loading={loading}
      />

      {/* =================================================
          MODAL
         ================================================= */}

      <FornecedorModal
        isOpen={modalAberto}
        fornecedor={fornecedorSelecionado}
        modo={modoModal}
        loading={loading}
        onClose={fecharModal}
        onSave={salvarFornecedor}
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
