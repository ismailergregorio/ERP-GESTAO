import { useEffect, useState } from "react";

import Modal from "../../components/Modal/Modal";

import Table from "../../components/Table/Table";

import type { TableColumn, TableAction } from "../../components/Table/Table";

import type { Produto } from "../../types/Produto";

import type { Categoria, CategoriaProdutoGet } from "../../types/categoriaType";

import type { UnidadeMedida } from "../../types/UnidadeMedida";

import {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  excluirProduto as excluirProdutoApi,
} from "../../services/produtoService";

import { listarUnidadesMedida } from "../../services/unidadeMedidaService";

import "./Produtos.css";
import { listarCategoriasProduto } from "../../services/categoriaProdutoServices";

export default function Produtos() {
  /*
   * =====================================================
   * ESTADOS
   * =====================================================
   */

  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [categorias, setCategorias] = useState<CategoriaProdutoGet[]>([]);

  const [unidadesMedida, setUnidadesMedida] = useState<UnidadeMedida[]>([]);

  const [loading, setLoading] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);

  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null,
  );

  const [modoVisualizacao, setModoVisualizacao] = useState(false);

  /*
   * =====================================================
   * FORMULÁRIO
   * =====================================================
   */

  const [nome, setNome] = useState("");

  const [unidadeMedidaId, setUnidadeMedidaId] = useState<number | "">("");

  const [categoriaId, setCategoriaId] = useState<number | "">("");

  const [estoque, setEstoque] = useState<number | "">("");

  const [estoqueMinimo, setEstoqueMinimo] = useState<number | "">("");

  const [estoqueMaximo, setEstoqueMaximo] = useState<number | "">("");

  const [valorUnitario, setValorUnitario] = useState<number | "">("");

  /*
   * =====================================================
   * CARREGAR DADOS
   * =====================================================
   */

  const carregarDados = async () => {
    try {
      setLoading(true);

      const [produtosData, categoriasData, unidadesData] = await Promise.all([
        listarProdutos(),

        listarCategoriasProduto(),

        listarUnidadesMedida(),
      ]);

      setProdutos(produtosData);

      setCategorias(categoriasData);

      setUnidadesMedida(unidadesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);

      alert("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * CARREGAR AO ABRIR
   * =====================================================
   */

  useEffect(() => {
    carregarDados();
  }, []);

  /*
   * =====================================================
   * LIMPAR FORMULÁRIO
   * =====================================================
   */

  const limparFormulario = () => {
    setNome("");

    setUnidadeMedidaId("");

    setCategoriaId("");

    setEstoque("");

    setEstoqueMinimo("");

    setEstoqueMaximo("");

    setValorUnitario("");

    setProdutoSelecionado(null);

    setModoVisualizacao(false);
  };

  /*
   * =====================================================
   * ABRIR NOVO PRODUTO
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
   * EDITAR PRODUTO
   * =====================================================
   */

  const editarProduto = (produto: Produto) => {
    setProdutoSelecionado(produto);

    setNome(produto.nome);

    setUnidadeMedidaId(produto.unidadeMedidaId);

    setCategoriaId(produto.categoriaId);

    setEstoque(produto.estoque);

    setEstoqueMinimo(produto.estoqueMinimo);

    setEstoqueMaximo(produto.estoqueMaximo);

    setValorUnitario(produto.valorUnitario);

    setModoVisualizacao(false);

    setModalAberto(true);
  };

  /*
   * =====================================================
   * VISUALIZAR PRODUTO
   * =====================================================
   */

  const visualizarProduto = async (produto: Produto) => {
    try {
      setLoading(true);

      const dados = await buscarProdutoPorId(produto.id);

      setProdutoSelecionado(dados);

      setNome(dados.nome);

      setUnidadeMedidaId(dados.unidadeMedidaId);

      setCategoriaId(dados.categoriaId);

      setEstoque(dados.estoque);

      setEstoqueMinimo(dados.estoqueMinimo);

      setEstoqueMaximo(dados.estoqueMaximo);

      setValorUnitario(dados.valorUnitario);

      setModoVisualizacao(true);

      setModalAberto(true);
    } catch (error) {
      console.error("Erro ao buscar produto:", error);

      alert("Não foi possível carregar o produto.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * EXCLUIR PRODUTO
   * =====================================================
   */

  const excluirProduto = async (produto: Produto) => {
    const confirmar = window.confirm(
      `Deseja excluir o produto "${produto.nome}"?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      setLoading(true);

      await excluirProdutoApi(produto.id);

      setProdutos((produtos) =>
        produtos.filter((item) => item.id !== produto.id),
      );
    } catch (error) {
      console.error("Erro ao excluir produto:", error);

      alert("Não foi possível excluir o produto.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * SALVAR PRODUTO
   * =====================================================
   */

  const salvarProduto = async () => {
    /*
     * VALIDAÇÕES
     */

    if (!nome.trim()) {
      alert("Informe o nome do produto.");

      return;
    }

    if (unidadeMedidaId === "") {
      alert("Selecione a unidade de medida.");

      return;
    }

    if (categoriaId === "") {
      alert("Selecione a categoria.");

      return;
    }

    if (estoque === "") {
      alert("Informe o estoque.");

      return;
    }

    if (estoqueMinimo === "") {
      alert("Informe o estoque mínimo.");

      return;
    }

    if (estoqueMaximo === "") {
      alert("Informe o estoque máximo.");

      return;
    }

    if (valorUnitario === "") {
      alert("Informe o valor unitário.");

      return;
    }

    if (Number(estoqueMinimo) > Number(estoqueMaximo)) {
      alert("O estoque mínimo não pode ser maior que o estoque máximo.");

      return;
    }

    try {
      setLoading(true);

      const dados = {
        nome: nome.trim(),

        unidadeMedidaId: Number(unidadeMedidaId),

        categoriaId: Number(categoriaId),

        estoque: Number(estoque),

        estoqueMinimo: Number(estoqueMinimo),

        estoqueMaximo: Number(estoqueMaximo),

        valorUnitario: Number(valorUnitario),
      };

      /*
       * EDITAR
       */

      if (produtoSelecionado) {
        const produtoAtualizado = await atualizarProduto(
          produtoSelecionado.id,
          dados,
        );

        setProdutos((produtos) =>
          produtos.map((produto) =>
            produto.id === produtoAtualizado.id ? produtoAtualizado : produto,
          ),
        );
      } else {

      /*
       * NOVO
       */
        const novoProduto = await criarProduto(dados);

        setProdutos((produtos) => [...produtos, novoProduto]);
      }

      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);

      alert("Não foi possível salvar o produto.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * COLUNAS
   * =====================================================
   */

  const columns: TableColumn<Produto>[] = [
    {
      key: "id",

      label: "#",

      width: "60px",

      align: "center",
    },

    {
      key: "nome",

      label: "Produto",

      width: "220px",
    },

    {
      key: "categoria",

      label: "Categoria",
    },

    {
      key: "unidadeMedida",

      label: "Unidade",
    },

    {
      key: "siglaUnidadeMedida",

      label: "Sigla",

      width: "80px",

      align: "center",
    },

    {
      key: "estoque",

      label: "Estoque",

      align: "center",

      render: (value, produto) => (
        <span
          className={
            produto.estoque <= produto.estoqueMinimo
              ? "estoque-baixo"
              : "estoque-normal"
          }
        >
          {String(value)}
        </span>
      ),
    },

    {
      key: "valorUnitario",

      label: "Valor Unitário",

      align: "right",

      render: (value) =>
        Number(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
    },

    {
      key: "ativo",

      label: "Status",

      align: "center",

      render: (value) => (
        <span className={value ? "status-active" : "status-inactive"}>
          {value ? "Ativo" : "Inativo"}
        </span>
      ),
    },
  ];

  /*
   * =====================================================
   * AÇÕES
   * =====================================================
   */

  const actions: TableAction<Produto>[] = [
    {
      label: "Visualizar",

      variant: "secondary",

      onClick: visualizarProduto,
    },

    {
      label: "Editar",

      variant: "primary",

      onClick: editarProduto,
    },

    {
      label: "Excluir",

      variant: "danger",

      onClick: excluirProduto,
    },
  ];

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <section className="produto-page">
      {/* =================================================
          CABEÇALHO
         ================================================= */}

      <div className="page-header">
        <div>
          <h2>Produtos</h2>

          <p>Gerencie os produtos, categorias, estoque e valores do sistema.</p>
        </div>

        <button type="button" className="button-primary" onClick={abrirModal}>
          + Novo Produto
        </button>
      </div>

      {/* =================================================
          TABELA
         ================================================= */}

      <Table
        columns={columns}
        data={produtos}
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
            ? "Visualizar Produto"
            : produtoSelecionado
              ? "Editar Produto"
              : "Novo Produto"
        }
        width="750px"
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
                onClick={salvarProduto}
                disabled={loading}
              >
                {loading
                  ? "Salvando..."
                  : produtoSelecionado
                    ? "Salvar Alterações"
                    : "Salvar Produto"}
              </button>
            </>
          )
        }
      >
        <div className="produto-form">
          {/* =================================================
              DADOS PRINCIPAIS
             ================================================= */}

          <div className="form-section">
            <h3>Dados do Produto</h3>

            <div className="form-group">
              <label htmlFor="nome">
                Nome do Produto
                {!modoVisualizacao && <span>*</span>}
              </label>

              <input
                id="nome"
                type="text"
                value={nome}
                disabled={modoVisualizacao}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Ex.: Arroz 5kg"
              />
            </div>

            <div className="form-grid">
              {/* CATEGORIA */}

              <div className="form-group">
                <label htmlFor="categoria">
                  Categoria
                  {!modoVisualizacao && <span>*</span>}
                </label>

                <select
                  id="categoria"
                  value={categoriaId}
                  disabled={modoVisualizacao}
                  onChange={(event) =>
                    setCategoriaId(
                      event.target.value ? Number(event.target.value) : "",
                    )
                  }
                >
                  <option value="">Selecione...</option>

                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* UNIDADE */}

              <div className="form-group">
                <label htmlFor="unidade">
                  Unidade de Medida
                  {!modoVisualizacao && <span>*</span>}
                </label>

                <select
                  id="unidade"
                  value={unidadeMedidaId}
                  disabled={modoVisualizacao}
                  onChange={(event) =>
                    setUnidadeMedidaId(
                      event.target.value ? Number(event.target.value) : "",
                    )
                  }
                >
                  <option value="">Selecione...</option>

                  {unidadesMedida.map((unidade) => (
                    <option key={unidade.id} value={unidade.id}>
                      {unidade.nome}
                      {" ("}
                      {unidade.sigla}
                      {")"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* =================================================
              ESTOQUE
             ================================================= */}

          <div className="form-section">
            <h3>Controle de Estoque</h3>

            <div className="form-grid">
              {/* ESTOQUE */}

              <div className="form-group">
                <label htmlFor="estoque">
                  Estoque Atual
                  {!modoVisualizacao && <span>*</span>}
                </label>

                <input
                  id="estoque"
                  type="number"
                  min="0"
                  value={estoque}
                  disabled={modoVisualizacao}
                  onChange={(event) =>
                    setEstoque(
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value),
                    )
                  }
                />
              </div>

              {/* ESTOQUE MINIMO */}

              <div className="form-group">
                <label htmlFor="estoqueMinimo">
                  Estoque Mínimo
                  {!modoVisualizacao && <span>*</span>}
                </label>

                <input
                  id="estoqueMinimo"
                  type="number"
                  min="0"
                  value={estoqueMinimo}
                  disabled={modoVisualizacao}
                  onChange={(event) =>
                    setEstoqueMinimo(
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value),
                    )
                  }
                />
              </div>

              {/* ESTOQUE MAXIMO */}

              <div className="form-group">
                <label htmlFor="estoqueMaximo">
                  Estoque Máximo
                  {!modoVisualizacao && <span>*</span>}
                </label>

                <input
                  id="estoqueMaximo"
                  type="number"
                  min="0"
                  value={estoqueMaximo}
                  disabled={modoVisualizacao}
                  onChange={(event) =>
                    setEstoqueMaximo(
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value),
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* =================================================
              VALOR
             ================================================= */}

          <div className="form-section">
            <h3>Valor</h3>

            <div className="form-group">
              <label htmlFor="valorUnitario">
                Valor Unitário
                {!modoVisualizacao && <span>*</span>}
              </label>

              <div className="money-input">
                <span>R$</span>

                <input
                  id="valorUnitario"
                  type="number"
                  min="0"
                  step="0.01"
                  value={valorUnitario}
                  disabled={modoVisualizacao}
                  onChange={(event) =>
                    setValorUnitario(
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value),
                    )
                  }
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>

          {/* =================================================
              INFORMAÇÕES
             ================================================= */}

          {modoVisualizacao && produtoSelecionado && (
            <div className="produto-info">
              <div>
                <span>Status</span>

                <strong
                  className={
                    produtoSelecionado.ativo
                      ? "status-active"
                      : "status-inactive"
                  }
                >
                  {produtoSelecionado.ativo ? "Ativo" : "Inativo"}
                </strong>
              </div>

              <div>
                <span>Criado em</span>

                <strong>{formatarData(produtoSelecionado.dataCriacao)}</strong>
              </div>

              <div>
                <span>Última atualização</span>

                <strong>
                  {produtoSelecionado.dataUpdate
                    ? formatarData(produtoSelecionado.dataUpdate)
                    : "Nunca atualizado"}
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
