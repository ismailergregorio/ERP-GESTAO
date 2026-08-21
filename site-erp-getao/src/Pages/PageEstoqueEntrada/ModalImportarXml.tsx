import Modal from "../../Componete/Modal/Modal";

interface ModalImportarXmlProps {
  open: boolean;
  arquivo: File | null;
  onClose: () => void;
  onSalvar: () => void;
  setArquivo: (arquivo: File | null) => void;
}

export default function ModalImportarXml({
  open,
  arquivo,
  onClose,
  onSalvar,
  setArquivo,
}: ModalImportarXmlProps) {
  return (
    <Modal open={open} title="Importar Nota Fiscal" onClose={onClose}>
      <div className="form-modal">
        <div className="form-group">
          <div>
            <label htmlFor="xml">Arquivo XML da Nota Fiscal</label>

            <input
              id="xml"
              type="file"
              accept=".xml,text/xml"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;

                setArquivo(file);
              }}
            />
          </div>

          {arquivo && (
            <div>
              <strong>Arquivo selecionado:</strong>

              <p>{arquivo.name}</p>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={onSalvar}
            disabled={!arquivo}
          >
            Importar XML
          </button>
        </div>
      </div>
    </Modal>
  );
}
