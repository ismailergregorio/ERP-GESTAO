import Modal from "../../Modal/Modal";

interface RelacionarProdutosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSim: () => void;
  onNao: () => void;
  loading?: boolean;
  title?: string;
  subtitulo?: string;
  descriacao?: string;
}

export default function RelacionarProdutosModal({
  isOpen,
  onClose,
  onSim,
  onNao,
  loading = false,
  title,
  subtitulo,
  descriacao
}: RelacionarProdutosModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width="450px"
      footer={
        <div className="relacionar-produtos-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onNao}
            disabled={loading}
          >
            Não
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onSim}
            disabled={loading}
          >
            Sim
          </button>
        </div>
      }
    >
      <div className="relacionar-produtos-content">
        <p>{subtitulo}</p>

        <span>
          {descriacao}
        </span>
      </div>
    </Modal>
  );
}
