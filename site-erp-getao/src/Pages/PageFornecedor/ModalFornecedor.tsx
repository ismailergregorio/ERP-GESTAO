import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../Componete/Modal/Modal";
import api from "../../Services/Api";

/* =====================================================
   INTERFACES
===================================================== */

export interface Fornecedor {
  id: number;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  cnpj: string;
  telefone: string;
  email: string;
  dataCriacao: string;
}

interface FornecedorForm {
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  cnpj: string;
  telefone: string;
  email: string;
}

/* =====================================================
   FORMULÁRIO INICIAL
===================================================== */

const formularioInicial: FornecedorForm = {
  razaoSocial: "",
  nomeFantasia: "",
  inscricaoEstadual: "",
  cnpj: "",
  telefone: "",
  email: "",
};

/* =====================================================
   PROPS
===================================================== */

interface ModalFornecedorProps {
  open: boolean;

  /**
   * Fornecedor que será editado.
   * null = novo fornecedor
   */
  fornecedor?: Fornecedor | null;

  /**
   * Fecha o modal
   */
  onClose: () => void;

  /**
   * Executado depois que salvar com sucesso.
   * O pai pode usar para atualizar a tabela.
   */
  onSuccess: () => void;
}

/* =====================================================
   COMPONENTE
===================================================== */

export default function ModalFornecedor({
  open,
  fornecedor,
  onClose,
  onSuccess,
}: ModalFornecedorProps) {

  /* =====================================================
     ESTADOS
  ===================================================== */

  const [formulario, setFormulario] =
    useState<FornecedorForm>(formularioInicial);

  const [salvando, setSalvando] = useState(false);

  /* =====================================================
     MODO
  ===================================================== */

  const editando = fornecedor !== null;

  /* =====================================================
     CARREGAR FORMULÁRIO
  ===================================================== */

  useEffect(() => {
    if (fornecedor) {
      setFormulario({
        razaoSocial: fornecedor.razaoSocial,
        nomeFantasia: fornecedor.nomeFantasia,
        inscricaoEstadual: fornecedor.inscricaoEstadual,
        cnpj: fornecedor.cnpj,
        telefone: fornecedor.telefone,
        email: fornecedor.email,
      });
    } else {
      setFormulario(formularioInicial);
    }
  }, [fornecedor, open]);

  /* =====================================================
     ALTERAR CAMPO
  ===================================================== */

  function alterarCampo(
    campo: keyof FornecedorForm,
    valor: string,
  ) {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  /* =====================================================
     MÁSCARA CNPJ
  ===================================================== */

  function formatarCnpj(valor: string) {
    valor = valor
      .replace(/\D/g, "")
      .slice(0, 14);

    valor = valor.replace(
      /^(\d{2})(\d)/,
      "$1.$2",
    );

    valor = valor.replace(
      /^(\d{2})\.(\d{3})(\d)/,
      "$1.$2.$3",
    );

    valor = valor.replace(
      /\.(\d{3})(\d)/,
      ".$1/$2",
    );

    valor = valor.replace(
      /(\d{4})(\d)/,
      "$1-$2",
    );

    return valor;
  }

  /* =====================================================
     MÁSCARA TELEFONE
  ===================================================== */

  function formatarTelefone(valor: string) {
    valor = valor
      .replace(/\D/g, "")
      .slice(0, 11);

    if (valor.length <= 10) {
      valor = valor.replace(
        /^(\d{2})(\d)/,
        "($1) $2",
      );

      valor = valor.replace(
        /(\d{4})(\d)/,
        "$1-$2",
      );
    } else {
      valor = valor.replace(
        /^(\d{2})(\d)/,
        "($1) $2",
      );

      valor = valor.replace(
        /(\d{5})(\d)/,
        "$1-$2",
      );
    }

    return valor;
  }

  /* =====================================================
     ALTERAR CNPJ
  ===================================================== */

  function alterarCnpj(valor: string) {
    alterarCampo(
      "cnpj",
      formatarCnpj(valor),
    );
  }

  /* =====================================================
     ALTERAR TELEFONE
  ===================================================== */

  function alterarTelefone(valor: string) {
    alterarCampo(
      "telefone",
      formatarTelefone(valor),
    );
  }

  /* =====================================================
     VALIDAÇÃO
  ===================================================== */

  function validarFormulario() {

    if (!formulario.razaoSocial.trim()) {
      toast.warning("Informe a razão social.");
      return false;
    }

    if (!formulario.nomeFantasia.trim()) {
      toast.warning("Informe o nome fantasia.");
      return false;
    }

    if (!formulario.inscricaoEstadual.trim()) {
      toast.warning(
        "Informe a inscrição estadual.",
      );
      return false;
    }

    if (!formulario.cnpj.trim()) {
      toast.warning("Informe o CNPJ.");
      return false;
    }

    if (!formulario.telefone.trim()) {
      toast.warning("Informe o telefone.");
      return false;
    }

    if (!formulario.email.trim()) {
      toast.warning("Informe o e-mail.");
      return false;
    }

    return true;
  }

  /* =====================================================
     ADICIONAR
  ===================================================== */

  async function adicionarFornecedor() {

    if (!validarFormulario()) {
      return;
    }

    try {
      setSalvando(true);

      await api.post("/fornecedores", {
        razaoSocial: formulario.razaoSocial,
        nomeFantasia: formulario.nomeFantasia,
        inscricaoEstadual:
          formulario.inscricaoEstadual,
        cnpj: formulario.cnpj.replace(/\D/g, ""),
        telefone: formulario.telefone,
        email: formulario.email,
      });

      toast.success(
        "Fornecedor adicionado com sucesso!",
      );

      onSuccess();
      fecharModal();

    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ??
          "Erro ao cadastrar fornecedor.",
      );
    } finally {
      setSalvando(false);
    }
  }

  /* =====================================================
     EDITAR
  ===================================================== */

  async function editarFornecedor() {

    if (!fornecedor) {
      return;
    }

    if (!validarFormulario()) {
      return;
    }

    try {
      setSalvando(true);

      await api.put(
        `/fornecedores/${fornecedor.id}`,
        {
          razaoSocial: formulario.razaoSocial,
          nomeFantasia: formulario.nomeFantasia,
          inscricaoEstadual:
            formulario.inscricaoEstadual,
          cnpj: formulario.cnpj.replace(/\D/g, ""),
          telefone: formulario.telefone,
          email: formulario.email,
        },
      );

      toast.success(
        "Fornecedor atualizado com sucesso!",
      );

      onSuccess();
      fecharModal();

    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ??
          "Erro ao atualizar fornecedor.",
      );
    } finally {
      setSalvando(false);
    }
  }

  /* =====================================================
     SALVAR
  ===================================================== */

  async function salvarFornecedor() {

    if (editando) {
      await editarFornecedor();
    } else {
      await adicionarFornecedor();
    }
  }

  /* =====================================================
     FECHAR
  ===================================================== */

  function fecharModal() {
    setFormulario(formularioInicial);
    onClose();
  }

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <Modal
      open={open}
      title={
        editando
          ? "Editar Fornecedor"
          : "Novo Fornecedor"
      }
      onClose={fecharModal}
    >
      <div className="form-modal">

        {/* RAZÃO SOCIAL */}

        <div className="form-group">
          <label>Razão Social</label>

          <input
            type="text"
            value={formulario.razaoSocial}
            onChange={(e) =>
              alterarCampo(
                "razaoSocial",
                e.target.value,
              )
            }
          />
        </div>

        {/* NOME FANTASIA */}

        <div className="form-group">
          <label>Nome Fantasia</label>

          <input
            type="text"
            value={formulario.nomeFantasia}
            onChange={(e) =>
              alterarCampo(
                "nomeFantasia",
                e.target.value,
              )
            }
          />
        </div>

        {/* INSCRIÇÃO ESTADUAL */}

        <div className="form-group">
          <label>Inscrição Estadual</label>

          <input
            type="text"
            value={formulario.inscricaoEstadual}
            onChange={(e) =>
              alterarCampo(
                "inscricaoEstadual",
                e.target.value,
              )
            }
          />
        </div>

        {/* CNPJ */}

        <div className="form-group">
          <label>CNPJ</label>

          <input
            type="text"
            value={formulario.cnpj}
            onChange={(e) =>
              alterarCnpj(e.target.value)
            }
          />
        </div>

        {/* TELEFONE */}

        <div className="form-group">
          <label>Telefone</label>

          <input
            type="text"
            value={formulario.telefone}
            onChange={(e) =>
              alterarTelefone(e.target.value)
            }
          />
        </div>

        {/* E-MAIL */}

        <div className="form-group">
          <label>E-mail</label>

          <input
            type="email"
            value={formulario.email}
            onChange={(e) =>
              alterarCampo(
                "email",
                e.target.value,
              )
            }
          />
        </div>

        {/* AÇÕES */}

        <div className="modal-actions">

          <button
            type="button"
            className="btn-cancel"
            onClick={fecharModal}
            disabled={salvando}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={salvarFornecedor}
            disabled={salvando}
          >
            {salvando
              ? "Salvando..."
              : editando
                ? "Salvar alterações"
                : "Adicionar"}
          </button>

        </div>

      </div>
    </Modal>
  );
}