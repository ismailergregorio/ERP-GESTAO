import { useEffect, useState } from "react";

import Modal from "../Modal/Modal";

import type { Fornecedor } from "../../types/Fornecedor";

import "./FornecedorModal.css";

interface FornecedorModalProps {
  isOpen: boolean;

  fornecedor?: Fornecedor | null;

  modo?: "criar" | "editar" | "visualizar";

  loading?: boolean;

  onClose: () => void;

  onSave: (dados: {
    razaoSocial: string;
    nomeFantasia: string;
    inscricaoEstadual: string;
    cnpj: string;
    telefone: string;
    email: string;
  }) => void;
}

export default function FornecedorModal({
  isOpen,

  fornecedor = null,

  modo = "criar",

  loading = false,

  onClose,

  onSave,
}: FornecedorModalProps) {
  /*
   * =====================================================
   * ESTADOS
   * =====================================================
   */

  const [razaoSocial, setRazaoSocial] = useState("");

  const [nomeFantasia, setNomeFantasia] = useState("");

  const [inscricaoEstadual, setInscricaoEstadual] = useState("");

  const [cnpj, setCnpj] = useState("");

  const [telefone, setTelefone] = useState("");

  const [email, setEmail] = useState("");

  /*
   * =====================================================
   * PREENCHER / LIMPAR FORMULÁRIO
   * =====================================================
   */

  useEffect(() => {
    if (fornecedor && (modo === "editar" || modo === "visualizar")) {
      setRazaoSocial(fornecedor.razaoSocial);

      setNomeFantasia(fornecedor.nomeFantasia);

      setInscricaoEstadual(fornecedor.inscricaoEstadual);

      setCnpj(fornecedor.cnpj);

      setTelefone(fornecedor.telefone);

      setEmail(fornecedor.email);
    } else {
      setRazaoSocial("");

      setNomeFantasia("");

      setInscricaoEstadual("");

      setCnpj("");

      setTelefone("");

      setEmail("");
    }
  }, [fornecedor, modo, isOpen]);

  /*
   * =====================================================
   * VISUALIZAÇÃO
   * =====================================================
   */

  const somenteVisualizacao = modo === "visualizar";

  /*
   * =====================================================
   * SALVAR
   * =====================================================
   */

  const handleSave = () => {
    if (!razaoSocial.trim()) {
      alert("Informe a razão social.");

      return;
    }

    if (!nomeFantasia.trim()) {
      alert("Informe o nome fantasia.");

      return;
    }

    if (!cnpj.trim()) {
      alert("Informe o CNPJ.");

      return;
    }

    if (!email.trim()) {
      alert("Informe o e-mail.");

      return;
    }

    onSave({
      razaoSocial: razaoSocial.trim(),

      nomeFantasia: nomeFantasia.trim(),

      inscricaoEstadual: inscricaoEstadual.trim(),

      cnpj: cnpj.trim(),

      telefone: telefone.trim(),

      email: email.trim(),
    });
  };

  /*
   * =====================================================
   * TÍTULO
   * =====================================================
   */

  const titulo =
    modo === "visualizar"
      ? "Visualizar Fornecedor"
      : modo === "editar"
        ? "Editar Fornecedor"
        : "Novo Fornecedor";

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      title={titulo}
      width="750px"
      footer={
        somenteVisualizacao ? (
          <button type="button" className="button-secondary" onClick={onClose}>
            Fechar
          </button>
        ) : (
          <>
            <button
              type="button"
              className="button-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="button-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading
                ? "Salvando..."
                : modo === "editar"
                  ? "Salvar Alterações"
                  : "Cadastrar Fornecedor"}
            </button>
          </>
        )
      }
    >
      <div className="fornecedor-form">
        {/* =================================================
            DADOS DA EMPRESA
           ================================================= */}

        <div className="form-section">
          <h3>Dados da Empresa</h3>

          <div className="form-group">
            <label htmlFor="razaoSocial">
              Razão Social
              {!somenteVisualizacao && <span>*</span>}
            </label>

            <input
              id="razaoSocial"
              type="text"
              value={razaoSocial}
              disabled={somenteVisualizacao}
              onChange={(event) => setRazaoSocial(event.target.value)}
              placeholder="Ex.: Empresa LTDA"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nomeFantasia">
              Nome Fantasia
              {!somenteVisualizacao && <span>*</span>}
            </label>

            <input
              id="nomeFantasia"
              type="text"
              value={nomeFantasia}
              disabled={somenteVisualizacao}
              onChange={(event) => setNomeFantasia(event.target.value)}
              placeholder="Ex.: Minha Empresa"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="cnpj">
                CNPJ
                {!somenteVisualizacao && <span>*</span>}
              </label>

              <input
                id="cnpj"
                type="text"
                value={cnpj}
                maxLength={18}
                disabled={somenteVisualizacao}
                onChange={(event) => setCnpj(formatarCnpj(event.target.value))}
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="inscricaoEstadual">Inscrição Estadual</label>

              <input
                id="inscricaoEstadual"
                type="text"
                value={inscricaoEstadual}
                disabled={somenteVisualizacao}
                onChange={(event) => setInscricaoEstadual(event.target.value)}
                placeholder="Ex.: 123456789"
              />
            </div>
          </div>
        </div>

        {/* =================================================
            CONTATO
           ================================================= */}

        <div className="form-section">
          <h3>Informações de Contato</h3>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>

              <input
                id="telefone"
                type="text"
                value={telefone}
                maxLength={15}
                disabled={somenteVisualizacao}
                onChange={(event) =>
                  setTelefone(formatarTelefone(event.target.value))
                }
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                E-mail
                {!somenteVisualizacao && <span>*</span>}
              </label>

              <input
                id="email"
                type="email"
                value={email}
                disabled={somenteVisualizacao}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="empresa@email.com"
              />
            </div>
          </div>
        </div>

        {/* =================================================
            INFORMAÇÕES
           ================================================= */}

        {somenteVisualizacao && fornecedor && (
          <div className="fornecedor-info">
            <div>
              <span>Status</span>

              <strong
                className={
                  fornecedor.ativo ? "status-active" : "status-inactive"
                }
              >
                {fornecedor.ativo ? "Ativo" : "Inativo"}
              </strong>
            </div>

            <div>
              <span>Data de Criação</span>

              <strong>{formatarData(fornecedor.dataCriacao)}</strong>
            </div>

            <div>
              <span>Última Atualização</span>

              <strong>
                {fornecedor.dataUpdate
                  ? formatarData(fornecedor.dataUpdate)
                  : "Nunca atualizado"}
              </strong>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/*
 * =====================================================
 * CNPJ
 * =====================================================
 */

function formatarCnpj(valor: string): string {
  const numeros = valor.replace(/\D/g, "").slice(0, 14);

  if (numeros.length <= 2) {
    return numeros;
  }

  if (numeros.length <= 5) {
    return `${numeros.slice(0, 2)}.${numeros.slice(2)}`;
  }

  if (numeros.length <= 8) {
    return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}`;
  }

  if (numeros.length <= 12) {
    return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8)}`;
  }

  return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8, 12)}-${numeros.slice(12)}`;
}

/*
 * =====================================================
 * TELEFONE
 * =====================================================
 */

function formatarTelefone(valor: string): string {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  if (numeros.length <= 2) {
    return numeros;
  }

  if (numeros.length <= 7) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  }

  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

/*
 * =====================================================
 * DATA
 * =====================================================
 */

function formatarData(data: string): string {
  const date = new Date(data);

  if (Number.isNaN(date.getTime())) {
    return data;
  }

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
