import type { ProdutoRegistroNF } from "../../types/ProdutoRegistroNF";
import Modal from "../Modal/Modal";

import "./ProdutosRegistroNFModal.css";

interface ProdutosRegistroNFModalProps {
  isOpen: boolean;
  produto?: ProdutoRegistroNF | null;
  onClose: () => void;
}

export default function ProdutosRegistroNFModal({
  isOpen,
  produto,
  onClose,
}: ProdutosRegistroNFModalProps) {
  if (!produto) {
    return null;
  }

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarData = (data: string | null) => {
    if (!data) {
      return "-";
    }

    return new Date(data).toLocaleString("pt-BR");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={(aberto) => {
        if (!aberto) {
          onClose();
        }
      }}
      title="Visualizar produto da NF"
      footer={
        <button type="button" className="btn-secondary" onClick={onClose}>
          Fechar
        </button>
      }
    >
      <div className="produto-nf-modal">
        <section className="produto-nf-section">
          <h3>Informações do produto</h3>

          <div className="produto-nf-info-grid">
            <div className="produto-nf-info">
              <span>Código</span>
              <strong>{produto.codigo}</strong>
            </div>

            <div className="produto-nf-info">
              <span>Descrição</span>
              <strong>{produto.descricao}</strong>
            </div>

            <div className="produto-nf-info">
              <span>Unidade</span>
              <strong>{produto.unidade}</strong>
            </div>

            <div className="produto-nf-info">
              <span>Status</span>

              <strong
                className={produto.ativo ? "status-ativo" : "status-inativo"}
              >
                {produto.ativo ? "Ativo" : "Inativo"}
              </strong>
            </div>
          </div>
        </section>

        <section className="produto-nf-section">
          <h3>Valores</h3>

          <div className="produto-nf-info-grid">
            <div className="produto-nf-info">
              <span>Quantidade</span>
              <strong>{produto.quantidade}</strong>
            </div>

            <div className="produto-nf-info">
              <span>Valor unitário</span>
              <strong>{formatarMoeda(produto.valorUnitario)}</strong>
            </div>

            <div className="produto-nf-info">
              <span>Valor total</span>
              <strong>{formatarMoeda(produto.valorTotal)}</strong>
            </div>
          </div>
        </section>

        <section className="produto-nf-section">
          <h3>Nota fiscal</h3>

          <div className="produto-nf-info-grid">
            <div className="produto-nf-info">
              <span>NF</span>
              <strong>{produto.numeroNF}</strong>
            </div>

            <div className="produto-nf-info">
              <span>ID da NF</span>
              <strong>{produto.nfId}</strong>
            </div>
          </div>
        </section>

        <section className="produto-nf-section">
          <h3>Registro</h3>

          <div className="produto-nf-info-grid">
            <div className="produto-nf-info">
              <span>Data de criação</span>
              <strong>{formatarData(produto.dataCriacao)}</strong>
            </div>

            <div className="produto-nf-info">
              <span>Última atualização</span>
              <strong>{formatarData(produto.dataUpdate)}</strong>
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
}
