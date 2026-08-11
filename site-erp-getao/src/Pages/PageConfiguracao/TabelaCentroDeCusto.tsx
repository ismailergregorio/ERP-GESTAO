import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import Table from "../../Componete/Table/Table";
import type { Column } from "../../Componete/Table/Table.types";

import HeaderTabela from "../../Componete/HeaderTabela/HeaderTabela";
import Modal from "../../Componete/Modal/Modal";

import covertData from "../../Utils/ConverteDate";
import api from "../../Services/Api";

interface tabelaCentroDeCusto {
  id: number;
  nome: string;
  dataCriacao?: string;
}

export default function TabelatipoCentroDecusto() {
  // sem barra "/"
  const base = "centro-custo" 

  const [modalOpen, setModalOpen] = useState(false);

  const [dadosApi, setDadosApi] = useState<tabelaCentroDeCusto[]>([]);

  const [tipoCentroDeCusto, setTipoCentroDeCusto] = useState("");

  const [tipoCentroDeCustoEditando, setTipoCentroDeCustoEditando] = useState<number | null>(
    null,
  );

  function abrirModal() {
    setTipoCentroDeCusto("");
    setTipoCentroDeCustoEditando(null);

    setModalOpen(true);
  }

  function fecharModal() {
    setModalOpen(false);

    setTipoCentroDeCusto("");
    setTipoCentroDeCustoEditando(null);
  }

  async function getTipoCentroDeCusto() {
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

  async function postCentroDeCusto() {
    if (!tipoCentroDeCusto.trim()) {
      toast.warning("Informe o nome do tipo de saída.");

      return;
    }

    try {
      await api.post(`/${base}`, {
        nome: tipoCentroDeCusto,
      });

      await getTipoCentroDeCusto();

      fecharModal();

      toast.success("Tipo de saída adicionado com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao realizar cadastro.");
    }
  }

  function abrirEditar(CentroDeCusto: tabelaCentroDeCusto) {
    setTipoCentroDeCusto(CentroDeCusto.nome);

    setTipoCentroDeCustoEditando(CentroDeCusto.id);

    setModalOpen(true);
  }

  async function editarCentroDeCusto() {
    if (!tipoCentroDeCusto.trim()) {
      toast.warning("Informe o nome do tipo de saída.");

      return;
    }

    if (tipoCentroDeCustoEditando === null) {
      return;
    }

    try {
      await api.put(`/${base}/${tipoCentroDeCustoEditando}`, {
        nome: tipoCentroDeCusto,
      });

      await getTipoCentroDeCusto();

      fecharModal();

      toast.success("Tipo de saída atualizado com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao atualizar tipo de saída.",
      );
    }
  }

  async function excluirCentroDeCusto(CentroDeCusto: tabelaCentroDeCusto) {
    const confirmar = window.confirm(
      `Deseja realmente excluir "${CentroDeCusto.nome}"?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      await api.delete(`/${base}/${CentroDeCusto.id}`);

      await getTipoCentroDeCusto();

      toast.success("Tipo de saída excluído com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao excluir tipo de saída.",
      );
    }
  }

  function salvar() {
    if (tipoCentroDeCustoEditando !== null) {
      editarCentroDeCusto();
    } else {
      postCentroDeCusto();
    }
  }

  const colun: Column<tabelaCentroDeCusto>[] = [
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
    getTipoCentroDeCusto();
  }, []);

  return (
    <HeaderTabela title="CentroDeCusto" onClick={abrirModal}>
      <Table columns={colun} data={dadosApi}>
        {(CentroDeCusto) => (
          <>
            {/* EDITAR */}

            <button
              type="button"
              title="Editar"
              className="action-button"
              onClick={() => abrirEditar(CentroDeCusto)}
            >
              <Pencil size={18} />
            </button>

            {/* EXCLUIR */}

            <button
              type="button"
              title="Excluir"
              className="action-button"
              onClick={() => excluirCentroDeCusto(CentroDeCusto)}
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
          tipoCentroDeCustoEditando !== null
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
              value={tipoCentroDeCusto}
              placeholder="Nome para o tipo de saída"
              onChange={(e) => setTipoCentroDeCusto(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={fecharModal}>
              Cancelar
            </button>

            <button type="button" className="btn-primary" onClick={salvar}>
              {tipoCentroDeCustoEditando !== null ? "Salvar alterações" : "Adicionar"}
            </button>
          </div>
        </div>
      </Modal>
    </HeaderTabela>
  );
}
