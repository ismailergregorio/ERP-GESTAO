import { useEffect, useState } from "react";

import Table from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";

import {
  listarTiposEntradas,
  criarTipoEntrada,
  atualizarTipoEntrada,
  excluirTipoEntrada,
} from "../../services/tipoEntradaService";

import type { TipoEntrada } from "../../types/TipoEntrada";

import "./TiposEntradas.css";

export default function TiposEntradas() {
  const [tiposEntradas, setTiposEntradas] =
    useState<TipoEntrada[]>([]);

  const [tipoSelecionado, setTipoSelecionado] =
    useState<TipoEntrada | null>(null);

  const [modalAberto, setModalAberto] =
    useState(false);

  const [modoModal, setModoModal] =
    useState<"criar" | "editar" | "visualizar">(
      "criar"
    );

  const [nome, setNome] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [loadingDados, setLoadingDados] =
    useState(false);

  useEffect(() => {
    carregarTiposEntradas();
  }, []);

  const carregarTiposEntradas = async () => {
    try {
      setLoadingDados(true);

      const dados = await listarTiposEntradas();

      setTiposEntradas(dados);
    } catch (error) {
      console.error(
        "Erro ao carregar tipos de entrada:",
        error
      );
    } finally {
      setLoadingDados(false);
    }
  };

  // ==========================================
  // ABRIR MODAL
  // ==========================================

  const abrirCriacao = () => {
    setTipoSelecionado(null);
    setNome("");

    setModoModal("criar");
    setModalAberto(true);
  };

  const abrirEdicao = (tipo: TipoEntrada) => {
    setTipoSelecionado(tipo);
    setNome(tipo.nome);

    setModoModal("editar");
    setModalAberto(true);
  };

  const abrirVisualizacao = (
    tipo: TipoEntrada
  ) => {
    setTipoSelecionado(tipo);
    setNome(tipo.nome);

    setModoModal("visualizar");
    setModalAberto(true);
  };

  // ==========================================
  // FECHAR MODAL
  // ==========================================

  const fecharModal = () => {
    setModalAberto(false);
    setTipoSelecionado(null);
    setNome("");
  };

  // ==========================================
  // SALVAR
  // ==========================================

  const salvar = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!nome.trim()) {
      return;
    }

    try {
      setLoading(true);

      if (
        modoModal === "editar" &&
        tipoSelecionado
      ) {
        const atualizado =
          await atualizarTipoEntrada(
            tipoSelecionado.id,
            {
              nome: nome.trim(),
            }
          );

        setTiposEntradas((lista) =>
          lista.map((item) =>
            item.id === atualizado.id
              ? atualizado
              : item
          )
        );
      } else {
        const novo = await criarTipoEntrada({
          nome: nome.trim(),
        });

        setTiposEntradas((lista) => [
          ...lista,
          novo,
        ]);
      }

      fecharModal();
    } catch (error) {
      console.error(
        "Erro ao salvar tipo de entrada:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EXCLUIR
  // ==========================================

  const excluir = async (
    tipo: TipoEntrada
  ) => {
    const confirmar = window.confirm(
      `Deseja realmente excluir o tipo de entrada "${tipo.nome}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      setLoadingDados(true);

      await excluirTipoEntrada(tipo.id);

      setTiposEntradas((lista) =>
        lista.filter(
          (item) => item.id !== tipo.id
        )
      );
    } catch (error) {
      console.error(
        "Erro ao excluir tipo de entrada:",
        error
      );
    } finally {
      setLoadingDados(false);
    }
  };

  // ==========================================
  // FORMATAÇÃO
  // ==========================================

  const formatarData = (
    data: string | null
  ) => {
    if (!data) {
      return "-";
    }

    return new Date(data).toLocaleDateString(
      "pt-BR"
    );
  };

  // ==========================================
  // TABELA
  // ==========================================

  const columns = [
    {
      key: "id",
      label: "ID",
      width: "80px",
      align: "center" as const,
    },

    {
      key: "nome",
      label: "Nome",
    },

    {
      key: "dataCriacao",
      label: "Data de criação",

      render: (value: unknown) =>
        formatarData(String(value)),
    },

    {
      key: "dataUpdate",
      label: "Última atualização",

      render: (value: unknown) =>
        value
          ? formatarData(String(value))
          : "-",
    },
  ];

  const actions = [
    {
      label: "Visualizar",
      variant: "secondary" as const,
      onClick: abrirVisualizacao,
    },

    {
      label: "Editar",
      variant: "primary" as const,
      onClick: abrirEdicao,
    },

    {
      label: "Excluir",
      variant: "danger" as const,
      onClick: excluir,
    },
  ];

  // ==========================================
  // TÍTULO DO MODAL
  // ==========================================

  const tituloModal =
    modoModal === "criar"
      ? "Cadastrar Tipo de Entrada"
      : modoModal === "editar"
        ? "Editar Tipo de Entrada"
        : "Visualizar Tipo de Entrada";

  const somenteVisualizacao =
    modoModal === "visualizar";

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="tipos-entradas-page">

      {/* ================================
          CABEÇALHO
      ================================= */}

      <div className="tipos-entradas-header">
        <div>
          <h1>Tipos de Entrada</h1>

          <p>
            Cadastre e gerencie os tipos de
            entrada de produtos.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={abrirCriacao}
        >
          Novo Tipo de Entrada
        </button>
      </div>

      {/* ================================
          TABELA
      ================================= */}

      <div className="tipos-entradas-card">
        <Table
          columns={columns}
          data={tiposEntradas}
          actions={actions}
          rowKey="id"
          loading={loadingDados}
        />
      </div>

      {/* ================================
          MODAL
      ================================= */}

      <Modal
        isOpen={modalAberto}
        onClose={fecharModal}
        onOpenChange={(aberto) => {
          if (!aberto) {
            fecharModal();
          }
        }}
        title={tituloModal}
        footer={
          somenteVisualizacao ? (
            <button
              type="button"
              className="btn-secondary"
              onClick={fecharModal}
            >
              Fechar
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={fecharModal}
                disabled={loading}
              >
                Cancelar
              </button>

              <button
                type="submit"
                form="tipo-entrada-form"
                className="btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Salvando..."
                  : modoModal === "editar"
                    ? "Atualizar"
                    : "Cadastrar"}
              </button>
            </>
          )
        }
      >
        {somenteVisualizacao ? (
          /* ================================
             VISUALIZAÇÃO
          ================================= */

          <div className="tipo-entrada-visualizacao">
            <section className="tipo-entrada-section">
              <h3>Informações</h3>

              <div className="tipo-entrada-info-grid">

                <div className="tipo-entrada-info">
                  <span>ID</span>

                  <strong>
                    {tipoSelecionado?.id ?? "-"}
                  </strong>
                </div>

                <div className="tipo-entrada-info">
                  <span>Nome</span>

                  <strong>
                    {tipoSelecionado?.nome || "-"}
                  </strong>
                </div>

                <div className="tipo-entrada-info">
                  <span>Data de criação</span>

                  <strong>
                    {formatarData(
                      tipoSelecionado?.dataCriacao ||
                        null
                    )}
                  </strong>
                </div>

                <div className="tipo-entrada-info">
                  <span>Última atualização</span>

                  <strong>
                    {formatarData(
                      tipoSelecionado?.dataUpdate ||
                        null
                    )}
                  </strong>
                </div>

              </div>
            </section>
          </div>
        ) : (
          /* ================================
             CADASTRO / EDIÇÃO
          ================================= */

          <form
            id="tipo-entrada-form"
            className="tipo-entrada-form"
            onSubmit={salvar}
          >
            <div className="form-group">
              <label htmlFor="nome">
                Nome
              </label>

              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(event) =>
                  setNome(event.target.value)
                }
                placeholder="Digite o tipo de entrada"
                maxLength={100}
                disabled={loading}
                required
                autoFocus
              />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}