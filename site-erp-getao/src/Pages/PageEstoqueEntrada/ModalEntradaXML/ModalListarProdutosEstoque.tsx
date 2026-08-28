import { useEffect, useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";

import Modal from "../../../Componete/Modal/Modal";
import Table from "../../../Componete/Table/Table";
import type { Column } from "../../../Componete/Table/Table.types";

import { getProdutos } from "../Functions";
import type { DadosTableSelectProduto } from "./ModelConeccaoProduto";

interface ConfigModal {
  opem: boolean;
  onClose: () => void;
  produtosRelacao?: DadosTableSelectProduto[];
  idProduto?: number | null;

  /**
   * Retorna o produto selecionado
   * para o componente pai.
   */
  onSelecionar?: (produtoId: number, quantidadeUnidades: number) => void;
}

interface TabelaProdutos {
  id: number;
  nome: string;
  unidadeMedida: number;
  categoria: number;
}

export default function ProdutosListaEstoque({
  opem,
  produtosRelacao = [],
  idProduto = null,
  onClose,
  onSelecionar,
}: ConfigModal) {
  /* =====================================================
     PRODUTOS
  ===================================================== */

  const [produtos, setProdutos] = useState<TabelaProdutos[]>([]);

  /* =====================================================
     CONTROLE DA BUSCA
  ===================================================== */

  const [busca, setBusca] = useState("");

  /* =====================================================
     PRODUTO SELECIONADO
  ===================================================== */

  const [produtoEstoqueSelecionado, setProdutoEstoqueSelecionado] = useState<
    number | null
  >(null);

  /* =====================================================
     CONVERSÃO
  ===================================================== */

  const [quantidadeCaixa, setQuantidadeCaixa] = useState<number>(1);

  const [unidadesPorCaixa, setUnidadesPorCaixa] = useState<number>(1);

  /* =====================================================
     PRODUTO DA NF
  ===================================================== */

  const produtoNf = useMemo(() => {
    return produtosRelacao.find((produto) => produto.id === idProduto);
  }, [produtosRelacao, idProduto]);

  /* =====================================================
     BUSCAR PRODUTOS
  ===================================================== */

  async function buscarProdutos() {
    try {
      const resposta = await getProdutos();

      const produtosFormatados = resposta.map((p:TabelaProdutos) => ({
        id: p.id,
        nome: p.nome,
        unidadeMedida: p.unidadeMedida,
        categoria: p.categoria,
      }));

      setProdutos(produtosFormatados);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  }

  /* =====================================================
     CARREGAR
  ===================================================== */

  useEffect(() => {
    if (opem) {
      buscarProdutos();
    }
  }, [opem]);

  /* =====================================================
     FILTRO
  ===================================================== */

  const produtosFiltrados = useMemo(() => {
    const texto = busca.toLowerCase().trim();

    if (!texto) {
      return produtos;
    }

    return produtos.filter(
      (produto) =>
        produto.nome.toLowerCase().includes(texto) ||
        String(produto.id).includes(texto),
    );
  }, [produtos, busca]);

  /* =====================================================
     SELECIONAR PRODUTO
  ===================================================== */

  function selecionarProduto(produto: TabelaProdutos) {
    setProdutoEstoqueSelecionado(produto.id);
  }

  /* =====================================================
     PRODUTO ESCOLHIDO
  ===================================================== */

  const produtoSelecionado = produtos.find(
    (produto) => produto.id === produtoEstoqueSelecionado,
  );

  /* =====================================================
     QUANTIDADE TOTAL EM UNIDADES
  ===================================================== */

  const quantidadeUnidades = quantidadeCaixa * unidadesPorCaixa;

  /* =====================================================
     CONFIRMAR VÍNCULO
  ===================================================== */

  function confirmarSelecao() {
    if (!produtoEstoqueSelecionado) {
      return;
    }

    onSelecionar?.(produtoEstoqueSelecionado, quantidadeUnidades);
    console.log(produtoEstoqueSelecionado, quantidadeUnidades)

    fecharModal();
  }

  /* =====================================================
     FECHAR
  ===================================================== */

  function fecharModal() {
    setBusca("");

    setProdutoEstoqueSelecionado(null);

    setQuantidadeCaixa(1);

    setUnidadesPorCaixa(1);

    onClose();
  }

  /* =====================================================
     COLUNAS
  ===================================================== */

  const colunasProduto: Column<TabelaProdutos>[] = [
    {
      key: "id",
      title: "ID",
      align: "center",
    },

    {
      key: "nome",
      title: "Produto",
    },

    {
      key: "unidadeMedida",
      title: "Unidade",
      align: "center",

      render: (value) => {
        return String(value);
      },
    },

    {
      key: "categoria",
      title: "Categoria",
      align: "center",

      render: (value) => {
        return String(value);
      },
    },
  ];

  return (
    <Modal
      open={opem}
      title="Vincular produto ao estoque"
      onClose={fecharModal}
      tamanho="max"
    >
      <div className="modal-conexao-produto">
        {/* =================================================
            PRODUTO DA NF
        ================================================= */}

        {produtoNf && (
          <section className="produto-nf-card">
            <div className="produto-nf-titulo">
              <div>
                <span>Produto da NF-e</span>

                <h3>{produtoNf.descricao}</h3>
              </div>

              <span className="badge-nf">NF-e</span>
            </div>

            <div className="produto-nf-dados">
              <div>
                <span>Código</span>

                <strong>{produtoNf.codigo}</strong>
              </div>

              <div>
                <span>Quantidade</span>

                <strong>{produtoNf.quantidadeNf}</strong>
              </div>

              <div>
                <span>Valor Total</span>

                <strong>
                  {Number(produtoNf.valorTotal).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            PRODUTOS DO ESTOQUE
        ================================================= */}

        <section className="estoque-selecao">
          <div className="secao-titulo">
            <div>
              <span>1. Seleção</span>

              <h3>Selecione o produto do estoque</h3>
            </div>

            <span className="contador-produtos">
              {produtosFiltrados.length} produtos
            </span>
          </div>

          {/* BUSCA */}

          <div className="campo-busca">
            <Search size={19} />

            <input
              type="text"
              placeholder="Buscar por nome ou ID..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

            {busca && (
              <button type="button" onClick={() => setBusca("")}>
                <X size={18} />
              </button>
            )}
          </div>

          {/* TABELA */}

          <div className="tabela-produtos">
            <Table columns={colunasProduto} data={produtosFiltrados}>
              {(produto) => {
                const selecionado = produto.id === produtoEstoqueSelecionado;

                return (
                  <button
                    type="button"
                    className={
                      selecionado
                        ? "action-button selecionado"
                        : "action-button"
                    }
                    title={
                      selecionado ? "Produto selecionado" : "Selecionar produto"
                    }
                    onClick={() => selecionarProduto(produto)}
                  >
                    {selecionado ? (
                      <Check size={18} />
                    ) : (
                      <span>Selecionar</span>
                    )}
                  </button>
                );
              }}
            </Table>
          </div>
        </section>

        {/* =================================================
            CONFIGURAÇÃO DE CONVERSÃO
        ================================================= */}

        {produtoSelecionado && (
          <section className="conversao-produto">
            <div className="secao-titulo">
              <div>
                <span>2. Conversão</span>

                <h3>Configuração da quantidade</h3>
              </div>
            </div>

            <div className="produto-escolhido">
              <div>
                <span>Produto selecionado</span>

                <strong>{produtoSelecionado.nome}</strong>
              </div>

              <span className="badge-selecionado">
                <Check size={15} />
                Selecionado
              </span>
            </div>

            <div className="conversao-grid">
              {/* QUANTIDADE DA NF */}

              <div className="campo-conversao">
                <label>Quantidade da NF</label>

                <div className="valor-readonly">
                  {produtoNf?.quantidadeNf ?? 0}
                </div>
              </div>

              {/* CAIXAS */}

              <div className="campo-conversao">
                <label>Quantidade de caixas</label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={quantidadeCaixa}
                  onChange={(e) => setQuantidadeCaixa(Number(e.target.value))}
                />
              </div>

              {/* UNIDADES POR CAIXA */}

              <div className="campo-conversao">
                <label>Unidades por caixa</label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={unidadesPorCaixa}
                  onChange={(e) => setUnidadesPorCaixa(Number(e.target.value))}
                />
              </div>

              {/* RESULTADO */}

              <div className="resultado-conversao">
                <span>Entrada no estoque</span>

                <strong>{quantidadeUnidades}</strong>

                <small>unidades</small>
              </div>
            </div>

            {/* EXPLICAÇÃO */}

            <div className="conversao-info">
              <strong>Conversão</strong>

              <span>
                {quantidadeCaixa} caixa(s)
                {" × "}
                {unidadesPorCaixa} unidade(s)
                {" = "}
                <b>
                  {quantidadeUnidades}
                  {" unidades"}
                </b>
              </span>
            </div>
          </section>
        )}

        {/* =================================================
            AÇÕES
        ================================================= */}

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={fecharModal}>
            Cancelar
          </button>

          <button
            type="button"
            className="btn-primary"
            disabled={produtoEstoqueSelecionado === null}
            onClick={confirmarSelecao}
          >
            <Check size={18} />
            Confirmar vínculo
          </button>
        </div>
      </div>
    </Modal>
  );
}
