import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { toast } from "react-toastify";

import Layout from "../Layout/LayoutPages";
import HeaderTabela from "../Componete/HeaderTabela/HeaderTabela";
import Table from "../Componete/Table/Table";
import Modal from "../Componete/Modal/Modal";

import type { Column } from "../Componete/Table/Table.types";

import api from "../Services/Api";
import covertData from "../Utils/ConverteDate";

// import "./Fornecedores.css";

/* =====================================================
   INTERFACE DO FORNECEDOR
===================================================== */

interface Fornecedor {
  id: number;

  nome: string;

  cnpj: string;

  telefone: string;

  email: string;

  dataCriacao: string;
}

/* =====================================================
   FORMULÁRIO
===================================================== */

interface FornecedorForm {
  nome: string;

  cnpj: string;

  telefone: string;

  email: string;
}

const formularioInicial: FornecedorForm = {
  nome: "",

  cnpj: "",

  telefone: "",

  email: "",
};

export default function Fornecedores() {
  const base = "fornecedores";

  /* =====================================================
       ESTADOS
    ===================================================== */

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [fornecedorEditando, setFornecedorEditando] = useState<number | null>(
    null,
  );

  const [formulario, setFormulario] =
    useState<FornecedorForm>(formularioInicial);

  /* =====================================================
       ABRIR MODAL - NOVO
    ===================================================== */

  function abrirModal() {
    setFormulario(formularioInicial);

    setFornecedorEditando(null);

    setModalOpen(true);
  }

  /* =====================================================
       FECHAR MODAL
    ===================================================== */

  function fecharModal() {
    setModalOpen(false);

    setFormulario(formularioInicial);

    setFornecedorEditando(null);
  }

  /* =====================================================
       BUSCAR FORNECEDORES
    ===================================================== */

  async function getFornecedores() {
    try {
      const resposta = await api.get(`/${base}`);

      setFornecedores(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao buscar fornecedores.");
    }
  }

  /* =====================================================
       ALTERAR FORMULÁRIO
    ===================================================== */

  function alterarCampo(campo: keyof FornecedorForm, valor: string) {
    setFormulario((prev) => ({
      ...prev,

      [campo]: valor,
    }));
  }

  /* =====================================================
       MÁSCARA CNPJ
    ===================================================== */

  function formatarCnpj(valor: string) {
    valor = valor.replace(/\D/g, "").slice(0, 14);

    valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");

    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");

    valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");

    valor = valor.replace(/(\d{4})(\d)/, "$1-$2");

    return valor;
  }

  /* =====================================================
       MÁSCARA TELEFONE
    ===================================================== */

  function formatarTelefone(valor: string) {
    valor = valor.replace(/\D/g, "").slice(0, 11);

    if (valor.length <= 10) {
      valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");

      valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");

      valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    }

    return valor;
  }

  /* =====================================================
       ADICIONAR FORNECEDOR
    ===================================================== */

  async function adicionarFornecedor() {
    if (!formulario.nome.trim()) {
      toast.warning("Informe o nome do fornecedor.");

      return;
    }

    if (!formulario.cnpj.trim()) {
      toast.warning("Informe o CNPJ.");

      return;
    }

    if (!formulario.telefone.trim()) {
      toast.warning("Informe o telefone.");

      return;
    }

    if (!formulario.email.trim()) {
      toast.warning("Informe o e-mail.");

      return;
    }

    try {
      await api.post(`/${base}`, {
        nome: formulario.nome,

        cnpj: formulario.cnpj,

        telefone: formulario.telefone,

        email: formulario.email,
      });

      await getFornecedores();

      fecharModal();

      toast.success("Fornecedor adicionado com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao cadastrar fornecedor.");
    }
  }

  /* =====================================================
       ABRIR EDIÇÃO
    ===================================================== */

  function abrirEditar(fornecedor: Fornecedor) {
    setFornecedorEditando(fornecedor.id);

    setFormulario({
      nome: fornecedor.nome,

      cnpj: fornecedor.cnpj,

      telefone: fornecedor.telefone,

      email: fornecedor.email,
    });

    setModalOpen(true);
  }

  /* =====================================================
       EDITAR
    ===================================================== */

  async function editarFornecedor() {
    if (fornecedorEditando === null) {
      return;
    }

    if (!formulario.nome.trim()) {
      toast.warning("Informe o nome do fornecedor.");

      return;
    }

    try {
      await api.put(`/${base}/${fornecedorEditando}`, {
        nome: formulario.nome,

        cnpj: formulario.cnpj,

        telefone: formulario.telefone,

        email: formulario.email,
      });

      await getFornecedores();

      fecharModal();

      toast.success("Fornecedor atualizado com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao atualizar fornecedor.");
    }
  }

  /* =====================================================
       SALVAR
    ===================================================== */

  function salvarFornecedor() {
    if (fornecedorEditando !== null) {
      editarFornecedor();
    } else {
      adicionarFornecedor();
    }
  }

  /* =====================================================
       EXCLUIR
    ===================================================== */

  async function excluirFornecedor(fornecedor: Fornecedor) {
    const confirmar = window.confirm(
      `Deseja realmente excluir o fornecedor "${fornecedor.nome}"?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      await api.delete(`/${base}/${fornecedor.id}`);

      await getFornecedores();

      toast.success("Fornecedor excluído com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao excluir fornecedor.");
    }
  }

  /* =====================================================
       COLUNAS
    ===================================================== */

  const colunas: Column<Fornecedor>[] = [
    {
      key: "id",

      title: "Id",

      width: "70px",

      align: "center",
    },

    {
      key: "nome",

      title: "Nome",
    },

    {
      key: "cnpj",

      title: "CNPJ",
    },

    {
      key: "telefone",

      title: "Telefone",
    },

    {
      key: "email",

      title: "E-mail",
    },

    {
      key: "dataCriacao",

      title: "Data. Criação",

      render: (value) => {
        if (!value) {
          return "-";
        }

        return covertData(value);
      },
    },
  ];

  /* =====================================================
       USE EFFECT
    ===================================================== */

  useEffect(() => {
    getFornecedores();
  }, []);

  /* =====================================================
       JSX
    ===================================================== */

  return (
    <Layout title="Fornecedores">
      <section>
        <HeaderTabela title="Fornecedores" onClick={abrirModal}>
          <Table columns={colunas} data={fornecedores}>
            {(fornecedor) => (
              <>
                {/* EDITAR */}

                <button
                  type="button"
                  title="Editar"
                  className="action-button"
                  onClick={() => abrirEditar(fornecedor)}
                >
                  <Pencil size={18} />
                </button>

                {/* EXCLUIR */}

                <button
                  type="button"
                  title="Excluir"
                  className="action-button"
                  onClick={() => excluirFornecedor(fornecedor)}
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </Table>
        </HeaderTabela>

        {/* =================================================
                    MODAL
                ================================================= */}

        <Modal
          open={modalOpen}
          title={
            fornecedorEditando !== null
              ? "Editar Fornecedor"
              : "Novo Fornecedor"
          }
          onClose={fecharModal}
        >
          <div className="form-modal">
            {/* NOME */}

            <div className="form-group">
              <label htmlFor="nome">Nome</label>

              <input
                id="nome"
                type="text"
                value={formulario.nome}
                placeholder="Nome do fornecedor"
                onChange={(e) => alterarCampo("nome", e.target.value)}
              />
            </div>

            {/* CNPJ */}

            <div className="form-group">
              <label htmlFor="cnpj">CNPJ</label>

              <input
                id="cnpj"
                type="text"
                value={formulario.cnpj}
                placeholder="00.000.000/0001-00"
                onChange={(e) =>
                  alterarCampo("cnpj", formatarCnpj(e.target.value))
                }
              />
            </div>

            {/* TELEFONE */}

            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>

              <input
                id="telefone"
                type="text"
                value={formulario.telefone}
                placeholder="(00) 00000-0000"
                onChange={(e) =>
                  alterarCampo("telefone", formatarTelefone(e.target.value))
                }
              />
            </div>

            {/* EMAIL */}

            <div className="form-group">
              <label htmlFor="email">E-mail</label>

              <input
                id="email"
                type="email"
                value={formulario.email}
                placeholder="fornecedor@email.com"
                onChange={(e) => alterarCampo("email", e.target.value)}
              />
            </div>

            {/* BOTÕES */}

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={fecharModal}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={salvarFornecedor}
              >
                {fornecedorEditando !== null
                  ? "Salvar alterações"
                  : "Adicionar"}
              </button>
            </div>
          </div>
        </Modal>
      </section>
    </Layout>
  );
}
