import Modal from "../../Componete/Modal/Modal";

interface FornecedorForm {
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  cnpj: string;
  telefone: string;
  email: string;
}

interface ModalFornecedorProps {
  open: boolean;
  editando: boolean;
  formulario: FornecedorForm;
  onClose: () => void;
  onChange: (campo: keyof FornecedorForm, valor: string) => void;
  onSalvar: () => void;
}

export default function ModalFornecedor({
  open,
  editando,
  formulario,
  onClose,
  onChange,
  onSalvar,
}: ModalFornecedorProps) {

  return (
    <Modal
      open={open}
      title={editando ? "Editar Fornecedor" : "Novo Fornecedor"}
      onClose={onClose}
    >
      <div className="form-modal">

        <div className="form-group">
          <label>Razão Social</label>

          <input
            type="text"
            value={formulario.razaoSocial}
            onChange={(e) =>
              onChange("razaoSocial", e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>Nome Fantasia</label>

          <input
            type="text"
            value={formulario.nomeFantasia}
            onChange={(e) =>
              onChange("nomeFantasia", e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>Inscrição Estadual</label>

          <input
            type="text"
            value={formulario.inscricaoEstadual}
            onChange={(e) =>
              onChange(
                "inscricaoEstadual",
                e.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>CNPJ</label>

          <input
            type="text"
            value={formulario.cnpj}
            onChange={(e) =>
              onChange("cnpj", e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>Telefone</label>

          <input
            type="text"
            value={formulario.telefone}
            onChange={(e) =>
              onChange("telefone", e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>E-mail</label>

          <input
            type="email"
            value={formulario.email}
            onChange={(e) =>
              onChange("email", e.target.value)
            }
          />
        </div>

        <div className="modal-actions">

          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={onSalvar}
          >
            {editando ? "Salvar alterações" : "Adicionar"}
          </button>

        </div>

      </div>
    </Modal>
  );
}