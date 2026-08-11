import Layout from "../Layout/LayoutPages";
import { useEffect, useState } from "react";

import { Plus, Trash2, Pencil } from "lucide-react";

import { toast } from "react-toastify";

import HeaderTabela from "../Componete/HeaderTabela/HeaderTabela";
import Table from "../Componete/Table/Table";
import Modal from "../Componete/Modal/Modal";

import type { Column } from "../Componete/Table/Table.types";

import api from "../Services/Api";
import covertData from "../Utils/ConverteDate";

// import "./EntradaEstoque.css";

interface Entrada {
  id: number;
  notaFiscal: number;
  fornecedor_id: number;
  tipoEntrada_id: number;
  observacao: string;
  dataCriacao: string;
}

interface Fornecedor {
  id: number;
  nome: string;
}

interface TipoEntrada {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  valorUnitario: number;
}

interface ItemEntrada {
  id: number;
  entrada_id: number;
  produto_id: number;
  produtoNome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

/* =====================================================
   INTERFACES
===================================================== */

interface Entrada {
  id: number;

  notaFiscal: number;

  fornecedor_id: number;

  tipoEntrada_id: number;

  observacao: string;

  dataCriacao: string;
}

interface Fornecedor {
  id: number;

  nome: string;
}

interface TipoEntrada {
  id: number;

  nome: string;
}

interface Produto {
  id: number;

  nome: string;

  valorUnitario: number;
}

interface ItemEntrada {
  id: number;

  entrada_id: number;

  produto_id: number;

  produtoNome: string;

  quantidade: number;

  valorUnitario: number;

  valorTotal: number;
}

/* =====================================================
   FORMULÁRIO DA ENTRADA
===================================================== */

interface EntradaForm {
  notaFiscal: string;

  fornecedor_id: number | "";

  tipoEntrada_id: number | "";

  observacao: string;
}

const entradaInicial: EntradaForm = {
  notaFiscal: "",

  fornecedor_id: "",

  tipoEntrada_id: "",

  observacao: "",
};

export default function EntradaEstoque() {
  const base = "entradas";

  const baseItens = "entradas-itens";

  const baseFornecedores = "fornecedores";

  const baseProdutos = "produtos";

  const baseTiposEntrada = "tipos-entrada";

  /* =====================================================
       MODAL
    ===================================================== */

  const [modalOpen, setModalOpen] = useState(false);

  /*
   * 1 = criação da entrada
   * 2 = produtos
   */
  const [etapa, setEtapa] = useState<1 | 2>(1);

  /* =====================================================
       DADOS
    ===================================================== */

  const [entradas, setEntradas] = useState<Entrada[]>([]);

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [tiposEntrada, setTiposEntrada] = useState<TipoEntrada[]>([]);

  /* =====================================================
       ENTRADA ATUAL
    ===================================================== */

  const [entradaCriada, setEntradaCriada] = useState<Entrada | null>(null);

  /* =====================================================
       FORMULÁRIO
    ===================================================== */

  const [formulario, setFormulario] = useState<EntradaForm>(entradaInicial);

  /* =====================================================
       ITEM
    ===================================================== */

  const [produtoSelecionado, setProdutoSelecionado] = useState<number | "">("");

  const [quantidade, setQuantidade] = useState<number | "">("");

  const [valorUnitario, setValorUnitario] = useState<number | "">("");

  const [itens, setItens] = useState<ItemEntrada[]>([]);

  /* =====================================================
       BUSCAR ENTRADAS
    ===================================================== */

  async function getEntradas() {
    try {
      const resposta = await api.get(`/${base}`);

      setEntradas(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao buscar entradas.");
    }
  }

  /* =====================================================
       BUSCAR FORNECEDORES
    ===================================================== */

  async function getFornecedores() {
    try {
      const resposta = await api.get(`/${baseFornecedores}`);

      setFornecedores(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao buscar fornecedores.");
    }
  }

  /* =====================================================
       BUSCAR PRODUTOS
    ===================================================== */

  async function getProdutos() {
    try {
      const resposta = await api.get(`/${baseProdutos}`);

      setProdutos(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao buscar produtos.");
    }
  }

  /* =====================================================
       BUSCAR TIPOS DE ENTRADA
    ===================================================== */

  async function getTiposEntrada() {
    try {
      const resposta = await api.get(`/${baseTiposEntrada}`);

      setTiposEntrada(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao buscar tipos de entrada.",
      );
    }
  }

  /* =====================================================
       ABRIR MODAL
    ===================================================== */

  function abrirModal() {
    setEtapa(1);

    setEntradaCriada(null);

    setFormulario(entradaInicial);

    setProdutoSelecionado("");

    setQuantidade("");

    setValorUnitario("");

    setItens([]);

    setModalOpen(true);
  }

  /* =====================================================
       FECHAR MODAL
    ===================================================== */

  function fecharModal() {
    setModalOpen(false);

    setEtapa(1);

    setEntradaCriada(null);

    setFormulario(entradaInicial);

    setProdutoSelecionado("");

    setQuantidade("");

    setValorUnitario("");

    setItens([]);
  }

  /* =====================================================
       ALTERAR FORMULÁRIO
    ===================================================== */

  function alterarEntrada(campo: keyof EntradaForm, valor: string) {
    setFormulario((prev) => ({
      ...prev,

      [campo]:
        campo === "notaFiscal" || campo === "observacao"
          ? valor
          : valor === ""
            ? ""
            : Number(valor),
    }));
  }

  /* =====================================================
       SELECIONAR PRODUTO
    ===================================================== */

  function selecionarProduto(id: number) {
    setProdutoSelecionado(id);

    const produto = produtos.find((item) => item.id === id);

    if (produto) {
      setValorUnitario(produto.valorUnitario);
    }
  }

  /* =====================================================
       CRIAR ENTRADA
    ===================================================== */

  async function criarEntrada() {
    if (!formulario.notaFiscal.trim()) {
      toast.warning("Informe o número da nota fiscal.");

      return;
    }

    if (formulario.fornecedor_id === "") {
      toast.warning("Selecione um fornecedor.");

      return;
    }

    if (formulario.tipoEntrada_id === "") {
      toast.warning("Selecione o tipo de entrada.");

      return;
    }

    try {
      const resposta = await api.post(`/${base}`, {
        notaFiscal: Number(formulario.notaFiscal),

        fornecedor_id: formulario.fornecedor_id,

        tipoEntrada_id: formulario.tipoEntrada_id,

        observacao: formulario.observacao,
      });

      /*
       * Guarda a entrada criada.
       *
       * O ID será usado para
       * cadastrar os produtos.
       */

      setEntradaCriada(resposta.data);

      setEtapa(2);

      await getEntradas();

      toast.success("Entrada criada. Agora adicione os produtos.");
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao criar entrada.");
    }
  }

  /* =====================================================
       ADICIONAR PRODUTO
    ===================================================== */

  async function adicionarProduto() {
    if (entradaCriada === null) {
      toast.error("Nenhuma entrada foi criada.");

      return;
    }

    if (produtoSelecionado === "") {
      toast.warning("Selecione um produto.");

      return;
    }

    if (quantidade === "" || quantidade <= 0) {
      toast.warning("Informe uma quantidade válida.");

      return;
    }

    if (valorUnitario === "" || valorUnitario < 0) {
      toast.warning("Informe o valor unitário.");

      return;
    }

    const produto = produtos.find((item) => item.id === produtoSelecionado);

    if (!produto) {
      return;
    }

    const valorTotal = Number(quantidade) * Number(valorUnitario);

    try {
      const resposta = await api.post(`/${baseItens}`, {
        entrada_id: entradaCriada.id,

        produto_id: produto.id,

        quantidade: Number(quantidade),

        valorUnitario: Number(valorUnitario),

        valorTotal: valorTotal,
      });

      const novoItem: ItemEntrada = {
        id: resposta.data?.id ?? Date.now(),

        entrada_id: entradaCriada.id,

        produto_id: produto.id,

        produtoNome: produto.nome,

        quantidade: Number(quantidade),

        valorUnitario: Number(valorUnitario),

        valorTotal: valorTotal,
      };

      setItens((prev) => [...prev, novoItem]);

      /*
       * Limpa os campos
       */

      setProdutoSelecionado("");

      setQuantidade("");

      setValorUnitario("");

      toast.success("Produto adicionado à entrada.");
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao adicionar produto.");
    }
  }

  /* =====================================================
       REMOVER PRODUTO
    ===================================================== */

  async function removerProduto(item: ItemEntrada) {
    try {
      await api.delete(`/${baseItens}/${item.id}`);

      setItens((prev) => prev.filter((produto) => produto.id !== item.id));

      toast.success("Produto removido da entrada.");
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao remover produto.");
    }
  }

  /* =====================================================
       FINALIZAR
    ===================================================== */

  function finalizarEntrada() {
    if (itens.length === 0) {
      toast.warning("Adicione pelo menos um produto.");

      return;
    }

    toast.success("Entrada finalizada com sucesso!");

    fecharModal();
  }

  /* =====================================================
       COLUNAS DAS ENTRADAS
    ===================================================== */

  const colunas: Column<Entrada>[] = [
    {
      key: "id",

      title: "Id",

      width: "70px",

      align: "center",
    },

    {
      key: "notaFiscal",

      title: "Nota Fiscal",
    },

    {
      key: "fornecedor_id",

      title: "Fornecedor",

      render: (value) => {
        const fornecedor = fornecedores.find((item) => item.id === value);

        return fornecedor?.nome ?? "-";
      },
    },

    {
      key: "tipoEntrada_id",

      title: "Tipo",

      render: (value) => {
        const tipo = tiposEntrada.find((item) => item.id === value);

        return tipo?.nome ?? "-";
      },
    },

    {
      key: "observacao",

      title: "Observação",
    },

    {
      key: "dataCriacao",

      title: "Data Criação",

      render: (value) => {
        return value ? covertData(value) : "-";
      },
    },
  ];

  /* =====================================================
       EFFECT
    ===================================================== */

  useEffect(() => {
    getEntradas();

    getFornecedores();

    getProdutos();

    getTiposEntrada();
  }, []);

  /* =====================================================
       TOTAL DA ENTRADA
    ===================================================== */

  const totalEntrada = itens.reduce(
    (total, item) => total + item.valorTotal,
    0,
  );

  return (
    <Layout title="Entrada de Estoque">
      <section>
        <HeaderTabela title="Entradas" onClick={abrirModal}>
          <Table columns={colunas} data={entradas} />
        </HeaderTabela>

        {/* =================================================
                    MODAL
                ================================================= */}

        <Modal
          open={modalOpen}
          title={
            etapa === 1
              ? "Nova Entrada"
              : `Produtos da Entrada #${entradaCriada?.id}`
          }
          onClose={fecharModal}
        >
          {/* =================================================
                        ETAPA 1
                    ================================================= */}

          {etapa === 1 && (
            <div className="form-modal">
              {/* NOTA */}

              <div className="form-group">
                <label htmlFor="notaFiscal">Nota Fiscal</label>

                <input
                  id="notaFiscal"
                  type="number"
                  value={formulario.notaFiscal}
                  placeholder="Número da nota fiscal"
                  onChange={(e) => alterarEntrada("notaFiscal", e.target.value)}
                />
              </div>

              {/* FORNECEDOR */}

              <div className="form-group">
                <label htmlFor="fornecedor">Fornecedor</label>

                <select
                  id="fornecedor"
                  value={formulario.fornecedor_id}
                  onChange={(e) =>
                    alterarEntrada("fornecedor_id", e.target.value)
                  }
                >
                  <option value="">Selecione um fornecedor</option>

                  {fornecedores.map((fornecedor) => (
                    <option key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* TIPO */}

              <div className="form-group">
                <label htmlFor="tipoEntrada">Tipo de Entrada</label>

                <select
                  id="tipoEntrada"
                  value={formulario.tipoEntrada_id}
                  onChange={(e) =>
                    alterarEntrada("tipoEntrada_id", e.target.value)
                  }
                >
                  <option value="">Selecione o tipo</option>

                  {tiposEntrada.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* OBSERVAÇÃO */}

              <div className="form-group">
                <label htmlFor="observacao">Observação</label>

                <textarea
                  id="observacao"
                  value={formulario.observacao}
                  placeholder="Observação da entrada"
                  onChange={(e) => alterarEntrada("observacao", e.target.value)}
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
                  onClick={criarEntrada}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* =================================================
                        ETAPA 2
                    ================================================= */}

          {etapa === 2 && (
            <div className="form-modal">
              {/* PRODUTO */}

              <div className="form-group">
                <label htmlFor="produto">Produto</label>

                <select
                  id="produto"
                  value={produtoSelecionado}
                  onChange={(e) => selecionarProduto(Number(e.target.value))}
                >
                  <option value="">Selecione um produto</option>

                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* QUANTIDADE */}

              <div className="form-group">
                <label htmlFor="quantidade">Quantidade</label>

                <input
                  id="quantidade"
                  type="number"
                  min="1"
                  value={quantidade}
                  placeholder="Quantidade"
                  onChange={(e) =>
                    setQuantidade(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
              </div>

              {/* VALOR */}

              <div className="form-group">
                <label htmlFor="valorUnitario">Valor Unitário</label>

                <input
                  id="valorUnitario"
                  type="number"
                  min="0"
                  step="0.01"
                  value={valorUnitario}
                  placeholder="0,00"
                  onChange={(e) =>
                    setValorUnitario(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
              </div>

              {/* ADICIONAR */}

              <button
                type="button"
                className="btn-primary btn-adicionar"
                onClick={adicionarProduto}
              >
                <Plus size={18} />
                Adicionar Produto
              </button>

              {/* =================================================
                                PRODUTOS ADICIONADOS
                            ================================================= */}

              <div className="itens-entrada">
                <h3>Produtos adicionados</h3>

                {itens.length === 0 ? (
                  <div className="itens-vazio">Nenhum produto adicionado.</div>
                ) : (
                  <div className="itens-lista">
                    {itens.map((item) => (
                      <div className="item-entrada" key={item.id}>
                        <div>
                          <strong>{item.produtoNome}</strong>

                          <span>
                            {item.quantidade}
                            {" x "}

                            {item.valorUnitario.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </div>

                        <div className="item-direita">
                          <strong>
                            {item.valorTotal.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </strong>

                          <button
                            type="button"
                            title="Remover"
                            className="action-button"
                            onClick={() => removerProduto(item)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TOTAL */}

              <div className="entrada-total-modal">
                <span>Total da Entrada</span>

                <strong>
                  {totalEntrada.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>
              </div>

              {/* BOTÕES */}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEtapa(1)}
                >
                  Voltar
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={finalizarEntrada}
                >
                  Finalizar Entrada
                </button>
              </div>
            </div>
          )}
        </Modal>
      </section>
    </Layout>
  );
}
