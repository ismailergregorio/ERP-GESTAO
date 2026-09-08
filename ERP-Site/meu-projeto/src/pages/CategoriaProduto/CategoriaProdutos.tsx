import { useState } from "react";

import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";

import "./CategoriaProdutos.css";

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  produtos: number;
  status: "Ativa" | "Inativa";
  dataCriacao: string;
}

const categoriasIniciais: Categoria[] = [
  {
    id: 1,
    nome: "Ferramentas",
    descricao: "Ferramentas manuais e elétricas",
    produtos: 124,
    status: "Ativa",
    dataCriacao: "10/08/2026 14:32",
  },
  {
    id: 2,
    nome: "Eletrônicos",
    descricao: "Equipamentos e componentes eletrônicos",
    produtos: 98,
    status: "Ativa",
    dataCriacao: "12/08/2026 09:15",
  },
  {
    id: 3,
    nome: "Construção",
    descricao: "Materiais para construção civil",
    produtos: 87,
    status: "Ativa",
    dataCriacao: "15/08/2026 11:20",
  },
  {
    id: 4,
    nome: "Móveis",
    descricao: "Móveis para escritório e residencial",
    produtos: 53,
    status: "Ativa",
    dataCriacao: "20/08/2026 16:45",
  },
  {
    id: 5,
    nome: "Automotivo",
    descricao: "Peças e acessórios automotivos",
    produtos: 76,
    status: "Ativa",
    dataCriacao: "22/08/2026 10:12",
  },
  {
    id: 6,
    nome: "Limpeza",
    descricao: "Produtos de limpeza e higienização",
    produtos: 41,
    status: "Inativa",
    dataCriacao: "25/08/2026 08:33",
  },
];

export default function CategoriaProdutos() {

  /*
   * =====================================================
   * ESTADOS
   * =====================================================
   */

  const [categorias, setCategorias] =
    useState<Categoria[]>(categoriasIniciais);

  const [modalAberto, setModalAberto] =
    useState(false);

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<Categoria | null>(null);

  const [nome, setNome] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  const [status, setStatus] =
    useState<"Ativa" | "Inativa">("Ativa");


  /*
   * =====================================================
   * ABRIR NOVA CATEGORIA
   * =====================================================
   */

  const abrirModal = () => {

    setCategoriaSelecionada(null);

    setNome("");

    setDescricao("");

    setStatus("Ativa");

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

  };


  /*
   * =====================================================
   * EDITAR
   * =====================================================
   */

  const editarCategoria = (
    categoria: Categoria
  ) => {

    setCategoriaSelecionada(categoria);

    setNome(categoria.nome);

    setDescricao(categoria.descricao);

    setStatus(categoria.status);

    setModalAberto(true);

  };


  /*
   * =====================================================
   * VISUALIZAR
   * =====================================================
   */

  const visualizarCategoria = (
    categoria: Categoria
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

  const excluirCategoria = (
    categoria: Categoria
  ) => {

    const confirmar =
      window.confirm(
        `Deseja excluir a categoria "${categoria.nome}"?`
      );

    if (!confirmar) {
      return;
    }

    setCategorias(
      categorias.filter(
        item => item.id !== categoria.id
      )
    );

  };


  /*
   * =====================================================
   * SALVAR
   * =====================================================
   */

  const salvarCategoria = () => {

    if (!nome.trim()) {

      alert(
        "Informe o nome da categoria."
      );

      return;
    }


    if (categoriaSelecionada) {

      /*
       * EDITAR CATEGORIA
       */

      setCategorias(
        categorias.map(categoria =>

          categoria.id ===
          categoriaSelecionada.id

            ? {
                ...categoria,

                nome: nome.trim(),

                descricao:
                  descricao.trim(),

                status,
              }

            : categoria
        )
      );

    } else {

      /*
       * NOVA CATEGORIA
       */

      const novaCategoria: Categoria = {

        id:
          Math.max(
            0,
            ...categorias.map(
              categoria => categoria.id
            )
          ) + 1,

        nome: nome.trim(),

        descricao:
          descricao.trim(),

        produtos: 0,

        status,

        dataCriacao:
          new Date().toLocaleString(
            "pt-BR"
          ),

      };


      setCategorias([
        ...categorias,
        novaCategoria,
      ]);

    }


    fecharModal();

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
      key: "descricao",
      label: "Descrição",
    },

    {
      key: "produtos",
      label: "Produtos",
      align: "center" as const,
    },

    {
      key: "status",
      label: "Status",

      render: (
        value: unknown
      ) => (

        <span
          className={
            value === "Ativa"
              ? "status-active"
              : "status-inactive"
          }
        >
          {String(value)}
        </span>

      ),
    },

    {
      key: "dataCriacao",
      label: "Data de Criação",
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

      variant:
        "secondary" as const,

      onClick:
        visualizarCategoria,
    },

    {
      label: "Editar",

      variant:
        "primary" as const,

      onClick:
        editarCategoria,
    },

    {
      label: "Excluir",

      variant:
        "danger" as const,

      onClick:
        excluirCategoria,
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
            Gerencie as categorias dos
            seus produtos.
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
            >
              Cancelar
            </button>


            <button
              type="button"
              className="button-primary"
              onClick={salvarCategoria}
            >
              {categoriaSelecionada
                ? "Salvar Alterações"
                : "Salvar Categoria"}
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
              onChange={event =>
                setNome(event.target.value)
              }
              placeholder="Ex.: Ferramentas"
            />

          </div>


          {/* DESCRIÇÃO */}

          <div className="form-group">

            <label htmlFor="descricao">
              Descrição
            </label>

            <textarea
              id="descricao"
              value={descricao}
              onChange={event =>
                setDescricao(
                  event.target.value
                )
              }
              placeholder="Descreva a categoria..."
              rows={4}
            />

          </div>


          {/* STATUS */}

          <div className="form-group">

            <label htmlFor="status">
              Status
              <span>*</span>
            </label>

            <select
              id="status"
              value={status}
              onChange={event =>
                setStatus(
                  event.target.value as
                    | "Ativa"
                    | "Inativa"
                )
              }
            >

              <option value="Ativa">
                Ativa
              </option>

              <option value="Inativa">
                Inativa
              </option>

            </select>

          </div>


        </div>

      </Modal>

    </section>
  );
}