import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import type { Nf } from "../Interfaces";
import api from "../../../Services/Api";
import ModalFornecedor from "../../PageFornecedor/ModalFornecedor";

export default function ImportXml() {
  const [arquivoXml, setArquivoXml] = useState<File | null>(null);
  const [carregandoXml, setCarregandoXml] = useState(false);

  function selecionarXml(event: React.ChangeEvent<HTMLInputElement>) {
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

  const [nfe, setNfe] = useState<Nf | null>();
  async function importarXml() {
    if (!arquivoXml) {
      toast.warning("Selecione um arquivo XML.");
      return;
    }

    try {
      setCarregandoXml(true);

      const formData = new FormData();

      formData.append("arquivo", arquivoXml);

      const resposta = await api.post("/nfe/importar", formData);

      console.log("Resposta da NF-e:", resposta.data);

      const produtos = resposta.data.produto.map(
        (produto: any, index: number) => ({
          ...produto,
          id: index + 1,
        }),
      );

      setNfe({
        ...resposta.data,
        produto: produtos,
      });

      toast.success("NF-e importada com sucesso.");

      setArquivoXml(null);

      // setContadorImport(2);
    } catch (e: any) {
      console.error("Erro ao importar XML:", e);

      const mensagem = String(
        e.response?.data?.message ?? e.response?.data ?? e.message ?? "",
      );

      if (mensagem.toLowerCase().includes("fornecedor não cadastrado")) {
        window.alert("Fornecedor não cadastrado");
        return ModalFornecedor;
      }

      toast.error(mensagem || "Erro ao importar NF-e.");
    } finally {
      setCarregandoXml(false);
    }
  }

  return (
    <div className="form-modal">
      <div className="form-group">
        <div>
          <label htmlFor="xml">Arquivo XML da NF-e</label>

          <input
            id="xml"
            type="file"
            accept=".xml,text/xml"
            onChange={selecionarXml}
            disabled={carregandoXml}
          />
        </div>

        {arquivoXml && (
          <div className="xml-preview">
            <Upload size={20} />

            <div>
              <strong>Arquivo selecionado</strong>

              <span>{arquivoXml.name}</span>
            </div>
          </div>
        )}
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="btn-cancel"
          // onClick={fecharModalNf}
          disabled={carregandoXml}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={importarXml}
          disabled={!arquivoXml || carregandoXml}
        >
          {carregandoXml ? "Enviando..." : "Importar XML"}
        </button>
      </div>
    </div>
  );
}
