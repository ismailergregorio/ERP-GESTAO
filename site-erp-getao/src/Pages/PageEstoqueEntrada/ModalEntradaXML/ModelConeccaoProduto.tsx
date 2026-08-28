import { Eye, Link } from "lucide-react";
import Table from "../../../Componete/Table/Table";
import type { Column } from "../../../Componete/Table/Table.types";
import type { Nf, Produto } from "../Interfaces";
import { useEffect, useState } from "react";
import { getProduto, getProdutos } from "../Functions";
import ProdutosListaEstoque from "./ModalListarProdutosEstoque";
import type { TabelaProdutos } from "../../PageProdutos";

interface ConfigProps {
  dadosNF: Nf;
}

export interface DadosTableSelectProduto {
  id: number;
  codigo: string;
  descricao: string;
  quantidadeNf: number;
  valorTotal: number;
  itenSelecionado: number | null;
  quatidadeEstoque: number | null;
}

export default function ModelConeccaoProduto({ dadosNF }: ConfigProps) {
  const [dadosNota, setDadosNota] = useState<DadosTableSelectProduto[]>([]);
  const [produtos, setProdutos] = useState<TabelaProdutos[]>([]);
  const [controleModalProsdutos, setControleModalProsdutos] =
    useState<boolean>();
  const [idProdutoSelecionado, setIdProdutoSelecionado] = useState<number>();
  const [dadosDaRelacao, setDadosDaRelacao] = useState();

  function fecharModal() {
    setControleModalProsdutos(false);
  }

  async function BuscarProduto() {
    const p = await getProdutos();
    setProdutos(p);
  }

  useEffect(() => {
    const dadosfomatados = dadosNF.produto.map((p) => ({
      id: p.id,
      codigo: p.codigo,
      descricao: p.descricao,
      quantidadeNf: p.quantidade,
      valorTotal: p.valorTotal,
      itenSelecionado: null,
      quatidadeEstoque: null,
    }));

    setDadosNota(dadosfomatados);

    BuscarProduto();
  }, [dadosNF]);

  function selecionarProduto(produtoId: number, quantidadeUnidades: number) {
    if (idProdutoSelecionado === null) {
      return;
    }

    setDadosNota((lista) =>
      lista.map((item) =>
        item.id === idProdutoSelecionado
          ? {
              ...item,
              itenSelecionado: produtoId,
            }
          : item,
      ),
    );

    console.log("Produto estoque:", produtoId);
    console.log("Quantidade em unidades:", quantidadeUnidades);

    fecharModal();
  }
  const colunasNf: Column<DadosTableSelectProduto>[] = [
    {
      key: "id",
      title: "Id",
      align: "center",
    },
    {
      key: "codigo",
      title: "Código",
      align: "center",
    },

    {
      key: "descricao",
      title: "Produto",
    },

    {
      key: "quantidadeNf",
      title: "Qtd.Nf",
      align: "center",
    },
    {
      key: "valorTotal",
      title: "V. Total",
      align: "right",

      render: (value) => {
        return Number(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
    {
      key: "itenSelecionado",
      title: "Iten Selecinado",
      align: "center",
      render: (value) => {
        if (!value) return "Não Definido";
        return produtos.find((p) => p.id == value)?.nome;
      },
    },
    {
      key: "quatidadeEstoque",
      title: "Quan.Est",
      align: "center",
      render: (value) => {
        if (!value) return 0;
      },
    },
  ];

  function abrirModal(id: number) {
    setControleModalProsdutos(true);
    setIdProdutoSelecionado(id);
  }

  return (
    <div>
      <Table columns={colunasNf} data={dadosNota}>
        {(buton) => (
          <>
            <button
              type="button"
              title="Adicionar"
              className="action-button"
              onClick={() => abrirModal(buton.id)}
            >
              <Link size={18} />
            </button>
          </>
        )}
      </Table>
      {controleModalProsdutos && (
        <ProdutosListaEstoque
          opem={controleModalProsdutos}
          produtosRelacao={dadosNota}
          idProduto={idProdutoSelecionado}
          onClose={fecharModal}
          onSelecionar={selecionarProduto}
        />
      )}
    </div>
  );
}
