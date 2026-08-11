import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import Table from "../../Componete/Table/Table";
import type { Column } from "../../Componete/Table/Table.types";

import HeaderTabela from "../../Componete/HeaderTabela/HeaderTabela";
import Modal from "../../Componete/Modal/Modal";

import covertData from "../../Utils/ConverteDate";
import api from "../../Services/Api";

interface CategoriaSaida {
  id: number;
  nome: string;
  dataCriacao?: string;
}

export default function TabelaTipoSaida() {
  const [modalOpen, setModalOpen] = useState(false);

  const [dadosApi, setDadosApi] = useState<CategoriaSaida[]>([]);

  const [tipoSaida, setTipoSaida] = useState("");

  const [tipoSaidaEditando, setTipoSaidaEditando] = useState<number | null>(
    null,
  );

  function abrirModal() {
    setTipoSaida("");
    setTipoSaidaEditando(null);

    setModalOpen(true);
  }

  function fecharModal() {
    setModalOpen(false);

    setTipoSaida("");
    setTipoSaidaEditando(null);
  }

  async function getTipoSaida() {
    try {
      const resposta = await api.get("/tipos-saida");

      setDadosApi(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao buscar tipos de saída.",
      );
    }
  }

  async function postTipoDeSaida() {
    if (!tipoSaida.trim()) {
      toast.warning("Informe o nome do tipo de saída.");

      return;
    }

    try {
      await api.post("/tipos-saida", {
        nome: tipoSaida,
      });

      await getTipoSaida();

      fecharModal();

      toast.success("Tipo de saída adicionado com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao realizar cadastro.");
    }
  }

  function abrirEditar(categoria: CategoriaSaida) {
    setTipoSaida(categoria.nome);

    setTipoSaidaEditando(categoria.id);

    setModalOpen(true);
  }

  async function editarTipoSaida() {
    if (!tipoSaida.trim()) {
      toast.warning("Informe o nome do tipo de saída.");

      return;
    }

    if (tipoSaidaEditando === null) {
      return;
    }

    try {
      await api.put(`/tipos-saida/${tipoSaidaEditando}`, {
        nome: tipoSaida,
      });

      await getTipoSaida();

      fecharModal();

      toast.success("Tipo de saída atualizado com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao atualizar tipo de saída.",
      );
    }
  }

  async function excluirTipoSaida(categoria: CategoriaSaida) {
    const confirmar = window.confirm(
      `Deseja realmente excluir "${categoria.nome}"?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      await api.delete(`/tipos-saida/${categoria.id}`);

      await getTipoSaida();

      toast.success("Tipo de saída excluído com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao excluir tipo de saída.",
      );
    }
  }

  function salvar() {
    if (tipoSaidaEditando !== null) {
      editarTipoSaida();
    } else {
      postTipoDeSaida();
    }
  }

  const colun: Column<CategoriaSaida>[] = [
    {
      key: "id",
      title: "Id",
    },

    {
      key: "nome",
      title: "Nome",
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
    getTipoSaida();
  }, []);

  return (
    <HeaderTabela title="Tipos de Saída" onClick={abrirModal}>
      <Table columns={colun} data={dadosApi}>
        {(categoria) => (
          <>
            {/* EDITAR */}

            <button
              type="button"
              title="Editar"
              className="action-button"
              onClick={() => abrirEditar(categoria)}
            >
              <Pencil size={18} />
            </button>

            {/* EXCLUIR */}

            <button
              type="button"
              title="Excluir"
              className="action-button"
              onClick={() => excluirTipoSaida(categoria)}
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
          tipoSaidaEditando !== null
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
              value={tipoSaida}
              placeholder="Nome para o tipo de saída"
              onChange={(e) => setTipoSaida(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={fecharModal}>
              Cancelar
            </button>

            <button type="button" className="btn-primary" onClick={salvar}>
              {tipoSaidaEditando !== null ? "Salvar alterações" : "Adicionar"}
            </button>
          </div>
        </div>
      </Modal>
    </HeaderTabela>
  );
}
