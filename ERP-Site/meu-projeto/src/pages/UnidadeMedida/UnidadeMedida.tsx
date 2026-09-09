import { useEffect, useState } from "react";

import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";

import type { UnidadeMedida as UnidadeMedidaType } from "../../types/UnidadeMedida";

import {
  listarUnidadesMedida,
  buscarUnidadeMedidaPorId,
  criarUnidadeMedida,
  atualizarUnidadeMedida,
  excluirUnidadeMedida as excluirUnidadeMedidaApi,
} from "../../services/unidadeMedidaService"

import "./UnidadeMedida.css";

export default function UnidadeMedida() {
  /*
   * =====================================================
   * ESTADOS
   * =====================================================
   */

  const [unidades, setUnidades] = useState<UnidadeMedidaType[]>([]);

  const [loading, setLoading] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);

  const [categoriaSelecionada, setUnidadeSelecionada] =
    useState<UnidadeMedidaType | null>(null);

  const [modoVisualizacao, setModoVisualizacao] = useState(false);

  const [nome, setNome] = useState("");

  const [sigla, setSigla] = useState("");

  /*
   * =====================================================
   * CARREGAR UNIDADES
   * =====================================================
   */

  const carregarUnidades = async () => {
    try {
      setLoading(true);

      const dados = await listarUnidadesMedida();

      setUnidades(dados);
    } catch (error) {
      console.error("Erro ao carregar unidades de medida:", error);

      alert("Não foi possível carregar as unidades de medida.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * CARREGAR AO ABRIR A PÁGINA
   * =====================================================
   */

  useEffect(() => {
    carregarUnidades();
  }, []);

  /*
   * =====================================================
   * LIMPAR FORMULÁRIO
   * =====================================================
   */

  const limparFormulario = () => {
    setNome("");

    setSigla("");

    setUnidadeSelecionada(null);

    setModoVisualizacao(false);
  };

  /*
   * =====================================================
   * ABRIR NOVA UNIDADE
   * =====================================================
   */

  const abrirModal = () => {
    limparFormulario();

    setModalAberto(true);
  };

  /*
   * =====================================================
   * FECHAR MODAL
   * =====================================================
   */

  const fecharModal = () => {
    setModalAberto(false);

    limparFormulario();
  };

  /*
   * =====================================================
   * EDITAR
   * =====================================================
   */

  const editarUnidade = (unidade: UnidadeMedidaType) => {
    setUnidadeSelecionada(unidade);

    setNome(unidade.nome);

    setSigla(unidade.sigla);

    setModoVisualizacao(false);

    setModalAberto(true);
  };

  /*
   * =====================================================
   * VISUALIZAR
   * =====================================================
   */

  const visualizarUnidade = async (unidade: UnidadeMedidaType) => {
    try {
      setLoading(true);

      const dados = await buscarUnidadeMedidaPorId(unidade.id);

      setUnidadeSelecionada(dados);

      setNome(dados.nome);

      setSigla(dados.sigla);

      setModoVisualizacao(true);

      setModalAberto(true);
    } catch (error) {
      console.error("Erro ao buscar unidade:", error);

      alert("Não foi possível carregar os dados da unidade.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * EXCLUIR
   * =====================================================
   */

  const excluirUnidade = async (unidade: UnidadeMedidaType) => {
    const confirmar = window.confirm(
      `Deseja excluir a unidade "${unidade.nome}"?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      setLoading(true);

      await excluirUnidadeMedidaApi(unidade.id);

      /*
       * Remove imediatamente da tabela
       */

      setUnidades((unidades) =>
        unidades.filter((item) => item.id !== unidade.id),
      );
    } catch (error) {
      console.error("Erro ao excluir unidade:", error);

      alert("Não foi possível excluir a unidade de medida.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * SALVAR
   * =====================================================
   */

  const salvarUnidade = async () => {
    /*
     * Validação
     */

    if (!nome.trim()) {
      alert("Informe o nome da unidade de medida.");

      return;
    }

    if (!sigla.trim()) {
      alert("Informe a sigla da unidade de medida.");

      return;
    }

    try {
      setLoading(true);

      /*
       * EDITAR
       */

      if (categoriaSelecionada) {
        const unidadeAtualizada = await atualizarUnidadeMedida(
          categoriaSelecionada.id,
          {
            nome: nome.trim(),
            sigla: sigla.trim().toUpperCase(),
          },
        );

        setUnidades((unidades) =>
          unidades.map((unidade) =>
            unidade.id === unidadeAtualizada.id ? unidadeAtualizada : unidade,
          ),
        );
      } else {

      /*
       * NOVA
       */
        const novaUnidade = await criarUnidadeMedida({
          nome: nome.trim(),

          sigla: sigla.trim().toUpperCase(),
        });

        setUnidades((unidades) => [...unidades, novaUnidade]);
      }

      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar unidade:", error);

      alert("Não foi possível salvar a unidade de medida.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * COLUNAS
   * =====================================================
   */

  const columns = [
    {
      key: "id" as const,
      label: "#",
      width: "70px",
      align: "center" as const,
    },

    {
      key: "nome" as const,
      label: "Nome",
    },

    {
      key: "sigla" as const,
      label: "Sigla",
      width: "120px",
      align: "center" as const,
    },

    {
      key: "dataCriacao" as const,
      label: "Data de Criação",
    },

    {
      key: "dataUpdate" as const,
      label: "Última Atualização",

      render: (value: string | null) => {
        if (!value) {
          return "-";
        }

        return formatarData(value);
      },
    },

    {
      key: "ativo" as const,
      label: "Status",

      render: (value: boolean) => (
        <span className={value ? "status-active" : "status-inactive"}>
          {value ? "Ativa" : "Inativa"}
        </span>
      ),
    },
  ];

  /*
   * =====================================================
   * AÇÕES
   * =====================================================
   */

  const actions = [
    {
      label: "Visualizar",

      variant: "secondary" as const,

      onClick: visualizarUnidade,
    },

    {
      label: "Editar",

      variant: "primary" as const,

      onClick: editarUnidade,
    },

    {
      label: "Excluir",

      variant: "danger" as const,

      onClick: excluirUnidade,
    },
  ];

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <section className="unidade-page">
      {/* =================================================
          CABEÇALHO
         ================================================= */}

      <div className="page-header">
        <div>
          <h2>Unidades de Medida</h2>

          <p>Gerencie as unidades utilizadas nos produtos do sistema.</p>
        </div>

        <button type="button" className="button-primary" onClick={abrirModal}>
          + Nova Unidade
        </button>
      </div>

      {/* =================================================
          TABELA
         ================================================= */}

      <Table
        columns={columns}
        data={unidades}
        actions={actions}
        rowKey="id"
        loading={loading}
      />

      {/* =================================================
          MODAL
         ================================================= */}

      <Modal
        isOpen={modalAberto}
        onClose={fecharModal}
        onOpenChange={setModalAberto}
        title={
          modoVisualizacao
            ? "Visualizar Unidade de Medida"
            : categoriaSelecionada
              ? "Editar Unidade de Medida"
              : "Nova Unidade de Medida"
        }
        width="600px"
        footer={
          modoVisualizacao ? (
            <button
              type="button"
              className="button-secondary"
              onClick={fecharModal}
            >
              Fechar
            </button>
          ) : (
            <>
              <button
                type="button"
                className="button-secondary"
                onClick={fecharModal}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="button-primary"
                onClick={salvarUnidade}
                disabled={loading}
              >
                {loading
                  ? "Salvando..."
                  : categoriaSelecionada
                    ? "Salvar Alterações"
                    : "Salvar Unidade"}
              </button>
            </>
          )
        }
      >
        <div className="unidade-form">
          {/* =================================================
              NOME
             ================================================= */}

          <div className="form-group">
            <label htmlFor="nome">
              Nome da Unidade
              {!modoVisualizacao && <span>*</span>}
            </label>

            <input
              id="nome"
              type="text"
              value={nome}
              disabled={modoVisualizacao}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Ex.: Quilograma"
            />
          </div>

          {/* =================================================
              SIGLA
             ================================================= */}

          <div className="form-group">
            <label htmlFor="sigla">
              Sigla
              {!modoVisualizacao && <span>*</span>}
            </label>

            <input
              id="sigla"
              type="text"
              value={sigla}
              disabled={modoVisualizacao}
              maxLength={10}
              onChange={(event) => setSigla(event.target.value.toUpperCase())}
              placeholder="Ex.: KG"
            />
          </div>

          {/* =================================================
              INFORMAÇÕES SOMENTE NA VISUALIZAÇÃO
             ================================================= */}

          {modoVisualizacao && categoriaSelecionada && (
            <div className="unidade-info">
              <div>
                <span>Status</span>

                <strong
                  className={
                    categoriaSelecionada.ativo
                      ? "status-active"
                      : "status-inactive"
                  }
                >
                  {categoriaSelecionada.ativo ? "Ativa" : "Inativa"}
                </strong>
              </div>

              <div>
                <span>Data de Criação</span>

                <strong>
                  {formatarData(categoriaSelecionada.dataCriacao)}
                </strong>
              </div>

              <div>
                <span>Última Atualização</span>

                <strong>
                  {categoriaSelecionada.dataUpdate
                    ? formatarData(categoriaSelecionada.dataUpdate)
                    : "Nunca atualizada"}
                </strong>
              </div>
            </div>
          )}
        </div>
      </Modal>
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
