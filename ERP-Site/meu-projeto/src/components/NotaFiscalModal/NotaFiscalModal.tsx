import { useEffect, useState } from "react";

import Modal from "../Modal/Modal";

import type { NotaFiscal } from "../../types/NotaFiscal";
import type { Fornecedor } from "../../types/Fornecedor";
import type { ProdutoRegistroNF } from "../../types/ProdutoRegistroNF";

import { listarProdutosPorNF } from "../../services/produtosRegistroNFService";

import "./NotaFiscalModal.css";

interface NotaFiscalModalProps {
  isOpen: boolean;
  notaFiscal?: NotaFiscal | null;
  fornecedores: Fornecedor[];
  modo?: "criar" | "editar" | "visualizar";
  loading?: boolean;

  onClose: () => void;

  onSave: (dados: {
    numero: string;
    fornecedorId: number;
    chaveAcesso: string;
  }) => void;
}

export default function NotaFiscalModal({
  isOpen,
  notaFiscal,
  fornecedores,
  modo = "criar",
  loading = false,
  onClose,
  onSave,
}: NotaFiscalModalProps) {
  const [numero, setNumero] = useState("");
  const [fornecedorId, setFornecedorId] = useState<number>(0);
  const [chaveAcesso, setChaveAcesso] = useState("");

  const [produtos, setProdutos] = useState<ProdutoRegistroNF[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(false);

  const somenteVisualizacao = modo === "visualizar";

  /*
   * Preenche os dados quando abre
   * para criar/editar uma NF.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (notaFiscal) {
      setNumero(notaFiscal.numero);
      setFornecedorId(notaFiscal.fornecedorId);
      setChaveAcesso(notaFiscal.chaveAcesso);
    } else {
      setNumero("");
      setFornecedorId(0);
      setChaveAcesso("");
    }
  }, [isOpen, notaFiscal]);

  /*
   * Busca os produtos vinculados à NF
   * somente quando estiver no modo visualização.
   */
  useEffect(() => {
    if (!isOpen || modo !== "visualizar" || !notaFiscal?.id) {
      setProdutos([]);
      return;
    }

    const carregarProdutos = async () => {
      try {
        setLoadingProdutos(true);

        const dados = await listarProdutosPorNF(notaFiscal.id);

        setProdutos(dados);
      } catch (error) {
        console.error(
          "Erro ao carregar produtos da nota fiscal:",
          error
        );

        setProdutos([]);
      } finally {
        setLoadingProdutos(false);
      }
    };

    carregarProdutos();
  }, [isOpen, modo, notaFiscal?.id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (somenteVisualizacao) {
      return;
    }

    if (!numero.trim()) {
      return;
    }

    if (!fornecedorId) {
      return;
    }

    onSave({
      numero: numero.trim(),
      fornecedorId,
      chaveAcesso: chaveAcesso.trim(),
    });
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarQuantidade = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    });
  };

  const formatarData = (data: string | null) => {
    if (!data) {
      return "-";
    }

    return new Date(data).toLocaleString("pt-BR");
  };

  const fornecedorSelecionado = fornecedores.find(
    (fornecedor) => fornecedor.id === notaFiscal?.fornecedorId
  );

  const titulo =
    modo === "criar"
      ? "Cadastrar Nota Fiscal"
      : modo === "editar"
        ? "Editar Nota Fiscal"
        : "Visualizar Nota Fiscal";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={(aberto) => {
        if (!aberto) {
          onClose();
        }
      }}
      title={titulo}
      footer={
        somenteVisualizacao ? (
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Fechar
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              form="nota-fiscal-form"
              className="btn-primary"
              disabled={loading}
            >
              {loading
                ? "Salvando..."
                : modo === "editar"
                  ? "Atualizar"
                  : "Cadastrar"}
            </button>
          </>
        )
      }
    >
      {somenteVisualizacao ? (
        <div className="nota-fiscal-visualizacao">

          {/* ================================
              INFORMAÇÕES DA NOTA
          ================================= */}

          <section className="nota-fiscal-section">
            <h3>Informações da nota</h3>

            <div className="nota-fiscal-info-grid">
              <div className="nota-fiscal-info">
                <span>Número da NF</span>
                <strong>{notaFiscal?.numero || "-"}</strong>
              </div>

              <div className="nota-fiscal-info">
                <span>ID</span>
                <strong>{notaFiscal?.id || "-"}</strong>
              </div>

              <div className="nota-fiscal-info">
                <span>Data de criação</span>
                <strong>
                  {formatarData(notaFiscal?.dataCriacao || null)}
                </strong>
              </div>

              <div className="nota-fiscal-info">
                <span>Última atualização</span>
                <strong>
                  {formatarData(notaFiscal?.dataUpdate || null)}
                </strong>
              </div>
            </div>
          </section>

          {/* ================================
              FORNECEDOR
          ================================= */}

          <section className="nota-fiscal-section">
            <h3>Fornecedor</h3>

            <div className="nota-fiscal-info-grid">
              <div className="nota-fiscal-info">
                <span>Razão Social</span>
                <strong>
                  {notaFiscal?.razaoSocialFornecedor || "-"}
                </strong>
              </div>

              <div className="nota-fiscal-info">
                <span>Nome Fantasia</span>
                <strong>
                  {notaFiscal?.nomeFantasiaFornecedor || "-"}
                </strong>
              </div>

              <div className="nota-fiscal-info">
                <span>ID do fornecedor</span>
                <strong>
                  {notaFiscal?.fornecedorId || "-"}
                </strong>
              </div>
            </div>
          </section>

          {/* ================================
              CHAVE DE ACESSO
          ================================= */}

          <section className="nota-fiscal-section">
            <h3>Chave de acesso</h3>

            <div className="nota-fiscal-chave">
              {notaFiscal?.chaveAcesso || "-"}
            </div>
          </section>

          {/* ================================
              PRODUTOS DA NOTA
          ================================= */}

          <section className="nota-fiscal-section produtos-nf-section">
            <div className="produtos-nf-header">
              <div>
                <h3>Produtos da nota</h3>

                <p>
                  Produtos registrados durante a importação
                  da nota fiscal.
                </p>
              </div>

              <span className="produtos-nf-count">
                {produtos.length}{" "}
                {produtos.length === 1
                  ? "produto"
                  : "produtos"}
              </span>
            </div>

            {loadingProdutos ? (
              <div className="produtos-nf-loading">
                Carregando produtos...
              </div>
            ) : produtos.length === 0 ? (
              <div className="produtos-nf-empty">
                <strong>Nenhum produto encontrado</strong>

                <span>
                  Esta nota fiscal ainda não possui
                  produtos registrados.
                </span>
              </div>
            ) : (
              <div className="produtos-nf-table-wrapper">
                <table className="produtos-nf-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descrição</th>
                      <th>Unidade</th>
                      <th>Quantidade</th>
                      <th>Valor unitário</th>
                      <th>Valor total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {produtos.map((produto) => (
                      <tr key={produto.id}>
                        <td>{produto.codigo}</td>

                        <td className="produto-descricao">
                          {produto.descricao}
                        </td>

                        <td>{produto.unidade}</td>

                        <td className="valor-direita">
                          {formatarQuantidade(
                            produto.quantidade
                          )}
                        </td>

                        <td className="valor-direita">
                          {formatarMoeda(
                            produto.valorUnitario
                          )}
                        </td>

                        <td className="valor-direita valor-total">
                          {formatarMoeda(
                            produto.valorTotal
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr>
                      <td colSpan={5}>
                        Total dos produtos
                      </td>

                      <td className="valor-direita">
                        {formatarMoeda(
                          produtos.reduce(
                            (total, produto) =>
                              total + produto.valorTotal,
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </section>
        </div>
      ) : (
        <form
          id="nota-fiscal-form"
          className="nota-fiscal-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="numero">
              Número da NF
            </label>

            <input
              id="numero"
              type="text"
              value={numero}
              onChange={(event) =>
                setNumero(event.target.value)
              }
              placeholder="Digite o número da NF"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fornecedor">
              Fornecedor
            </label>

            <select
              id="fornecedor"
              value={fornecedorId}
              onChange={(event) =>
                setFornecedorId(Number(event.target.value))
              }
              required
              disabled={loading}
            >
              <option value={0}>
                Selecione o fornecedor
              </option>

              {fornecedores.map((fornecedor) => (
                <option
                  key={fornecedor.id}
                  value={fornecedor.id}
                >
                  {fornecedor.nomeFantasia ||
                    fornecedor.razaoSocial}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="chaveAcesso">
              Chave de acesso
            </label>

            <input
              id="chaveAcesso"
              type="text"
              value={chaveAcesso}
              onChange={(event) => {
                const valor = event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 44);

                setChaveAcesso(valor);
              }}
              placeholder="Digite a chave de acesso"
              maxLength={44}
              disabled={loading}
            />

            <small>
              {chaveAcesso.length}/44 caracteres
            </small>
          </div>
        </form>
      )}
    </Modal>
  );
}