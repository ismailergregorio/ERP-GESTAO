import type { Dispatch, SetStateAction } from "react";
import Table from "../../../Componete/Table/Table";
import type { Column } from "../../../Componete/Table/Table.types";
import type { Nf, ProdutoNfe } from "../Interfaces";

interface ConfigProps {
  nfe: Nf;
  setContadorNf: Dispatch<SetStateAction<number>>;
}
export default function DetalhesNf({ nfe, setContadorNf }: ConfigProps) {
  const colunasNf: Column<ProdutoNfe>[] = [
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
      key: "quantidade",
      title: "Qtd.",
      align: "center",
    },

    {
      key: "unidadeComercial",
      title: "Un.",
      align: "center",
    },

    {
      key: "valorUnitario",
      title: "V. Unitário",
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
      title: "V. Total",
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
    <div className="nf-confirmacao">
      {/* =========================================
          FORNECEDOR
      ========================================= */}

      <div className="nf-info">
        <div className="nf-section-title">
          <h3>Fornecedor</h3>
        </div>

        <div className="nf-info-grid">
          <div className="nf-info-item">
            <span>Razão Social</span>
            <strong>{nfe.fornecedor?.razaoSocial ?? "-"}</strong>
          </div>

          <div className="nf-info-item">
            <span>Nome Fantasia</span>
            <strong>{nfe.fornecedor?.nomeFantasia ?? "-"}</strong>
          </div>

          <div className="nf-info-item">
            <span>CNPJ</span>
            <strong>{nfe.fornecedor?.cnpj ?? "-"}</strong>
          </div>

          <div className="nf-info-item">
            <span>Inscrição Estadual</span>
            <strong>{nfe.fornecedor?.inscricaoEstadual ?? "-"}</strong>
          </div>

          <div className="nf-info-item">
            <span>CRT</span>
            <strong>{nfe.fornecedor?.crt ?? "-"}</strong>
          </div>
        </div>
      </div>

      {/* =========================================
          PRODUTOS
      ========================================= */}

      <div className="nf-produtos">
        <div className="nf-section-title">
          <h3>Produtos da Nota</h3>

          <span>{nfe.produto?.length ?? 0} produto(s)</span>
        </div>

        <Table<ProdutoNfe> columns={colunasNf} data={nfe.produto ?? []} />
      </div>

      <div className="nf-total">
        <span>Total dos Produtos</span>

        <strong>
          {nfe.produto
            ?.reduce(
              (total, produto) => total + Number(produto.valorTotal ?? 0),
              0,
            )
            .toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
        </strong>
      </div>

      {/* =========================================
          AÇÕES
      ========================================= */}

      <div className="modal-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={() => {
            // setNfe(null);
            // setArquivoXml(null);
            setContadorNf(2);
          }}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setContadorNf(3);
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
