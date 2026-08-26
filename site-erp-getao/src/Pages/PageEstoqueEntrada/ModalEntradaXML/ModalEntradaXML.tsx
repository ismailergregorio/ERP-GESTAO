import { useEffect, useState } from "react";
import Modal from "../../../Componete/Modal/Modal";
import ImportXml from "./ModalImportXML";

interface ConfigModalprops {
  stadoModal?: boolean;
  onClose: () => void;
}
export default function modalEntradaNfXML({
  stadoModal = false,
  onClose,
}: ConfigModalprops) {
  const [contadorImport, setContadorImport] = useState<number>(1);

  function openModal() {}

  function fecharModal() {
    onClose();
  }
  return (
    <Modal
      open={stadoModal}
      title="Importar Nota Fiscal"
      onClose={fecharModal}
      tamanho="max"
    >
      {contadorImport == 1 && <ImportXml />}
      {contadorImport === 2 && nfe && (
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

          {/* =========================================
        TOTAL
    ========================================= */}

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
                setNfe(null);
                setArquivoXml(null);
                setContadorImport(1);
              }}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setContadorImport(3);
              }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
