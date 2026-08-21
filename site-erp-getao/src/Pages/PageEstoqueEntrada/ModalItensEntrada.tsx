import Modal from "../../Componete/Modal/Modal";
import Table from "../../Componete/Table/Table";

import type { Column } from "../../Componete/Table/Table.types";

interface Entrada {
  id: number;
  notaFiscal: number;
  fornecedor_id: number;
  tipoEntrada_id: number;
  observacao: string;
  dataCriacao: string;
}

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

interface ModalItensEntradaProps {
  open: boolean;

  entrada: Entrada | null;

  itens: ProdutoListaTable[];

  produtos: Produto[];

  carregando: boolean;

  quantidadeTotal: number;
  valorTotal: number;

  onClose: () => void;
}

export default function ModalItensEntrada({
  open,
  entrada,
  itens,
  produtos,
  carregando,
  quantidadeTotal,
  valorTotal,
  onClose,
}: ModalItensEntradaProps) {
  const colunasProdutos: Column<ProdutoListaTable>[] = [
    {
      key: "produto_id",
      title: "Produto",

      render: (value) => {
        const produto = produtos.find((item) => item.id === value);

        return produto?.nome ?? "-";
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
    <Modal
      open={open}
      title={entrada ? `Itens da Entrada #${entrada.id}` : "Itens da Entrada"}
      onClose={onClose}
      tamanho="max"
    >
      {entrada && (
        <div className="entrada-info">
          <span>
            <strong>Nota Fiscal:</strong> {entrada.notaFiscal}
          </span>

          <span>
            <strong>Observação:</strong> {entrada.observacao || "-"}
          </span>
        </div>
      )}

      {carregando ? (
        <div>Carregando itens...</div>
      ) : itens.length === 0 ? (
        <div className="preview-vazio">
          <span>Nenhum item encontrado para esta entrada.</span>
        </div>
      ) : (
        <>
          <Table columns={colunasProdutos} data={itens} />

          <div className="footer-info">
            <span>Total de itens: {quantidadeTotal}</span>

            <span>
              Valor total:{" "}
              {valorTotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </>
      )}
    </Modal>
  );
}
