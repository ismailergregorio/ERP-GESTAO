import { useEffect, useState } from "react";
import Modal from "../../../Componete/Modal/Modal";
import ImportXml from "./ModalImportXML";
import type { Nf, ProdutoNfe } from "../Interfaces";
import Table from "../../../Componete/Table/Table";
import DetalhesNf from "./ModelDetalhesNF";
import ModelConeccaoProduto from "./ModelConeccaoProduto";

interface ConfigModalprops {
  stadoModal?: boolean;
  onClose: () => void;
}
export default function ModalEntradaNfXML({
  stadoModal = false,
  onClose,
}: ConfigModalprops) {
  const [contadorImport, setContadorImport] = useState<number>(1);
  const [nfe, setNfe] = useState<Nf | undefined>();

  function openModal() {}

  function fecharModal() {
    onClose();
  }
  return (
    <Modal
      open={stadoModal}
      title="Importar Nota Fiscal"
      onClose={fecharModal}
      tamanho="max"
    >
      {contadorImport == 1 && (
        <ImportXml
          setDadosNf={setNfe}
          setContadorNf={setContadorImport}
          setClose={fecharModal}
        />
      )}

      {contadorImport === 2 && nfe && (
        <DetalhesNf nfe={nfe} setContadorNf={setContadorImport} />
      )}
      {contadorImport === 3 && nfe && 
        <ModelConeccaoProduto dadosNF={nfe}/>}
    </Modal>
  );
}
