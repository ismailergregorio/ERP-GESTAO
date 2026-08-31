import { useState, type Dispatch, type SetStateAction } from "react";
import Table from "../../../Componete/Table/Table";
import type { Column } from "../../../Componete/Table/Table.types";
import type { Nf, ProdutoNfe } from "../Interfaces";
import ModalFornecedor from "../../PageFornecedor/ModalFornecedor";
import { getFornecedorCnpj, getFornecedores } from "../Functions";

interface ConfigProps {
  nfe: Nf;
  setContadorNf: Dispatch<SetStateAction<number>>;
}
export default function DetalhesNf({ nfe, setContadorNf }: ConfigProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [fornecedor, setFornecedor] = useState(true);

  async function proximaTela(cnpj: string) {
    const reposta = await getFornecedorCnpj(cnpj);

    if (!reposta) {
      setFornecedor(false);
      setModalOpen(true);
      console.log(nfe)
    }

    if (reposta) {
      setContadorNf(3);
      setFornecedor(true);
    }
  }

  async function VerificaFornecedorExste(cnpj: string) {
    const reposta = await getFornecedorCnpj(cnpj);
    console.log(reposta);
    if (!reposta) {
      setFornecedor(false);
      setModalOpen(true);
    }
  }

  function fecharModalFornecedor() {
    setModalOpen(false);
  }

  async function fornecedorSalvo() {
    await getFornecedores();
    setModalOpen(false);
  }

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

      <div className="modal-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={() => VerificaFornecedorExste(nfe.fornecedor.cnpj)}
        >
          Entrada sem conexão
        </button>
        <div className="buntos-xml">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => {
              setContadorNf(2);
            }}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              proximaTela(nfe.fornecedor.cnpj);
            }}
          >
            Continuar
          </button>
        </div>
      </div>

      <ModalFornecedor
        open={modalOpen}
        fornecedor={null}
        dadosFornecedor={nfe.fornecedor}
        onClose={fecharModalFornecedor}
        onSuccess={fornecedorSalvo}
      />
    </div>
  );
}
