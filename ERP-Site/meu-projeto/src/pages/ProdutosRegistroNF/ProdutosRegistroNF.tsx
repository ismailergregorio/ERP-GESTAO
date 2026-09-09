import { useEffect, useState } from "react";

import Table from "../../components/Table/Table";
import ProdutosRegistroNFModal from "../../components/ProdutosRegistroNFModal/ProdutosRegistroNFModal";

import { listarProdutosRegistroNF } from "../../services/produtosRegistroNFService";

import type { ProdutoRegistroNF } from "../../types/ProdutoRegistroNF";

import "./ProdutosRegistroNF.css";

export default function ProdutosRegistroNF() {
  const [produtos, setProdutos] = useState<ProdutoRegistroNF[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] =
    useState<ProdutoRegistroNF | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [loading, setLoading] = useState(false);

  const carregarProdutos = async () => {
    try {
      setLoading(true);

      const dados = await listarProdutosRegistroNF();

      setProdutos(dados);
    } catch (error) {
      console.error("Erro ao carregar produtos das notas fiscais:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const visualizarProduto = (produto: ProdutoRegistroNF) => {
    setProdutoSelecionado(produto);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setProdutoSelecionado(null);
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      width: "70px",
      align: "center" as const,
    },

    {
      key: "codigo",
      label: "Código",
    },

    {
      key: "descricao",
      label: "Descrição",
    },

    {
      key: "unidade",
      label: "Unidade",
      align: "center" as const,
    },

    {
      key: "quantidade",
      label: "Quantidade",
      align: "right" as const,
      render: (value: unknown) => {
        return Number(value).toLocaleString("pt-BR");
      },
    },

    {
      key: "valorUnitario",
      label: "Valor unitário",
      align: "right" as const,
      render: (value: unknown) => {
        return formatarMoeda(Number(value));
      },
    },

    {
      key: "valorTotal",
      label: "Valor total",
      align: "right" as const,
      render: (value: unknown) => {
        return formatarMoeda(Number(value));
      },
    },

    {
      key: "numeroNF",
      label: "NF",
      align: "center" as const,
    },

    {
      key: "dataCriacao",
      label: "Data",
      render: (value: unknown) => {
        return formatarData(String(value));
      },
    },

    {
      key: "ativo",
      label: "Status",
      align: "center" as const,
      render: (value: unknown) => {
        return (
          <span
            className={value ? "status-badge ativo" : "status-badge inativo"}
          >
            {value ? "Ativo" : "Inativo"}
          </span>
        );
      },
    },
  ];

  const actions = [
    {
      label: "Visualizar",
      variant: "secondary" as const,
      onClick: visualizarProduto,
    },
  ];

  return (
    <div className="produtos-registro-nf-page">
      <div className="page-header">
        <div>
          <h1>Produtos das Notas Fiscais</h1>

          <p>
            Consulte os produtos registrados durante a importação das notas
            fiscais.
          </p>
        </div>
      </div>

      <div className="produtos-registro-nf-card">
        <Table
          columns={columns}
          data={produtos}
          actions={actions}
          rowKey="id"
          loading={loading}
        />
      </div>

      <ProdutosRegistroNFModal
        isOpen={modalAberto}
        produto={produtoSelecionado}
        onClose={fecharModal}
      />
    </div>
  );
}
