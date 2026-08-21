import Modal from "../../Componete/Modal/Modal";

interface Fornecedor {
  id: number;
  nome: string;
}

interface TipoEntrada {
  id: number;
  nome: string;
}

interface Entrada {
  id: number;
  notaFiscal: number;
  fornecedor_id: number;
  tipoEntrada_id: number;
  observacao: string;
  dataCriacao: string;
}

interface ModalNovaEntradaProps {
  open: boolean;
  etapa: 1 | 2;

  notafiscal: number | undefined;
  fornecedor_id: number | undefined;
  tipoEntrada_id: number | undefined;
  observacao: string;

  fornecedores: Fornecedor[];
  tiposEntrada: TipoEntrada[];

  entradaRegistrada: Entrada | null;

  onClose: () => void;
  onCriarEntrada: () => void;

  setNotaFiscal: (value: number | undefined) => void;
  setFornecedorId: (value: number | undefined) => void;
  setTipoEntradaId: (value: number | undefined) => void;
  setObservacao: (value: string) => void;

  children: React.ReactNode;
}

export default function ModalNovaEntrada({
  open,
  etapa,
  notafiscal,
  fornecedor_id,
  tipoEntrada_id,
  observacao,
  fornecedores,
  tiposEntrada,
  entradaRegistrada,
  onClose,
  onCriarEntrada,
  setNotaFiscal,
  setFornecedorId,
  setTipoEntradaId,
  setObservacao,
  children,
}: ModalNovaEntradaProps) {
  return (
    <Modal open={open} title="Nova Entrada" onClose={onClose} tamanho="max">
      {/* ETAPAS */}
      <div className="passo">
        <div className="p n1 ativo">
          <h2 className="nume ativo">1</h2>
          <h2>Criar Entrada</h2>
        </div>

        <hr className={etapa > 1 ? "ativo" : ""} />

        <div className={etapa === 2 ? "p n2 ativo" : "p n2"}>
          <h2 className={etapa === 2 ? "nume ativo" : "nume"}>2</h2>

          <h2>Adicionar Produtos</h2>
        </div>
      </div>

      {/* DADOS DA ENTRADA */}
      <div className="for">
        <h3>Definição da Entrada</h3>

        <div className="form-group entrada">
          <div>
            <label htmlFor="nf">N° Nf</label>

            <input
              id="nf"
              type="number"
              placeholder="Digite o numero da NF"
              value={notafiscal ?? ""}
              onChange={(e) => {
                setNotaFiscal(
                  e.target.value === "" ? undefined : Number(e.target.value),
                );
              }}
              disabled={!!entradaRegistrada}
            />
          </div>

          <div>
            <label htmlFor="fornecedor">Fornecedor</label>

            <select
              id="fornecedor"
              value={fornecedor_id ?? ""}
              onChange={(e) => {
                setFornecedorId(
                  e.target.value === "" ? undefined : Number(e.target.value),
                );
              }}
              disabled={!!entradaRegistrada}
            >
              <option value="">Selecione um Fornecedor</option>

              {fornecedores.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tipo-entrada">Tipo de Entrada</label>

            <select
              id="tipo-entrada"
              value={tipoEntrada_id ?? ""}
              onChange={(e) => {
                setTipoEntradaId(
                  e.target.value === "" ? undefined : Number(e.target.value),
                );
              }}
              disabled={!!entradaRegistrada}
            >
              <option value="">Selecione um Tipo de Entrada</option>

              {tiposEntrada.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="obs">Observações</label>

            <input
              id="obs"
              type="text"
              placeholder="Digite a Observação"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              disabled={!!entradaRegistrada}
            />
          </div>
        </div>
      </div>

      {/* CONTEÚDO DA ETAPA 2 */}
      {etapa === 2 && children}

      {/* BOTÕES */}
      <div className="modal-actions">
        <button type="button" className="btn-cancel" onClick={onClose}>
          Cancelar
        </button>

        {etapa === 1 && (
          <button
            type="button"
            className="btn-primary"
            onClick={onCriarEntrada}
          >
            Criar Entrada
          </button>
        )}
      </div>
    </Modal>
  );
}
