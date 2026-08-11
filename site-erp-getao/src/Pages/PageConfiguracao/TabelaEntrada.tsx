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

export default function TabelaTipoEntrada() {
  // sem barra "/"
  const base = "tipos-entrada" 

  const [modalOpen, setModalOpen] = useState(false);

  const [dadosApi, setDadosApi] = useState<CategoriaSaida[]>([]);

  const [tipoEntrada, setTipoEntrada] = useState("");

  const [tipoEntradaEditando, setTipoEntradaEditando] = useState<number | null>(
    null,
  );

  function abrirModal() {
    setTipoEntrada("");
    setTipoEntradaEditando(null);

    setModalOpen(true);
  }

  function fecharModal() {
    setModalOpen(false);

    setTipoEntrada("");
    setTipoEntradaEditando(null);
  }

  async function getTipoEntrada() {
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

  async function postTipoDeEntrada() {
    if (!tipoEntrada.trim()) {
      toast.warning("Informe o nome do tipo de saída.");

      return;
    }

    try {
      await api.post(`/${base}`, {
        nome: tipoEntrada,
      });

      await getTipoEntrada();

      fecharModal();

      toast.success("Tipo de saída adicionado com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao realizar cadastro.");
    }
  }

  function abrirEditar(categoria: CategoriaSaida) {
    setTipoEntrada(categoria.nome);

    setTipoEntradaEditando(categoria.id);

    setModalOpen(true);
  }

  async function editarTipoeEntrada() {
    if (!tipoEntrada.trim()) {
      toast.warning("Informe o nome do tipo de saída.");

      return;
    }

    if (tipoEntradaEditando === null) {
      return;
    }

    try {
      await api.put(`/${base}/${tipoEntradaEditando}`, {
        nome: tipoEntrada,
      });

      await getTipoEntrada();

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
      await api.delete(`/${base}/${categoria.id}`);

      await getTipoEntrada();

      toast.success("Tipo de saída excluído com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao excluir tipo de saída.",
      );
    }
  }

  function salvar() {
    if (tipoEntradaEditando !== null) {
      editarTipoeEntrada();
    } else {
      postTipoDeEntrada();
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
    getTipoEntrada();
  }, []);

  return (
    <HeaderTabela title="Tipos de Entrada" onClick={abrirModal}>
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
          tipoEntradaEditando !== null
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
              value={tipoEntrada}
              placeholder="Nome para o tipo de saída"
              onChange={(e) => setTipoEntrada(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={fecharModal}>
              Cancelar
            </button>

            <button type="button" className="btn-primary" onClick={salvar}>
              {tipoEntradaEditando !== null ? "Salvar alterações" : "Adicionar"}
            </button>
          </div>
        </div>
      </Modal>
    </HeaderTabela>
  );
}
