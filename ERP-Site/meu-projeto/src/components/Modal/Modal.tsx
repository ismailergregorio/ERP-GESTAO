import { useEffect, type ReactNode } from "react";

import { X } from "lucide-react";

import "./Modal.css";

interface ModalProps {
  isOpen: boolean;

  onClose: () => void;

  onOpenChange?: (isOpen: boolean) => void;

  title?: string;

  children: ReactNode;

  footer?: ReactNode;

  width?: string;

  closeOnOverlayClick?: boolean;

  closeOnEscape?: boolean;

  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,

  onClose,

  onOpenChange,

  title,

  children,

  footer,

  width = "600px",

  closeOnOverlayClick = true,

  closeOnEscape = true,

  showCloseButton = true,
}: ModalProps) {
  /*
   * =====================================================
   * FECHAR MODAL
   * =====================================================
   */

  const handleClose = () => {
    onClose();

    onOpenChange?.(false);
  };

  /*
   * =====================================================
   * ESC
   * =====================================================
   */

  useEffect(() => {
    if (!isOpen || !closeOnEscape) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEscape]);

  /*
   * =====================================================
   * BLOQUEAR SCROLL DA PÁGINA
   * =====================================================
   */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  /*
   * =====================================================
   * NÃO RENDERIZAR
   * =====================================================
   */

  if (!isOpen) {
    return null;
  }

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="modal"
        style={{
          maxWidth: width,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* HEADER */}

        <div className="modal-header">
          <div className="modal-title-container">
            {title && <h2 id="modal-title">{title}</h2>}
          </div>

          {showCloseButton && (
            <button
              type="button"
              className="modal-close"
              onClick={handleClose}
              aria-label="Fechar modal"
            >
              <X size={21} />
            </button>
          )}
        </div>

        {/* CONTEÚDO */}

        <div className="modal-body">{children}</div>

        {/* FOOTER */}

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
