import { useEffect, useState } from "react";

import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";

import "./CategoriaProdutos.css";

import {
  listarCategoriasProduto,
  criarCategoriaProduto,
  atualizarCategoriaProduto,
  excluirCategoriaProduto,
} from "../../services/categoriaProdutoServices";

import type {
  CategoriaProdutoGet,
  CategoriaProdutoPost,
} from "../../types/categoriaType";

import { toast } from "react-toastify";

export default function CategoriaProdutos() {

  /*
   * =====================================================
   * ESTADOS
   * =====================================================
   */

  const [categorias, setCategorias] = useState<
    CategoriaProdutoGet[]
  >([]);

  const [modalAberto, setModalAberto] = useState(false);

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<CategoriaProdutoGet | null>(null);

  const [nome, setNome] = useState("");

  const [carregando, setCarregando] = useState(false);

  const [salvando, setSalvando] = useState(false);


  /*
   * =====================================================
   * BUSCAR CATEGORIAS
   * =====================================================
   */

  const getListaCategorias = async () => {

    try {

      setCarregando(true);

      const dados = await listarCategoriasProduto();

      setCategorias(dados);

    } catch (error) {

      console.error(
        "Erro ao buscar categorias:",
        error
      );

      toast.error(
        "Não foi possível carregar as categorias."
      );

    } finally {

      setCarregando(false);

    }
  };


  /*
   * =====================================================
   * CARREGAR AO ABRIR A PÁGINA
   * =====================================================
   */

  useEffect(() => {

    getListaCategorias();

  }, []);


  /*
   * =====================================================
   * ABRIR NOVA CATEGORIA
   * =====================================================
   */

  const abrirModal = () => {

    setCategoriaSelecionada(null);

    setNome("");

    setModalAberto(true);
  };


  /*
   * =====================================================
   * FECHAR MODAL
   * =====================================================
   */

  const fecharModal = () => {

    setModalAberto(false);

    setCategoriaSelecionada(null);

    setNome("");
  };


  /*
   * =====================================================
   * EDITAR
   * =====================================================
   */

  const editarCategoria = (
    categoria: CategoriaProdutoGet
  ) => {

    setCategoriaSelecionada(categoria);

    setNome(categoria.nome);

    setModalAberto(true);
  };


  /*
   * =====================================================
   * VISUALIZAR
   * =====================================================
   */

  const visualizarCategoria = (
    categoria: CategoriaProdutoGet
  ) => {

    console.log(
      "Visualizar categoria:",
      categoria
    );

  };


  /*
   * =====================================================
   * EXCLUIR
   * =====================================================
   */

  const excluirCategoria = async (
    categoria: CategoriaProdutoGet
  ) => {

    const confirmar = window.confirm(
      `Deseja excluir a categoria "${categoria.nome}"?`
    );

    if (!confirmar) {
      return;
    }

    try {

      await excluirCategoriaProduto(
        categoria.id
      );

      toast.success(
        "Categoria excluída com sucesso!"
      );

      await getListaCategorias();

    } catch (error) {

      console.error(
        "Erro ao excluir categoria:",
        error
      );

      toast.error(
        "Não foi possível excluir a categoria."
      );

    }
  };


  /*
   * =====================================================
   * SALVAR
   * =====================================================
   */

  const salvarCategoria = async () => {

    if (!nome.trim()) {

      toast.error(
        "Informe o nome da categoria."
      );

      return;
    }

    try {

      setSalvando(true);

      const dados: CategoriaProdutoPost = {
        nome: nome.trim(),
      };


      /*
       * ================================================
       * EDITAR
       * ================================================
       */

      if (categoriaSelecionada) {

        await atualizarCategoriaProduto(
          categoriaSelecionada.id,
          dados
        );

        toast.success(
          "Categoria atualizada com sucesso!"
        );

      }


      /*
       * ================================================
       * NOVA CATEGORIA
       * ================================================
       */

      else {

        await criarCategoriaProduto(
          dados
        );

        toast.success(
          "Categoria criada com sucesso!"
        );

      }


      /*
       * ================================================
       * ATUALIZAR LISTA
       * ================================================
       */

      await getListaCategorias();

      fecharModal();

    } catch (error) {

      console.error(
        "Erro ao salvar categoria:",
        error
      );

      toast.error(
        "Não foi possível salvar a categoria."
      );

    } finally {

      setSalvando(false);

    }
  };


  /*
   * =====================================================
   * COLUNAS
   * =====================================================
   */

  const columns = [

    {
      key: "id",
      label: "#",
      width: "60px",
      align: "center" as const,
    },

    {
      key: "nome",
      label: "Nome",
    },

    {
      key: "ativo",
      label: "Status",

      render: (value: unknown) => {

        const ativo = Boolean(value);

        return (
          <span
            className={
              ativo
                ? "status-active"
                : "status-inactive"
            }
          >
            {ativo ? "Ativa" : "Inativa"}
          </span>
        );
      },
    },

    {
      key: "dataCriacao",
      label: "Data de Criação",

      render: (value: unknown) => {

        if (!value) {
          return "-";
        }

        return new Date(
          String(value)
        ).toLocaleString("pt-BR");
      },
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

      onClick: visualizarCategoria,
    },

    {
      label: "Editar",

      variant: "primary" as const,

      onClick: editarCategoria,
    },

    {
      label: "Excluir",

      variant: "danger" as const,

      onClick: excluirCategoria,
    },

  ];


  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (

    <section className="categoria-page">

      {/* =================================================
          CABEÇALHO
         ================================================= */}

      <div className="page-header">

        <div>

          <h2>
            Categorias de Produtos
          </h2>

          <p>
            Gerencie as categorias dos seus produtos.
          </p>

        </div>

        <button
          type="button"
          className="button-primary"
          onClick={abrirModal}
        >
          + Nova Categoria
        </button>

      </div>


      {/* =================================================
          TABELA
         ================================================= */}

      <Table
        columns={columns}
        data={categorias}
        actions={actions}
        rowKey="id"
      />


      {/* =================================================
          MODAL
         ================================================= */}

      <Modal
        isOpen={modalAberto}
        onClose={fecharModal}
        onOpenChange={setModalAberto}
        title={
          categoriaSelecionada
            ? "Editar Categoria"
            : "Nova Categoria"
        }
        width="650px"

        footer={

          <>

            <button
              type="button"
              className="button-secondary"
              onClick={fecharModal}
              disabled={salvando}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="button-primary"
              onClick={salvarCategoria}
              disabled={salvando}
            >
              {salvando
                ? "Salvando..."
                : categoriaSelecionada
                  ? "Salvar Alterações"
                  : "Salvar Categoria"
              }
            </button>

          </>

        }
      >

        <div className="categoria-form">

          {/* NOME */}

          <div className="form-group">

            <label htmlFor="nome">

              Nome da Categoria

              <span>*</span>

            </label>

            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(event) =>
                setNome(event.target.value)
              }
              placeholder="Ex.: Ferramentas"
              disabled={salvando}
            />

          </div>

        </div>

      </Modal>

    </section>
  );
}