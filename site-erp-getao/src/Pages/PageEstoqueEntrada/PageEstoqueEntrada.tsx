import Layout from "../../Layout/LayoutPages";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { Eye, Plus, Trash2 } from "lucide-react";

import HeaderTabela from "../../Componete/HeaderTabela/HeaderTabela";
import Table from "../../Componete/Table/Table";
import type { Column } from "../../Componete/Table/Table.types";

import api from "../../Services/Api";
import covertData from "../../Utils/ConverteDate";
import Modal from "../../Componete/Modal/Modal";

import "./PegeEstoqueEntrada-css.css";

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
  unidadeMedida: number;
  categoria: number;
  valorUnitario: number;
  estoque: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  ativo: boolean;
  dataCriacao: Date;
}

/*
 * Objeto enviado para a API
 */
interface ProdutoLista {
  entrada_id: number;
  produto_id: number;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

/*
 * Objeto usado pelo Table
 *
 * O id aqui é apenas auxiliar para o componente
 * Table conseguir identificar a linha.
 */
interface ProdutoListaTable extends ProdutoLista {
  id: number;
}

export default function EntradaEstoque() {
  /* =====================================================
     BASES
  ===================================================== */

  const base = "entradas";

  /*
   * IMPORTANTE:
   * Seu Controller agora usa:
   *
   * /api/entrada-produtos
   */
  const baseItens = "entrada-produtos";

  const baseFornecedores = "fornecedores";

  const baseProdutos = "produtos";

  const baseTiposEntrada = "tipos-entrada";

  /* =====================================================
     MODAL DE CRIAÇÃO
  ===================================================== */

  const [modalOpen, setModalOpen] = useState(false);

  const [etapa, setEtapa] = useState<1 | 2>(1);

  /* =====================================================
     MODAL DE VISUALIZAÇÃO DOS ITENS
  ===================================================== */

  const [modalItensOpen, setModalItensOpen] = useState(false);

  const [entradaSelecionada, setEntradaSelecionada] = useState<Entrada | null>(
    null,
  );

  const [itensEntrada, setItensEntrada] = useState<ProdutoListaTable[]>([]);

  const [carregandoItens, setCarregandoItens] = useState(false);

  /* =====================================================
     DADOS
  ===================================================== */

  const [entradas, setEntradas] = useState<Entrada[]>([]);

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  const [tiposEntrada, setTiposEntrada] = useState<TipoEntrada[]>([]);

  const [produtos, setProdutos] = useState<Produto[]>([]);

  /* =====================================================
     DADOS DA ENTRADA
  ===================================================== */

  const [notafiscal, setNotaFiscal] = useState<number | undefined>();

  const [fornecedor_id, setFornecedor_id] = useState<number | undefined>();

  const [tipoEntrada_id, setTipoEntrada_id] = useState<number | undefined>();

  const [observacao, setObservacao] = useState("");

  const [entradaRegistrada, setEntradaRegistrada] = useState<Entrada | null>(
    null,
  );

  /* =====================================================
     PRODUTO ATUAL
  ===================================================== */

  const [produto, setProduto] = useState<number | undefined>();

  const [quantidade, setQuantidade] = useState<number | undefined>();

  const [valorUni, setValorUni] = useState<number | undefined>();

  /* =====================================================
     LISTA DE PRODUTOS DA NOVA ENTRADA
  ===================================================== */

  const [listaProdutos, setListaProdutos] = useState<ProdutoListaTable[]>([]);

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
     CRIAR ENTRADA
  ===================================================== */

  async function PostEntrada() {
    if (notafiscal === undefined || notafiscal <= 0) {
      toast.warning("Informe o número da nota fiscal.");

      return;
    }

    if (fornecedor_id === undefined) {
      toast.warning("Selecione um fornecedor.");

      return;
    }

    if (tipoEntrada_id === undefined) {
      toast.warning("Selecione um tipo de entrada.");

      return;
    }

    try {
      const resposta = await api.post(`/${base}`, {
        notaFiscal: notafiscal,
        fornecedor_id: fornecedor_id,
        tipoEntrada_id: tipoEntrada_id,
        observacao: observacao,
      });

      /*
       * Guarda o ID da entrada criada.
       *
       * Esse ID será utilizado em todos
       * os produtos adicionados.
       */
      setEntradaRegistrada(resposta.data);

      setEtapa(2);

      toast.success("Entrada criada com sucesso.");
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao criar entrada.");
    }
  }

  /* =====================================================
     SELECIONAR PRODUTO
  ===================================================== */

  function selecionarProduto(id: number) {
    setProduto(id);

    const produtoSelecionado = produtos.find((item) => item.id === id);

    if (produtoSelecionado) {
      setValorUni(produtoSelecionado.valorUnitario);
    }
  }

  /* =====================================================
     VALOR TOTAL DO PRODUTO
  ===================================================== */

  const valorTot =
    quantidade !== undefined && valorUni !== undefined
      ? quantidade * valorUni
      : 0;

  /* =====================================================
     ADICIONAR PRODUTO AO PREVIEW
  ===================================================== */

  function addProdutoNew() {
    if (!entradaRegistrada) {
      toast.warning("A entrada ainda não foi criada.");

      return;
    }

    if (produto === undefined) {
      toast.warning("Selecione um produto.");

      return;
    }

    if (quantidade === undefined || quantidade <= 0) {
      toast.warning("Informe uma quantidade válida.");

      return;
    }

    if (valorUni === undefined || valorUni < 0) {
      toast.warning("Informe um valor unitário válido.");

      return;
    }

    /*
     * Não permite adicionar o mesmo produto
     * duas vezes na mesma entrada.
     */
    const produtoJaAdicionado = listaProdutos.some(
      (item) => item.produto_id === produto,
    );

    if (produtoJaAdicionado) {
      toast.warning("Este produto já foi adicionado.");

      return;
    }

    const novoProduto: ProdutoListaTable = {
      id: Date.now(),

      entrada_id: entradaRegistrada.id,

      produto_id: produto,

      quantidade: quantidade,

      valorUnitario: valorUni,

      valorTotal: valorTot,
    };

    setListaProdutos((listaAtual) => [...listaAtual, novoProduto]);

    setProduto(undefined);
    setQuantidade(undefined);
    setValorUni(undefined);

    toast.success("Produto adicionado.");
  }

  /* =====================================================
     EXCLUIR PRODUTO DO PREVIEW
  ===================================================== */

  function deletarProduto(id: number) {
    setListaProdutos((listaAtual) =>
      listaAtual.filter((item) => item.id !== id),
    );

    toast.success("Produto removido da lista.");
  }

  /* =====================================================
     SALVAR LISTA DE PRODUTOS
  ===================================================== */

  async function salvarProdutos() {
    if (!entradaRegistrada) {
      toast.warning("Nenhuma entrada foi criada.");

      return;
    }

    if (listaProdutos.length === 0) {
      toast.warning("Adicione pelo menos um produto.");

      return;
    }

    try {
      /*
       * O Table utiliza o id auxiliar.
       *
       * O backend não precisa desse id.
       */
      const dadosParaEnviar: ProdutoLista[] = listaProdutos.map((item) => ({
        entrada_id: item.entrada_id,

        produto_id: item.produto_id,

        quantidade: item.quantidade,

        valorUnitario: item.valorUnitario,

        valorTotal: item.valorTotal,
      }));

      /*
       * NOVO ENDPOINT
       *
       * POST
       * /api/entrada-produtos/lista
       */
      await api.post(`/${baseItens}/lista`, dadosParaEnviar);

      toast.success("Produtos adicionados com sucesso.");

      await getEntradas();

      fecharModal();
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao adicionar os produtos.",
      );
    }
  }

  /* =====================================================
     VER ITENS DA ENTRADA
  ===================================================== */

  async function verItensEntrada(entrada: Entrada) {
    try {
      setEntradaSelecionada(entrada);

      setItensEntrada([]);

      setModalItensOpen(true);

      setCarregandoItens(true);

      /*
       * NOVO ENDPOINT
       *
       * GET
       * /api/entrada-produtos/entrada/{entradaId}
       */
      const resposta = await api.get(`/${baseItens}/entrada/${entrada.id}`);

      /*
       * O backend já retorna os itens
       * pertencentes à entrada.
       *
       * Criamos somente um ID auxiliar
       * para o componente Table.
       */
      const itens: ProdutoListaTable[] = resposta.data.map(
        (item: ProdutoLista, index: number) => ({
          id: index + 1,

          entrada_id: item.entrada_id,

          produto_id: item.produto_id,

          quantidade: item.quantidade,

          valorUnitario: item.valorUnitario,

          valorTotal: item.valorTotal,
        }),
      );

      setItensEntrada(itens);
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao buscar os itens da entrada.",
      );
    } finally {
      setCarregandoItens(false);
    }
  }

  /* =====================================================
     FECHAR MODAL DOS ITENS
  ===================================================== */

  function fecharModalItens() {
    setModalItensOpen(false);

    setEntradaSelecionada(null);

    setItensEntrada([]);
  }

  /* =====================================================
     ABRIR MODAL
  ===================================================== */

  function abrirModal() {
    setModalOpen(true);

    setEtapa(1);

    setFornecedor_id(undefined);

    setNotaFiscal(undefined);

    setTipoEntrada_id(undefined);

    setObservacao("");

    setEntradaRegistrada(null);

    setListaProdutos([]);

    setProduto(undefined);

    setQuantidade(undefined);

    setValorUni(undefined);
  }

  /* =====================================================
     FECHAR MODAL
  ===================================================== */

  function fecharModal() {
    setModalOpen(false);

    setEtapa(1);

    setFornecedor_id(undefined);

    setNotaFiscal(undefined);

    setTipoEntrada_id(undefined);

    setObservacao("");

    setEntradaRegistrada(null);

    setListaProdutos([]);

    setProduto(undefined);

    setQuantidade(undefined);

    setValorUni(undefined);
  }

  /* =====================================================
     TOTAL DOS PRODUTOS DO PREVIEW
  ===================================================== */

  const valorTotalLista = listaProdutos.reduce(
    (total, item) => total + item.valorTotal,
    0,
  );

  const quantidadeTotalLista = listaProdutos.reduce(
    (total, item) => total + item.quantidade,
    0,
  );

  /* =====================================================
     TOTAL DOS ITENS DA ENTRADA
  ===================================================== */

  const valorTotalEntrada = itensEntrada.reduce(
    (total, item) => total + item.valorTotal,
    0,
  );

  const quantidadeTotalItens = itensEntrada.reduce(
    (total, item) => total + item.quantidade,
    0,
  );

  /* =====================================================
     COLUNAS ENTRADAS
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
     COLUNAS PRODUTOS
  ===================================================== */

  const colunasProdutos: Column<ProdutoListaTable>[] = [
    {
      key: "produto_id",
      title: "Produto",

      render: (value) => {
        const produtoSelecionado = produtos.find((item) => item.id === value);

        return produtoSelecionado?.nome ?? "-";
      },
    },

    {
      key: "quantidade",
      title: "Quantidade",
      align: "center",
    },

    {
      key: "valorUnitario",
      title: "Valor Unitário",
      align: "right",

      render: (value) => {
        return Number(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },

    {
      key: "valorTotal",
      title: "Valor Total",
      align: "right",

      render: (value) => {
        return Number(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
  ];

  /* =====================================================
     EFFECT
  ===================================================== */

  useEffect(() => {
    getEntradas();
    getFornecedores();
    getTiposEntrada();
    getProdutos();
  }, []);

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <Layout title="Entrada de Estoque">
      <section>
        {/* =================================================
            TABELA DE ENTRADAS
        ================================================= */}

        <HeaderTabela
          title="Entradas"
          onClick={abrirModal}
          butonsPlus={
            <button className="butto-header-table">
              <Plus />
              Com NF
            </button>
          }
        >
          <Table columns={colunas} data={entradas}>
            {(entrada) => (
              <button
                type="button"
                title="Ver itens"
                className="action-button"
                onClick={() => verItensEntrada(entrada)}
              >
                <Eye size={18} />
              </button>
            )}
          </Table>
        </HeaderTabela>

        {/* =================================================
            MODAL DE CRIAÇÃO DA ENTRADA
        ================================================= */}

        <Modal
          open={modalOpen}
          title="Nova Entrada"
          onClose={fecharModal}
          tamanho="max"
        >
          {/* =================================================
              ETAPAS
          ================================================= */}

          <div className="passo">
            <div className={etapa === 1 ? "p n1 ativo" : "p n1 ativo"}>
              <h2 className="nume ativo">1</h2>

              <h2>Criar Entrada</h2>
            </div>

            <hr className={etapa > 1 ? "ativo" : ""} />

            <div className={etapa === 2 ? "p n2 ativo" : "p n2"}>
              <h2 className={etapa === 2 ? "nume ativo" : "nume"}>2</h2>

              <h2>Adicionar Produtos</h2>
            </div>
          </div>

          {/* =================================================
              DADOS DA ENTRADA
          ================================================= */}

          {etapa >= 1 && (
            <div className="for">
              <h3>Definição da Entrada</h3>

              <div className="form-group entrada">
                <div>
                  <label htmlFor="nf">N° Nf</label>

                  <input
                    id="nf"
                    type="number"
                    placeholder="Digite o numero da NF"
                    value={notafiscal ?? ""}
                    onChange={(e) => {
                      setNotaFiscal(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      );
                    }}
                    disabled={!!entradaRegistrada}
                  />
                </div>

                <div>
                  <label htmlFor="fornecedor">Fornecedor</label>

                  <select
                    id="fornecedor"
                    value={fornecedor_id ?? ""}
                    onChange={(e) => {
                      setFornecedor_id(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      );
                    }}
                    disabled={!!entradaRegistrada}
                  >
                    <option value="">Selecione um Fornecedor</option>

                    {fornecedores.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="tipo-entrada">Tipo de Entrada</label>

                  <select
                    id="tipo-entrada"
                    value={tipoEntrada_id ?? ""}
                    onChange={(e) => {
                      setTipoEntrada_id(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      );
                    }}
                    disabled={!!entradaRegistrada}
                  >
                    <option value="">Selecione um Tipo de Entrada</option>

                    {tiposEntrada.map((te) => (
                      <option key={te.id} value={te.id}>
                        {te.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="obs">Observações</label>

                  <input
                    id="obs"
                    type="text"
                    placeholder="Digite a Observação"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    disabled={!!entradaRegistrada}
                  />
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              ETAPA 2
          ================================================= */}

          {etapa === 2 && (
            <>
              <hr />

              <div className="header-entrade-produtos">
                <h3>Adicionar Produtos</h3>
              </div>

              {/* =================================================
                  FORMULÁRIO DO PRODUTO
              ================================================= */}

              <div className="form-group add">
                <div>
                  <label htmlFor="produto">Produto</label>

                  <select
                    id="produto"
                    value={produto ?? ""}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setProduto(undefined);

                        setValorUni(undefined);

                        return;
                      }

                      selecionarProduto(Number(e.target.value));
                    }}
                  >
                    <option value="">Selecione um produto</option>

                    {produtos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="quantidade">Quant.</label>

                  <input
                    id="quantidade"
                    type="number"
                    min="1"
                    placeholder="Digite a quantidade"
                    value={quantidade ?? ""}
                    onChange={(e) => {
                      setQuantidade(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      );
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="vUnitario">Val uni.</label>

                  <input
                    id="vUnitario"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Digite o valor"
                    value={valorUni ?? ""}
                    onChange={(e) => {
                      setValorUni(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      );
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="vTotal">Val total</label>

                  <input
                    id="vTotal"
                    type="text"
                    value={valorTot.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                    disabled
                  />
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={addProdutoNew}
                >
                  <Plus size={18} />
                  Adicionar
                </button>
              </div>

              {/* =================================================
                  PREVIEW DOS PRODUTOS
              ================================================= */}

              {listaProdutos.length > 0 && (
                <>
                  <Table columns={colunasProdutos} data={listaProdutos}>
                    {(item) => (
                      <button
                        type="button"
                        title="Excluir"
                        className="action-button"
                        onClick={() => deletarProduto(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </Table>

                  {/* RESUMO DO PREVIEW */}

                  <div className="footer-info">
                    <span>Produtos: {listaProdutos.length}</span>

                    <span>Quantidade: {quantidadeTotalLista}</span>

                    <span>
                      Valor Total:{" "}
                      {valorTotalLista.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                </>
              )}
            </>
          )}

          {/* =================================================
              BOTÕES
          ================================================= */}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={fecharModal}>
              Cancelar
            </button>

            {etapa === 1 && (
              <button
                type="button"
                className="btn-primary"
                onClick={PostEntrada}
              >
                Criar Entrada
              </button>
            )}

            {etapa === 2 && (
              <>
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
                  onClick={salvarProdutos}
                  disabled={listaProdutos.length === 0}
                >
                  Finalizar Entrada
                </button>
              </>
            )}
          </div>
        </Modal>

        {/* =================================================
            MODAL PARA VISUALIZAR ITENS
        ================================================= */}

        <Modal
          open={modalItensOpen}
          title={
            entradaSelecionada
              ? `Itens da Entrada #${entradaSelecionada.id}`
              : "Itens da Entrada"
          }
          onClose={fecharModalItens}
          tamanho="max"
        >
          {entradaSelecionada && (
            <div className="entrada-info">
              <span>
                <strong>Nota Fiscal:</strong> {entradaSelecionada.notaFiscal}
              </span>

              <span>
                <strong>Observação:</strong>{" "}
                {entradaSelecionada.observacao || "-"}
              </span>
            </div>
          )}

          {carregandoItens ? (
            <div>Carregando itens...</div>
          ) : itensEntrada.length === 0 ? (
            <div className="preview-vazio">
              <span>Nenhum item encontrado para esta entrada.</span>
            </div>
          ) : (
            <Table columns={colunasProdutos} data={itensEntrada} />
          )}

          {!carregandoItens && itensEntrada.length > 0 && (
            <div className="footer-info">
              <span>Total de itens: {quantidadeTotalItens}</span>

              <span>
                Valor total:{" "}
                {valorTotalEntrada.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          )}
        </Modal>
      </section>
    </Layout>
  );
}
