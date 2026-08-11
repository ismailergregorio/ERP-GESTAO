import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import Table from "../../Componete/Table/Table";
import type { Column } from "../../Componete/Table/Table.types";

import HeaderTabela from "../../Componete/HeaderTabela/HeaderTabela";
import Modal from "../../Componete/Modal/Modal";

import covertData from "../../Utils/ConverteDate";
import api from "../../Services/Api";

export interface TabelaUnidadeMedida {
  id: number;
  nome: string;
  sigua: string;
  dataCriacao?: string;
}

export default function TabelaUnidadeMedida() {
  // sem barra "/"
  const base = "unidades-medida";

  const [modalOpen, setModalOpen] = useState(false);

  const [dadosApi, setDadosApi] = useState<TabelaUnidadeMedida[]>([]);

  const [tipoUnidadeMedida, setTipoUnidadeMedida] = useState("");
  const [sigla, setSigla] = useState("");

  const [tipoUnidadeMedidaEditando, setTipoUnidadeMedidaEditando] = useState<
    number | null
  >(null);

  function abrirModal() {
    setTipoUnidadeMedida("");
    setSigla("");
    setTipoUnidadeMedidaEditando(null);

    setModalOpen(true);
  }

  function fecharModal() {
    setModalOpen(false);

    setTipoUnidadeMedida("");
    setSigla("");
    setTipoUnidadeMedidaEditando(null);
  }

  async function getTipoUnidadeMedida() {
    try {
      const resposta = await api.get(`/${base}`);

      setDadosApi(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao buscar tipos de saída.",
      );
    }
  }

  async function postUnidadeMedida() {
    if (!tipoUnidadeMedida.trim()) {
      toast.warning("Informe o nome do tipo de saída.");

      return;
    }

    if (!sigla.trim()) {
      toast.warning("Informe o nome do tipo de sigla.");

      return;
    }

    try {
      await api.post(`/${base}`, {
        nome: tipoUnidadeMedida,
        sigua: sigla,
      });

      await getTipoUnidadeMedida();

      fecharModal();

      toast.success("Tipo de saída adicionado com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao realizar cadastro.");
    }
  }

  function abrirEditar(UnidadeMedida: TabelaUnidadeMedida) {
    setTipoUnidadeMedida(UnidadeMedida.nome);

    setTipoUnidadeMedidaEditando(UnidadeMedida.id);

    setModalOpen(true);
  }

  async function editarUnidadeMedida() {
    if (!tipoUnidadeMedida.trim()) {
      toast.warning("Informe o nome do tipo de saída.");

      return;
    }

    if (!sigla.trim()) {
      toast.warning("Informe o nome do tipo de sigla.");

      return;
    }

    if (tipoUnidadeMedidaEditando === null) {
      return;
    }

    try {
      await api.put(`/${base}/${tipoUnidadeMedidaEditando}`, {
        nome: tipoUnidadeMedida,
        sigua: sigla,
      });

      await getTipoUnidadeMedida();

      fecharModal();

      toast.success("Tipo de saída atualizado com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao atualizar tipo de saída.",
      );
    }
  }

  async function excluirUnidadeMedida(UnidadeMedida: TabelaUnidadeMedida) {
    const confirmar = window.confirm(
      `Deseja realmente excluir "${UnidadeMedida.nome}"?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      await api.delete(`/${base}/${UnidadeMedida.id}`);

      await getTipoUnidadeMedida();

      toast.success("Tipo de saída excluído com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao excluir tipo de saída.",
      );
    }
  }

  function salvar() {
    if (tipoUnidadeMedidaEditando !== null) {
      editarUnidadeMedida();
    } else {
      postUnidadeMedida();
    }
  }

  const colun: Column<TabelaUnidadeMedida>[] = [
    {
      key: "id",
      title: "Id",
    },

    {
      key: "nome",
      title: "Nome",
    },
    {
      key: "sigua",
      title: "Sigla",
    },

    {
      key: "dataCriacao",
      title: "Dat. Criação",

      render: (value) => {
        if (!value) {
          return "-";
        }

        return covertData(value);
      },
    },
  ];

  useEffect(() => {
    getTipoUnidadeMedida();
  }, []);

  return (
    <HeaderTabela title="UnidadeMedida" onClick={abrirModal}>
      <Table columns={colun} data={dadosApi}>
        {(UnidadeMedida) => (
          <>
            {/* EDITAR */}

            <button
              type="button"
              title="Editar"
              className="action-button"
              onClick={() => abrirEditar(UnidadeMedida)}
            >
              <Pencil size={18} />
            </button>

            {/* EXCLUIR */}

            <button
              type="button"
              title="Excluir"
              className="action-button"
              onClick={() => excluirUnidadeMedida(UnidadeMedida)}
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </Table>

      {/* =========================
                MODAL
            ========================= */}

      <Modal
        open={modalOpen}
        title={
          tipoUnidadeMedidaEditando !== null
            ? "Editar Tipo de Saída"
            : "Novo Tipo de Saída"
        }
        onClose={fecharModal}
      >
        <div className="form-modal">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>

            <input
              id="nome"
              type="text"
              value={tipoUnidadeMedida}
              placeholder="Nome para o tipo de saída"
              onChange={(e) => setTipoUnidadeMedida(e.target.value)}
            />

            <label htmlFor="Sigla">Sigla</label>

            <input
              id="nome"
              type="text"
              value={sigla}
              placeholder="Nome para o tipo de saída"
              onChange={(e) => setSigla(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={fecharModal}>
              Cancelar
            </button>

            <button type="button" className="btn-primary" onClick={salvar}>
              {tipoUnidadeMedidaEditando !== null
                ? "Salvar alterações"
                : "Adicionar"}
            </button>
          </div>
        </div>
      </Modal>
    </HeaderTabela>
  );
}
