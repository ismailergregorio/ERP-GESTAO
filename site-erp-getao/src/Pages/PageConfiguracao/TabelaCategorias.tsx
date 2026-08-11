import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import Table from "../../Componete/Table/Table";
import type { Column } from "../../Componete/Table/Table.types";

import HeaderTabela from "../../Componete/HeaderTabela/HeaderTabela";
import Modal from "../../Componete/Modal/Modal";

import covertData from "../../Utils/ConverteDate";
import api from "../../Services/Api";

export interface CategoriaCategoria {
  id: number;
  nome: string;
  dataCriacao?: string;
}

export default function TabelatipoCategoria() {
  // sem barra "/"
  const base = "categorias" 

  const [modalOpen, setModalOpen] = useState(false);

  const [dadosApi, setDadosApi] = useState<CategoriaCategoria[]>([]);

  const [tipoCategoria, setTipoCategoria] = useState("");

  const [tipoCategoriaEditando, setTipoCategoriaEditando] = useState<number | null>(
    null,
  );

  function abrirModal() {
    setTipoCategoria("");
    setTipoCategoriaEditando(null);

    setModalOpen(true);
  }

  function fecharModal() {
    setModalOpen(false);

    setTipoCategoria("");
    setTipoCategoriaEditando(null);
  }

  async function getTipoCategoria() {
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

  async function postCategoria() {
    if (!tipoCategoria.trim()) {
      toast.warning("Informe o nome do tipo de saída.");

      return;
    }

    try {
      await api.post(`/${base}`, {
        nome: tipoCategoria,
      });

      await getTipoCategoria();

      fecharModal();

      toast.success("Tipo de saída adicionado com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao realizar cadastro.");
    }
  }

  function abrirEditar(categoria: CategoriaCategoria) {
    setTipoCategoria(categoria.nome);

    setTipoCategoriaEditando(categoria.id);

    setModalOpen(true);
  }

  async function editarCategoria() {
    if (!tipoCategoria.trim()) {
      toast.warning("Informe o nome do tipo de saída.");

      return;
    }

    if (tipoCategoriaEditando === null) {
      return;
    }

    try {
      await api.put(`/${base}/${tipoCategoriaEditando}`, {
        nome: tipoCategoria,
      });

      await getTipoCategoria();

      fecharModal();

      toast.success("Tipo de saída atualizado com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao atualizar tipo de saída.",
      );
    }
  }

  async function excluirCategoria(categoria: CategoriaCategoria) {
    const confirmar = window.confirm(
      `Deseja realmente excluir "${categoria.nome}"?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      await api.delete(`/${base}/${categoria.id}`);

      await getTipoCategoria();

      toast.success("Tipo de saída excluído com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao excluir tipo de saída.",
      );
    }
  }

  function salvar() {
    if (tipoCategoriaEditando !== null) {
      editarCategoria();
    } else {
      postCategoria();
    }
  }

  const colun: Column<CategoriaCategoria>[] = [
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
    getTipoCategoria();
  }, []);

  return (
    <HeaderTabela title="Categoria" onClick={abrirModal}>
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
              onClick={() => excluirCategoria(categoria)}
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
          tipoCategoriaEditando !== null
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
              value={tipoCategoria}
              placeholder="Nome para o tipo de saída"
              onChange={(e) => setTipoCategoria(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={fecharModal}>
              Cancelar
            </button>

            <button type="button" className="btn-primary" onClick={salvar}>
              {tipoCategoriaEditando !== null ? "Salvar alterações" : "Adicionar"}
            </button>
          </div>
        </div>
      </Modal>
    </HeaderTabela>
  );
}
