import type { ReactNode } from "react";
import { X } from "lucide-react";
import "./Modal-css.css";

interface ModalProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  tamanho?: "min" | "max";

}

export default function Modal({
  open,
  title,
  children,
  onClose,
  tamanho,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={"modal-overlay"} onClick={onClose}>
      <div
        className={`modal ${tamanho ?? ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>

          <button type="button" className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
