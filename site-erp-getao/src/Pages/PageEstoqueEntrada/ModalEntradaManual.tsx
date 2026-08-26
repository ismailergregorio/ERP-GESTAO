import { useEffect, useState } from "react";
import Modal from "../../Componete/Modal/Modal";
import Table from "../../Componete/Table/Table";
import type { Column } from "../../Componete/Table/Table.types";

import { toast } from "react-toastify";
import api from "../../Services/Api";
import { getFornecedores, getTiposEntrada } from "./Functions";
import { Trash2 } from "lucide-react";
import type { FornecedorNf, TipoEntrada, Entrada, Produto, ProdutoEntrada, ProdutoEntradaApi } from "./Interfaces";

/* =========================================================
   PROPS
========================================================= */

interface ModalEntradaManualProps {
  stadoModal?: boolean;
  onClose: () => void;
}


export default function ModalEntradaManual({
  stadoModal = false,
  onClose,
}: ModalEntradaManualProps) {
  const base = "entradas";

  /* =========================================================
     DADOS DA ENTRADA
  ========================================================= */

  const [notafiscal, setNotaFiscal] = useState<number | undefined>();

  const [etapa, setEtapa] = useState(1);

  const [fornecedor_id, setFornecedor_id] = useState<number | undefined>();

  const [tipoEntrada_id, setTipoEntrada_id] = useState<
    number | undefined
  >();

  const [observacao, setObservacao] = useState("");

  const [fornecedores, setFornecedores] = useState<FornecedorNf[]>([]);

  const [tiposEntrada, setTiposEntrada] = useState<TipoEntrada[]>([]);

  const [entradaRegistrada, setEntradaRegistrada] =
    useState<Entrada | null>(null);

  /* =========================================================
     PRODUTOS
  ========================================================= */

  const [produtos, setProdutos] = useState<Produto[]>([]);

  /*
   * Essa lista acumula todos os produtos
   * adicionados pelo usuário.
   */
  const [produtosEntrada, setProdutosEntrada] = useState<
    ProdutoEntrada[]
  >([]);

  const [produtoSelecionado, setProdutoSelecionado] = useState<
    number | undefined
  >();

  const [quantidade, setQuantidade] = useState<number>(1);

  const [valorUnitario, setValorUnitario] = useState<number>(0);

  /* =========================================================
     CARREGAR FORNECEDORES / TIPOS
  ========================================================= */

  useEffect(() => {
    async function carregarDados() {
      try {
        const listaFornecedores = await getFornecedores();

        setFornecedores(listaFornecedores);

        console.log("Fornecedores:", listaFornecedores);

        const listaTiposEntrada = await getTiposEntrada();

        setTiposEntrada(listaTiposEntrada);

        console.log("Tipos de entrada:", listaTiposEntrada);
      } catch (e) {
        console.error(e);

        toast.error(
          "Erro ao carregar dados da entrada."
        );
      }
    }

    if (stadoModal) {
      carregarDados();
    }
  }, [stadoModal]);

  /* =========================================================
     CARREGAR PRODUTOS
  ========================================================= */

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await api.get("/produtos");

        setProdutos(resposta.data);

        console.log("Produtos:", resposta.data);
      } catch (e: any) {
        console.error(e);

        toast.error(
          e.response?.data?.message ??
            "Erro ao buscar produtos."
        );
      }
    }

    if (stadoModal) {
      carregarProdutos();
    }
  }, [stadoModal]);

  /* =========================================================
     CRIAR ENTRADA
  ========================================================= */

  async function PostEntrada() {
    if (!notafiscal) {
      toast.warning(
        "Informe o número da nota fiscal."
      );
      return;
    }

    if (!fornecedor_id) {
      toast.warning(
        "Selecione o fornecedor."
      );
      return;
    }

    if (!tipoEntrada_id) {
      toast.warning(
        "Selecione o tipo de entrada."
      );
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
       * Guarda a entrada criada.
       *
       * O ID dessa entrada será utilizado
       * posteriormente em todos os produtos.
       */
      setEntradaRegistrada(resposta.data);

      setEtapa(2);

      toast.success(
        "Entrada criada com sucesso."
      );
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ??
          e.response?.data ??
          "Erro ao criar entrada."
      );
    }
  }

  /* =========================================================
     ALTERAR PRODUTO SELECIONADO
  ========================================================= */

  function selecionarProduto(
    id: number | undefined
  ) {
    setProdutoSelecionado(id);

    if (!id) {
      setValorUnitario(0);
      return;
    }

    const produto = produtos.find(
      (item) => item.id === id
    );

    if (
      produto?.valorUnitario !== undefined
    ) {
      setValorUnitario(
        Number(produto.valorUnitario)
      );
    }
  }

  /* =========================================================
     ADICIONAR PRODUTO
  ========================================================= */

  function adicionarProduto() {
    if (!produtoSelecionado) {
      toast.warning(
        "Selecione um produto."
      );
      return;
    }

    if (!quantidade || quantidade <= 0) {
      toast.warning(
        "Informe uma quantidade válida."
      );
      return;
    }

    if (valorUnitario < 0) {
      toast.warning(
        "Informe um valor unitário válido."
      );
      return;
    }

    const produto = produtos.find(
      (item) =>
        item.id === produtoSelecionado
    );

    if (!produto) {
      toast.error(
        "Produto não encontrado."
      );
      return;
    }

    /*
     * Não permite adicionar o mesmo
     * produto duas vezes.
     */
    const produtoExistente =
      produtosEntrada.some(
        (item) =>
          item.produto_id ===
          produtoSelecionado
      );

    if (produtoExistente) {
      toast.warning(
        "Este produto já foi adicionado à entrada."
      );
      return;
    }

    /*
     * Produto usado pela tabela.
     *
     * O id abaixo é apenas um identificador
     * local para permitir a remoção do produto.
     */
    const novoProduto: ProdutoEntrada = {
      id: Date.now(),
      produto_id: produto.id,
      nome: produto.nome,
      quantidade: quantidade,
      valorUnitario: valorUnitario,
      valorTotal:
        quantidade * valorUnitario,
    };

    /*
     * ACUMULA o produto na lista.
     *
     * Os produtos anteriores permanecem
     * na lista.
     */
    setProdutosEntrada((lista) => [
      ...lista,
      novoProduto,
    ]);

    /*
     * Limpa o formulário para permitir
     * adicionar outro produto.
     */
    setProdutoSelecionado(undefined);

    setQuantidade(1);

    setValorUnitario(0);

    toast.success(
      "Produto adicionado."
    );
  }

  /* =========================================================
     REMOVER PRODUTO
  ========================================================= */

  function removerProduto(id: number) {
    setProdutosEntrada(
      (lista) =>
        lista.filter(
          (produto) =>
            produto.id !== id
        )
    );

    toast.success(
      "Produto removido."
    );
  }

  /* =========================================================
     FINALIZAR ENTRADA
  ========================================================= */

  async function finalizarEntrada() {
    /*
     * Verifica se a entrada principal
     * foi criada.
     */
    if (!entradaRegistrada) {
      toast.error(
        "Entrada não encontrada."
      );
      return;
    }

    /*
     * Verifica se existe pelo menos
     * um produto na lista.
     */
    if (produtosEntrada.length === 0) {
      toast.warning(
        "Adicione pelo menos um produto."
      );
      return;
    }

    try {
      /*
       * Monta a lista exatamente no
       * formato esperado pela API.
       *
       * IMPORTANTE:
       *
       * O entrada_id é o mesmo para
       * todos os produtos porque todos
       * pertencem à mesma entrada.
       */
      const listaProdutos: ProdutoEntradaApi[] =
        produtosEntrada.map(
          (produto) => ({
            entrada_id:
              entradaRegistrada.id,

            produto_id:
              produto.produto_id,

            quantidade:
              produto.quantidade,

            valorUnitario:
              produto.valorUnitario,

            valorTotal:
              produto.valorTotal,
          })
        );

      /*
       * Mostra no console exatamente
       * o que será enviado.
       */
      console.log(
        "LISTA DE PRODUTOS PARA API:",
        listaProdutos
      );

      /*
       * Envia o ARRAY diretamente.
       *
       * Não existe mais:
       *
       * {
       *   entrada_id: ...,
       *   produtos: [...]
       * }
       *
       * Agora o body é diretamente:
       *
       * [
       *   {...},
       *   {...}
       * ]
       */
      await api.post(
        "/entrada-produtos/lista",
        listaProdutos
      );

      toast.success(
        "Entrada finalizada com sucesso."
      );

      /*
       * Fecha e limpa o modal.
       */
      fecharModalManual();

    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ??
          e.response?.data ??
          "Erro ao salvar os produtos da entrada."
      );
    }
  }

  /* =========================================================
     COLUNAS DA TABELA
  ========================================================= */

  const colunasProdutos:
    Column<ProdutoEntrada>[] = [
    {
      key: "nome",
      title: "Produto",
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
        return Number(
          value
        ).toLocaleString("pt-BR", {
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
        return Number(
          value
        ).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },

    {
      key: "id",
      title: "Ações",
      align: "center",

      render: (value) => (
        <button
          type="button"
          onClick={() =>
            removerProduto(
              Number(value)
            )
          }
          title="Remover produto"
        >
          <Trash2 size={18} />
        </button>
      ),
    },
  ];

  /* =========================================================
     TOTAL DA ENTRADA
  ========================================================= */

  const totalEntrada =
    produtosEntrada.reduce(
      (total, produto) =>
        total + produto.valorTotal,
      0
    );

  /* =========================================================
     FECHAR MODAL
  ========================================================= */

  function fecharModalManual() {
    /*
     * onClose não recebe parâmetro.
     */
    onClose();

    /*
     * Reseta todas as informações.
     */
    setEtapa(1);

    setNotaFiscal(undefined);

    setFornecedor_id(undefined);

    setTipoEntrada_id(undefined);

    setObservacao("");

    setEntradaRegistrada(null);

    /*
     * Limpa a lista acumulada.
     */
    setProdutosEntrada([]);

    setProdutoSelecionado(undefined);

    setQuantidade(1);

    setValorUnitario(0);
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Modal
      open={stadoModal}
      title="Nova Entrada"
      onClose={fecharModalManual}
      tamanho="max"
    >
      {/* =====================================================
          ETAPAS
      ===================================================== */}

      <div className="passo">
        <div
          className={
            etapa >= 1
              ? "p n1 ativo"
              : "p n1"
          }
        >
          <h2
            className={
              etapa >= 1
                ? "nume ativo"
                : "nume"
            }
          >
            1
          </h2>

          <h2>Criar Entrada</h2>
        </div>

        <hr
          className={
            etapa >= 2 ? "ativo" : ""
          }
        />

        <div
          className={
            etapa >= 2
              ? "p n2 ativo"
              : "p n2"
          }
        >
          <h2
            className={
              etapa >= 2
                ? "nume ativo"
                : "nume"
            }
          >
            2
          </h2>

          <h2>
            Adicionar Produtos
          </h2>
        </div>
      </div>

      {/* =====================================================
          ETAPA 1
      ===================================================== */}

      {etapa === 1 && (
        <div className="form-group">
          <div>
            <label htmlFor="nf">
              N° NF
            </label>

            <input
              id="nf"
              type="number"
              placeholder="Digite o número da NF"
              value={notafiscal ?? ""}
              onChange={(e) =>
                setNotaFiscal(
                  e.target.value
                    ? Number(
                        e.target.value
                      )
                    : undefined
                )
              }
            />
          </div>

          <div>
            <label htmlFor="fornecedor">
              Fornecedor
            </label>

            <select
              id="fornecedor"
              value={
                fornecedor_id ?? ""
              }
              onChange={(e) =>
                setFornecedor_id(
                  e.target.value
                    ? Number(
                        e.target.value
                      )
                    : undefined
                )
              }
            >
              <option value="">
                Selecione um fornecedor
              </option>

              {fornecedores.map(
                (fornecedor) => (
                  <option
                    key={
                      fornecedor.id
                    }
                    value={
                      fornecedor.id
                    }
                  >
                    {
                      fornecedor.nomeFantasia
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label htmlFor="tipo-entrada">
              Tipo de Entrada
            </label>

            <select
              id="tipo-entrada"
              value={
                tipoEntrada_id ?? ""
              }
              onChange={(e) =>
                setTipoEntrada_id(
                  e.target.value
                    ? Number(
                        e.target.value
                      )
                    : undefined
                )
              }
            >
              <option value="">
                Selecione um tipo de entrada
              </option>

              {tiposEntrada.map(
                (tipo) => (
                  <option
                    key={tipo.id}
                    value={tipo.id}
                  >
                    {tipo.nome}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label htmlFor="obs">
              Observações
            </label>

            <input
              id="obs"
              type="text"
              placeholder="Digite a observação"
              value={observacao}
              onChange={(e) =>
                setObservacao(
                  e.target.value
                )
              }
            />
          </div>
        </div>
      )}

      {/* =====================================================
          ETAPA 2
      ===================================================== */}

      {etapa === 2 && (
        <div>
          <h3>
            Adicionar Produtos
          </h3>

          {entradaRegistrada && (
            <p>
              Entrada Nº{" "}
              <strong>
                {
                  entradaRegistrada.id
                }
              </strong>{" "}
              criada com sucesso.
            </p>
          )}

          {/* =================================================
              FORMULÁRIO DO PRODUTO
          ================================================= */}

          <div className="form-group">
            <div>
              <label htmlFor="produto">
                Produto
              </label>

              <select
                id="produto"
                value={
                  produtoSelecionado ??
                  ""
                }
                onChange={(e) =>
                  selecionarProduto(
                    e.target.value
                      ? Number(
                          e.target.value
                        )
                      : undefined
                  )
                }
              >
                <option value="">
                  Selecione um produto
                </option>

                {produtos.map(
                  (produto) => (
                    <option
                      key={produto.id}
                      value={produto.id}
                    >
                      {produto.nome}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label htmlFor="quantidade">
                Quantidade
              </label>

              <input
                id="quantidade"
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) =>
                  setQuantidade(
                    Number(
                      e.target.value
                    )
                  )
                }
              />
            </div>

            <div>
              <label htmlFor="valorUnitario">
                Valor Unitário
              </label>

              <input
                id="valorUnitario"
                type="number"
                min="0"
                step="0.01"
                value={valorUnitario}
                onChange={(e) =>
                  setValorUnitario(
                    Number(
                      e.target.value
                    )
                  )
                }
              />
            </div>

            <div>
              <button
                type="button"
                className="btn-primary"
                onClick={
                  adicionarProduto
                }
              >
                Adicionar Produto
              </button>
            </div>
          </div>

          {/* =================================================
              TABELA
          ================================================= */}

          <Table<ProdutoEntrada>
            columns={
              colunasProdutos
            }
            data={
              produtosEntrada
            }
          />

          {/* =================================================
              TOTAL
          ================================================= */}

          <div className="nf-total">
            <span>
              Total da Entrada:
            </span>

            <strong>
              {totalEntrada.toLocaleString(
                "pt-BR",
                {
                  style:
                    "currency",
                  currency:
                    "BRL",
                }
              )}
            </strong>
          </div>
        </div>
      )}

      {/* =====================================================
          BOTÕES
      ===================================================== */}

      <div className="modal-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={
            fecharModalManual
          }
        >
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
          <button
            type="button"
            className="btn-primary"
            onClick={
              finalizarEntrada
            }
            disabled={
              produtosEntrada.length ===
              0
            }
          >
            Finalizar Entrada
          </button>
        )}
      </div>
    </Modal>
  );
}