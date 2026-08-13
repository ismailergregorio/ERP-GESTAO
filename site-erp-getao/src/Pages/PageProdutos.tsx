import { useEffect, useState } from "react";

import HeaderTabela from "../Componete/HeaderTabela/HeaderTabela";
import Table from "../Componete/Table/Table";
import type { Column } from "../Componete/Table/Table.types";
import Layout from "../Layout/LayoutPages";
import covertData from "../Utils/ConverteDate";
import api from "../Services/Api";

import { toast } from "react-toastify";

import type { CategoriaCategoria } from "./PageConfiguracao/TabelaCategorias";
import type { TabelaUnidadeMedida } from "./PageConfiguracao/TabelaUnidadeMedida";

import { Pencil, History } from "lucide-react";

import Modal from "../Componete/Modal/Modal";

// import "./Produtos.css";

interface TabelaProdutos {
  id: number;

  nome: string;

  unidadeMedida: number;

  categoria: number;

  valorUnitario: number;

  estoque: number;

  estoqueMinimo: number;

  estoqueMaximo: number;

  ativo: boolean;

  dataCriacao: string;
}

interface ProdutoForm {
  nome: string;

  unidadeMedida: number | "";

  categoria: number | "";

  valorUnitario: number | "";

  estoqueMinimo: number | "";

  estoqueMaximo: number | "";
}

const formularioInicial: ProdutoForm = {
  nome: "",

  unidadeMedida: "",

  categoria: "",

  valorUnitario: "",

  estoqueMinimo: "",

  estoqueMaximo: "",
};

export default function Produtos() {
  const base = "produtos";

  const baseCategoria = "categorias";

  const baseUnidadeMedida = "unidades-medida";

  /* =====================================================
       ESTADOS
    ===================================================== */

  const [modalOpen, setModalOpen] = useState(false);

  const [dadosApi, setDadosApi] = useState<TabelaProdutos[]>([]);

  const [unidadeMedida, setUnidadeMedida] = useState<TabelaUnidadeMedida[]>([]);

  const [categorias, setCategorias] = useState<CategoriaCategoria[]>([]);

  const [formulario, setFormulario] = useState<ProdutoForm>(formularioInicial);

  /*
   * null = novo produto
   * número = produto sendo editado
   */
  const [produtoEditando, setProdutoEditando] = useState<number | null>(null);

  /* =====================================================
       ABRIR MODAL - NOVO PRODUTO
    ===================================================== */

  function abrirModal() {
    setFormulario(formularioInicial);

    setProdutoEditando(null);

    setModalOpen(true);
  }

  /* =====================================================
       FECHAR MODAL
    ===================================================== */

  function fecharModal() {
    setModalOpen(false);

    setFormulario(formularioInicial);

    setProdutoEditando(null);
  }

  /* =====================================================
       ALTERAR CAMPO DO FORMULÁRIO
    ===================================================== */

  function alterarCampo(campo: keyof ProdutoForm, valor: string) {
    setFormulario((prev) => ({
      ...prev,

      [campo]: campo === "nome" ? valor : valor === "" ? "" : Number(valor),
    }));
  }

  /* =====================================================
       BUSCAR UNIDADES
    ===================================================== */

  async function getTipoUnidadeMedida() {
    try {
      const resposta = await api.get(`/${baseUnidadeMedida}`);

      setUnidadeMedida(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao buscar unidades de medida.",
      );
    }
  }

  /* =====================================================
       BUSCAR CATEGORIAS
    ===================================================== */

  async function getCategorias() {
    try {
      const resposta = await api.get(`/${baseCategoria}`);

      setCategorias(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao buscar categorias.");
    }
  }

  /* =====================================================
       BUSCAR PRODUTOS
    ===================================================== */

  async function getProdutos() {
    try {
      const resposta = await api.get(`/${base}`);

      setDadosApi(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao buscar produtos.");
    }
  }

  /* =====================================================
       NOVO PRODUTO
    ===================================================== */

  async function adicionarProduto() {
    if (!formulario.nome.trim()) {
      toast.warning("Informe o nome do produto.");

      return;
    }

    if (formulario.unidadeMedida === "" || formulario.categoria === "") {
      toast.warning("Informe a unidade de medida e a categoria.");

      return;
    }

    try {
      await api.post(`/${base}`, {
        nome: formulario.nome,

        unidadeMedidaId: formulario.unidadeMedida,

        categoriaId: formulario.categoria,

        valorUnitario: formulario.valorUnitario || 0,

        estoqueMinimo: formulario.estoqueMinimo || 0,

        estoqueMaximo: formulario.estoqueMaximo || 0,
      });

      await getProdutos();

      fecharModal();

      toast.success("Produto adicionado com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao adicionar produto.");
    }
  }

  /* =====================================================
       ABRIR EDIÇÃO
    ===================================================== */

  function abrirProduto(produto: TabelaProdutos) {
    setProdutoEditando(produto.id);

    setFormulario({
      nome: produto.nome,

      unidadeMedida: produto.unidadeMedida,

      categoria: produto.categoria,

      valorUnitario: produto.valorUnitario,

      estoqueMinimo: produto.estoqueMinimo,

      estoqueMaximo: produto.estoqueMaximo,
    });

    setModalOpen(true);
  }

  /* =====================================================
       EDITAR PRODUTO
    ===================================================== */

  async function editarProduto() {
    if (produtoEditando === null) {
      return;
    }

    if (!formulario.nome.trim()) {
      toast.warning("Informe o nome do produto.");

      return;
    }

    try {
      await api.put(`/${base}/${produtoEditando}`, {
        nome: formulario.nome,

        unidadeMedidaId: formulario.unidadeMedida,

        categoriaId: formulario.categoria,

        valorUnitario: formulario.valorUnitario || 0,

        estoqueMinimo: formulario.estoqueMinimo || 0,

        estoqueMaximo: formulario.estoqueMaximo || 0,
      });

      await getProdutos();

      fecharModal();

      toast.success("Produto atualizado com sucesso!");
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao atualizar produto.");
    }
  }

  /* =====================================================
       SALVAR
    ===================================================== */

  function salvarProduto() {
    if (produtoEditando !== null) {
      editarProduto();
    } else {
      adicionarProduto();
    }
  }

  /* =====================================================
       EXCLUIR
    ===================================================== */

  // async function excluirProduto(produto: TabelaProdutos) {
  //   const confirmar = window.confirm(
  //     `Deseja realmente excluir o produto "${produto.nome}"?`,
  //   );

  //   if (!confirmar) {
  //     return;
  //   }

  //   try {
  //     await api.delete(`/${base}/${produto.id}`);

  //     await getProdutos();

  //     toast.success("Produto excluído com sucesso!");
  //   } catch (e: any) {
  //     console.error(e);

  //     toast.error(e.response?.data?.message ?? "Erro ao excluir produto.");
  //   }
  // }

  /* =====================================================
       HISTÓRICO
    ===================================================== */

  function historicoProduto(produto: TabelaProdutos) {
    console.log("Histórico do produto:", produto);

    /*
     * Aqui futuramente você pode:
     *
     * abrir um modal de histórico
     *
     * ou navegar:
     *
     * navigate(`/produtos/${produto.id}/historico`)
     */

    toast.info(`Histórico: ${produto.nome}`);
  }

  /* =====================================================
       USE EFFECT
    ===================================================== */

  useEffect(() => {
    getTipoUnidadeMedida();

    getCategorias();

    getProdutos();
  }, []);

  /* =====================================================
       COLUNAS
    ===================================================== */

  const colun: Column<TabelaProdutos>[] = [
    {
      key: "id",
      title: "Id",
    },

    {
      key: "nome",
      title: "Nome",
    },

    {
      key: "unidadeMedida",
      title: "Uni. Med.",

      render: (value) => {
        const uni = unidadeMedida.find((u) => u.id === value);

        return uni?.sigua ?? "-";
      },
    },

    {
      key: "categoria",
      title: "Categoria",

      render: (value) => {
        const cat = categorias.find((c) => c.id === value);

        return cat?.nome ?? "-";
      },
    },

    {
      key: "valorUnitario",
      title: "V. Unit.",

      render: (value) => {
        return Number(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },

    {
      key: "estoque",
      title: "Est.",
    },

    {
      key: "estoqueMinimo",
      title: "Est. Min.",
    },

    {
      key: "estoqueMaximo",
      title: "Est. Max.",
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

  /* =====================================================
       JSX
    ===================================================== */

  return (
    <Layout title="Produtos">
      <section>
        <HeaderTabela title="Produtos" onClick={abrirModal}>
          <Table columns={colun} data={dadosApi}>
            {(produto) => (
              <>
                {/* HISTÓRICO */}

                <button
                  type="button"
                  title="Histórico"
                  className="action-button"
                  onClick={() => historicoProduto(produto)}
                >
                  <History size={18} />
                </button>

                {/* EDITAR */}

                <button
                  type="button"
                  title="Editar"
                  className="action-button"
                  onClick={() => abrirProduto(produto)}
                >
                  <Pencil size={18} />
                </button>

                {/* EXCLUIR */}

                {/* <button
                  type="button"
                  title="Excluir"
                  className="action-button"
                  onClick={() => excluirProduto(produto)
                  }
                >
                  <Trash2 size={18} />
                </button> */}
              </>
            )}
          </Table>
        </HeaderTabela>

        {/* =================================================
                    MODAL
                ================================================= */}

        <Modal
          open={modalOpen}
          title={produtoEditando !== null ? "Editar Produto" : "Novo Produto"}
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
                placeholder="Nome do produto"
                onChange={(e) => alterarCampo("nome", e.target.value)}
              />
            </div>

            {/* CATEGORIA */}

            <div className="form-group">
              <label htmlFor="categoria">Categoria</label>

              <select
                id="categoria"
                value={formulario.categoria}
                onChange={(e) => alterarCampo("categoria", e.target.value)}
              >
                <option value="">Selecione uma categoria</option>

                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* UNIDADE */}

            <div className="form-group">
              <label htmlFor="unidadeMedida">Unidade de Medida</label>

              <select
                id="unidadeMedida"
                value={formulario.unidadeMedida}
                onChange={(e) => alterarCampo("unidadeMedida", e.target.value)}
              >
                <option value="">Selecione uma unidade</option>

                {unidadeMedida.map((unidade) => (
                  <option key={unidade.id} value={unidade.id}>
                    {unidade.sigua}
                  </option>
                ))}
              </select>
            </div>

            {/* VALOR */}

            <div className="form-group">
              <label htmlFor="valorUnitario">Valor Unitário</label>

              <input
                id="valorUnitario"
                type="number"
                min="0"
                step="0.01"
                value={formulario.valorUnitario}
                placeholder="0,00"
                onChange={(e) => alterarCampo("valorUnitario", e.target.value)}
              />
            </div>

            {/* ESTOQUE MÍNIMO */}

            <div className="form-group">
              <label htmlFor="estoqueMinimo">Estoque Mínimo</label>

              <input
                id="estoqueMinimo"
                type="number"
                min="0"
                value={formulario.estoqueMinimo}
                placeholder="0"
                onChange={(e) => alterarCampo("estoqueMinimo", e.target.value)}
              />
            </div>

            {/* ESTOQUE MÁXIMO */}

            <div className="form-group">
              <label htmlFor="estoqueMaximo">Estoque Máximo</label>

              <input
                id="estoqueMaximo"
                type="number"
                min="0"
                value={formulario.estoqueMaximo}
                placeholder="0"
                onChange={(e) => alterarCampo("estoqueMaximo", e.target.value)}
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
                onClick={salvarProduto}
              >
                {produtoEditando !== null ? "Salvar alterações" : "Adicionar"}
              </button>
            </div>
          </div>
        </Modal>
      </section>
    </Layout>
  );
}
