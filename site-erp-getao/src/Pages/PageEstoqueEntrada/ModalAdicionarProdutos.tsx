import { Plus, Trash2 } from "lucide-react";

import Table from "../../Componete/Table/Table";
import type { Column } from "../../Componete/Table/Table.types";

interface Produto {
  id: number;
  nome: string;
}

interface ProdutoLista {
  entrada_id: number;
  produto_id: number;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

interface ProdutoListaTable extends ProdutoLista {
  id: number;
}

interface ModalAdicionarProdutosProps {
  produtos: Produto[];

  produto: number | undefined;
  quantidade: number | undefined;
  valorUni: number | undefined;

  listaProdutos: ProdutoListaTable[];

  valorTot: number;
  valorTotalLista: number;
  quantidadeTotalLista: number;

  onSelecionarProduto: (id: number) => void;
  setProduto: (value: number | undefined) => void;
  setQuantidade: (value: number | undefined) => void;
  setValorUni: (value: number | undefined) => void;

  onAdicionar: () => void;
  onDeletar: (id: number) => void;
}

export default function ModalAdicionarProdutos({
  produtos,
  produto,
  quantidade,
  valorUni,
  listaProdutos,
  valorTot,
  valorTotalLista,
  quantidadeTotalLista,
  onSelecionarProduto,
  setProduto,
  setQuantidade,
  setValorUni,
  onAdicionar,
  onDeletar,
}: ModalAdicionarProdutosProps) {
  const colunasProdutos: Column<ProdutoListaTable>[] = [
    {
      key: "produto_id",
      title: "Produto",

      render: (value) => {
        const item = produtos.find((produto) => produto.id === value);

        return item?.nome ?? "-";
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

  return (
    <>
      <hr />

      <div className="header-entrade-produtos">
        <h3>Adicionar Produtos</h3>
      </div>

      {/* FORMULÁRIO */}
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

              onSelecionarProduto(Number(e.target.value));
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
                e.target.value === "" ? undefined : Number(e.target.value),
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
                e.target.value === "" ? undefined : Number(e.target.value),
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

        <button type="button" className="btn-primary" onClick={onAdicionar}>
          <Plus size={18} />
          Adicionar
        </button>
      </div>

      {/* PREVIEW */}
      {listaProdutos.length > 0 && (
        <>
          <Table columns={colunasProdutos} data={listaProdutos}>
            {(item) => (
              <button
                type="button"
                title="Excluir"
                className="action-button"
                onClick={() => onDeletar(item.id)}
              >
                <Trash2 size={18} />
              </button>
            )}
          </Table>

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
  );
}
