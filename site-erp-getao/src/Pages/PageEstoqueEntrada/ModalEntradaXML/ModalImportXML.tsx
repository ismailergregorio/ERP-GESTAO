import { Upload } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";

import type { Nf } from "../Interfaces";
import api from "../../../Services/Api";
import ModalFornecedor from "../../PageFornecedor/ModalFornecedor";
import { getFornecedores } from "../Functions";

interface ConfigModalProps {
  setDadosNf: Dispatch<SetStateAction<Nf | undefined>>;
  setContadorNf: Dispatch<SetStateAction<number>>;
  setClose: () => void;
}

export default function ImportXml({
  setDadosNf,
  setContadorNf,
  setClose,
}: ConfigModalProps) {

  /* =====================================================
     ESTADOS
  ===================================================== */

  const [arquivoXml, setArquivoXml] =
    useState<File | null>(null);

  const [carregandoXml, setCarregandoXml] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  /* =====================================================
     SELECIONAR XML
  ===================================================== */

  function selecionarXml(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    const ehXml =
      arquivo.type === "text/xml" ||
      arquivo.name.toLowerCase().endsWith(".xml");

    if (!ehXml) {
      toast.error("Selecione um arquivo XML.");

      event.target.value = "";

      return;
    }

    setArquivoXml(arquivo);
  }

  /* =====================================================
     IMPORTAR XML
  ===================================================== */

  async function importarXml() {

    if (!arquivoXml) {
      toast.warning("Selecione um arquivo XML.");
      return;
    }

    try {
      setCarregandoXml(true);

      const formData = new FormData();

      formData.append(
        "arquivo",
        arquivoXml,
      );

      const resposta = await api.post(
        "/nfe/importar",
        formData,
      );

      console.log(
        "Resposta da NF-e:",
        resposta.data,
      );

      const produtos =
        resposta.data.produto.map(
          (produto: any, index: number) => ({
            ...produto,
            id: index + 1,
          }),
        );

      setDadosNf({
        ...resposta.data,
        produto: produtos,
      });

      toast.success(
        "NF-e importada com sucesso.",
      );

      setArquivoXml(null);

      setContadorNf(2);

    } catch (e: any) {

      console.error(
        "Erro ao importar XML:",
        e,
      );

      const mensagem = String(
        e.response?.data?.message ??
        e.response?.data ??
        e.message ??
        "",
      );

      /*
       * ==================================================
       * FORNECEDOR NÃO CADASTRADO
       * ==================================================
       */

      if (
        mensagem
          .toLowerCase()
          .includes("fornecedor não cadastrado")
      ) {

        console.log(
          "Fornecedor não cadastrado:",
          mensagem,
        );

        /*
         * Abre o ModalFornecedor
         * em modo NOVO.
         */
        setModalOpen(true);
      }

      /*
       * Só mostra erro se não for
       * tratado pelo fluxo do fornecedor.
       */

      if (
        !mensagem
          .toLowerCase()
          .includes("fornecedor não cadastrado")
      ) {
        toast.error(
          mensagem ||
          "Erro ao importar NF-e.",
        );
      }

    } finally {
      setCarregandoXml(false);
    }
  }

  /* =====================================================
     FECHAR MODAL FORNECEDOR
  ===================================================== */

  function fecharModalFornecedor() {
    setModalOpen(false);
  }

  /* =====================================================
     FORNECEDOR SALVO
  ===================================================== */

  async function fornecedorSalvo() {

    /*
     * Atualiza a lista de fornecedores
     * depois que o modal salvar.
     */
    await getFornecedores();

    /*
     * Fecha o modal.
     */
    setModalOpen(false);
  }

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div className="form-modal">

      {/* ================================================
          XML
      ================================================= */}

      <div className="form-group">

        <div>

          <label htmlFor="xml">
            Arquivo XML da NF-e
          </label>

          <input
            id="xml"
            type="file"
            accept=".xml,text/xml"
            onChange={selecionarXml}
            disabled={carregandoXml}
          />

        </div>

        {/* ==============================================
            PREVIEW
        =============================================== */}

        {arquivoXml && (

          <div className="xml-preview">

            <Upload size={20} />

            <div>

              <strong>
                Arquivo selecionado
              </strong>

              <span>
                {arquivoXml.name}
              </span>

            </div>

          </div>

        )}

      </div>

      {/* ================================================
          AÇÕES
      ================================================= */}

      <div className="modal-actions">

        <button
          type="button"
          className="btn-cancel"
          onClick={setClose}
          disabled={carregandoXml}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={importarXml}
          disabled={
            !arquivoXml ||
            carregandoXml
          }
        >
          {carregandoXml
            ? "Enviando..."
            : "Importar XML"}
        </button>

      </div>

      {/* ================================================
          MODAL FORNECEDOR
      ================================================= */}

      <ModalFornecedor
        open={modalOpen}

        /*
         * null = novo fornecedor
         */
        fornecedor={null}

        onClose={
          fecharModalFornecedor
        }

        onSuccess={
          fornecedorSalvo
        }
      />

    </div>
  );
}

