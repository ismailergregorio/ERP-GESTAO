import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../Componete/Modal/Modal";
import api from "../../Services/Api";
import type { FornecedorNf } from "../PageEstoqueEntrada/Interfaces";

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

interface FornecedorNew {
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  cnpj: string;
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

const formularioNewInicial: FornecedorNew = {
  razaoSocial: "",
  nomeFantasia: "",
  inscricaoEstadual: "",
  cnpj: "",
};

/* =====================================================
   PROPS
===================================================== */

interface ModalFornecedorProps {
  open: boolean;

  /**
   * Fornecedor que será editado.
   * null ou undefined = novo fornecedor
   */
  fornecedor?: Fornecedor | null;

  dadosFornecedor?: FornecedorNf;

  /**
   * Fecha o modal
   */
  onClose: () => void;

  /**
   * Executado depois que salvar com sucesso.
   */
  onSuccess: () => void;
}

/* =====================================================
   COMPONENTE
===================================================== */

export default function ModalFornecedor({
  open,
  fornecedor,
  dadosFornecedor,
  onClose,
  onSuccess,
}: ModalFornecedorProps) {
  /* =====================================================
     ESTADOS
  ===================================================== */

  const [formulario, setFormulario] =
    useState<FornecedorForm>(formularioInicial);

  const [formularioNew, setFormularioNew] =
    useState<FornecedorNew>(formularioNewInicial);

  const [salvando, setSalvando] = useState(false);

  /* =====================================================
     MODO
  ===================================================== */

  // null ou undefined = novo
  const editando = !!fornecedor;

  /* =====================================================
     CARREGAR FORNECEDOR PARA EDIÇÃO
  ===================================================== */

  useEffect(() => {
    if (!open) {
      return;
    }

    if (fornecedor) {
      setFormulario({
        razaoSocial: fornecedor.razaoSocial ?? "",
        nomeFantasia: fornecedor.nomeFantasia ?? "",
        inscricaoEstadual: fornecedor.inscricaoEstadual ?? "",
        cnpj: fornecedor.cnpj ?? "",
        telefone: fornecedor.telefone ?? "",
        email: fornecedor.email ?? "",
      });

      setFormularioNew(formularioNewInicial);
    } else {
      setFormulario(formularioInicial);

      setFormularioNew({
        razaoSocial: "",
        nomeFantasia: "",
        inscricaoEstadual: "",
        cnpj: "",
      });
    }
  }, [fornecedor, open]);

  /* =====================================================
     CARREGAR DADOS DO FORNECEDOR NOVO
  ===================================================== */

  useEffect(() => {
    if (!open || !dadosFornecedor || fornecedor) {
      return;
    }

    const novoFornecedor: FornecedorNew = {
      razaoSocial: dadosFornecedor.razaoSocial ?? "",
      nomeFantasia: dadosFornecedor.nomeFantasia ?? "",
      inscricaoEstadual: dadosFornecedor.inscricaoEstadual ?? "",
      cnpj: dadosFornecedor.cnpj ?? "",
    };

    setFormularioNew(novoFornecedor);

    // Também coloca os dados no formulário principal,
    // pois é ele que será enviado no POST.
    setFormulario((prev) => ({
      ...prev,
      razaoSocial: novoFornecedor.razaoSocial,
      nomeFantasia: novoFornecedor.nomeFantasia,
      inscricaoEstadual: novoFornecedor.inscricaoEstadual,
      cnpj: novoFornecedor.cnpj,
    }));
  }, [dadosFornecedor, open, fornecedor]);

  /* =====================================================
     ALTERAR CAMPO
  ===================================================== */

  function alterarCampo(
    campo: keyof FornecedorForm,
    valor: string
  ) {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));

    // Mantém o formulárioNew sincronizado quando
    // estiver no modo de novo fornecedor.
    if (!editando && campo in formularioNew) {
      setFormularioNew((prev) => ({
        ...prev,
        [campo]: valor,
      }));
    }
  }

  /* =====================================================
     MÁSCARA CNPJ
  ===================================================== */

  function formatarCnpj(valor: string) {
    valor = valor.replace(/\D/g, "").slice(0, 14);

    valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");

    valor = valor.replace(
      /^(\d{2})\.(\d{3})(\d)/,
      "$1.$2.$3"
    );

    valor = valor.replace(
      /\.(\d{3})(\d)/,
      ".$1/$2"
    );

    valor = valor.replace(
      /(\d{4})(\d)/,
      "$1-$2"
    );

    return valor;
  }

  /* =====================================================
     MÁSCARA TELEFONE
  ===================================================== */

  function formatarTelefone(valor: string) {
    valor = valor.replace(/\D/g, "").slice(0, 11);

    if (valor.length <= 10) {
      valor = valor.replace(
        /^(\d{2})(\d)/,
        "($1) $2"
      );

      valor = valor.replace(
        /(\d{4})(\d)/,
        "$1-$2"
      );
    } else {
      valor = valor.replace(
        /^(\d{2})(\d)/,
        "($1) $2"
      );

      valor = valor.replace(
        /(\d{5})(\d)/,
        "$1-$2"
      );
    }

    return valor;
  }

  /* =====================================================
     ALTERAR CNPJ
  ===================================================== */

  function alterarCnpj(valor: string) {
    alterarCampo("cnpj", formatarCnpj(valor));
  }

  /* =====================================================
     ALTERAR TELEFONE
  ===================================================== */

  function alterarTelefone(valor: string) {
    alterarCampo(
      "telefone",
      formatarTelefone(valor)
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
      toast.warning("Informe a inscrição estadual.");
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
        inscricaoEstadual: formulario.inscricaoEstadual,
        cnpj: formulario.cnpj.replace(/\D/g, ""),
        telefone: formulario.telefone,
        email: formulario.email,
      });

      toast.success(
        "Fornecedor adicionado com sucesso!"
      );

      onSuccess();
      fecharModal();
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ??
          "Erro ao cadastrar fornecedor."
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
        }
      );

      toast.success(
        "Fornecedor atualizado com sucesso!"
      );

      onSuccess();
      fecharModal();
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ??
          "Erro ao atualizar fornecedor."
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
    setFormularioNew(formularioNewInicial);

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
                e.target.value
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
                e.target.value
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
                e.target.value
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
                e.target.value
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
