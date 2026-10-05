import { useEffect, useMemo, useState } from "react";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import type { TableAction, TableColumn } from "../../components/Table/Table";
import { listarProdutosAtivos } from "../../services/produtoService";
import { listarFuncionarios } from "../../services/funcionarioService";
import { listarSetores } from "../../services/setorService";
import { listarTiposSaidas } from "../../services/tipoSaidaService";
import type { Funcionario } from "../../types/Funcionario";
import type { Setor } from "../../types/Setor";
import type { TipoSaida } from "../../types/TipoSaida";
import {
  atualizarSaida,
  buscarSaidaPorId,
  criarSaida,
  desativarSaida,
  listarSaidas,
} from "../../services/saidaService";
import type { Produto } from "../../types/Produto";
import type { Saida, SaidaRequest } from "../../types/Saida";
import { toast } from "react-toastify";
import "./Saidas.css";

type ItemFormulario = {
  produtoId: number | "";
  quantidade: number | "";
};

const itemVazio = (): ItemFormulario => ({
  produtoId: "",
  quantidade: "",
});

export default function Saidas() {
  const [saidas, setSaidas] = useState<Saida[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [tiposSaidas, setTiposSaidas] = useState<TipoSaida[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState(false);
  const [saidaSelecionada, setSaidaSelecionada] = useState<Saida | null>(null);

  const [funcionarioId, setFuncionarioId] = useState<number | "">("");
  const [setorId, setSetorId] = useState<number | "">("");
  const [tipoSaidaId, setTipoSaidaId] = useState<number | "">("");
  const [finalidade, setFinalidade] = useState("");
  const [obs, setObs] = useState("");
  const [itens, setItens] = useState<ItemFormulario[]>([itemVazio()]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [saidasData, produtosData, funcionariosData, setoresData, tiposData] = await Promise.all([
        listarSaidas(), listarProdutosAtivos(), listarFuncionarios(), listarSetores(), listarTiposSaidas(),
      ]);
      setSaidas(saidasData);
      setProdutos(produtosData);
      setFuncionarios(funcionariosData);
      setSetores(setoresData);
      setTiposSaidas(tiposData);
    } catch (error) {
      console.error("Erro ao carregar saídas:", error);
      toast.error("Não foi possível carregar as saídas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const limparFormulario = () => {
    setFuncionarioId("");
    setSetorId("");
    setTipoSaidaId("");
    setFinalidade("");
    setObs("");
    setItens([itemVazio()]);
    setSaidaSelecionada(null);
    setModoVisualizacao(false);
  };

  const abrirNovaSaida = () => {
    limparFormulario();
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    limparFormulario();
  };

  const abrirEdicao = (saida: Saida) => {
    setSaidaSelecionada(saida);
    setFuncionarioId(saida.funcionarioId);
    setSetorId(saida.setorId);
    setTipoSaidaId(saida.tipoSaidaId);
    setFinalidade(saida.finalidade);
    setObs(saida.obs ?? "");
    setItens(
      saida.produtos.map((item) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
      })),
    );
    setModoVisualizacao(false);
    setModalAberto(true);
  };

  const visualizarSaida = async (saida: Saida) => {
    try {
      setLoading(true);
      const dados = await buscarSaidaPorId(saida.id);
      setSaidaSelecionada(dados);
      setFuncionarioId(dados.funcionarioId);
      setSetorId(dados.setorId);
      setTipoSaidaId(dados.tipoSaidaId);
      setFinalidade(dados.finalidade);
      setObs(dados.obs ?? "");
      setItens(
        dados.produtos.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
        })),
      );
      setModoVisualizacao(true);
      setModalAberto(true);
    } catch (error) {
      console.error("Erro ao consultar saída:", error);
      toast.error("Não foi possível carregar a saída.");
    } finally {
      setLoading(false);
    }
  };

  const alterarItem = (
    index: number,
    campo: keyof ItemFormulario,
    valor: number | "",
  ) => {
    setItens((atual) =>
      atual.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [campo]: valor } : item,
      ),
    );
  };

  const adicionarItem = () => {
    setItens((atual) => [...atual, itemVazio()]);
  };

  const removerItem = (index: number) => {
    setItens((atual) => {
      if (atual.length === 1) {
        return atual;
      }
      return atual.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const totalSaida = useMemo(() => {
    return itens.reduce((total, item) => {
      if (item.produtoId === "" || item.quantidade === "") {
        return total;
      }
      const produto = produtos.find((p) => p.id === item.produtoId);
      return total + (produto?.valorUnitario ?? 0) * Number(item.quantidade);
    }, 0);
  }, [itens, produtos]);

  const salvar = async () => {
    if (funcionarioId === "" || setorId === "" || tipoSaidaId === "" || !finalidade.trim()) {
      toast.error("Preencha funcionário, setor, tipo de saída e finalidade.");
      return;
    }

    if (itens.length === 0 || itens.some((item) => item.produtoId === "" || item.quantidade === "" || Number(item.quantidade) <= 0)) {
      toast.error("Informe corretamente os produtos e as quantidades.");
      return;
    }

    const ids = itens.map((item) => Number(item.produtoId));
    if (new Set(ids).size !== ids.length) {
      toast.error("O mesmo produto não pode ser informado mais de uma vez.");
      return;
    }

    const dados: SaidaRequest = {
      funcionarioId: Number(funcionarioId),
      setorId: Number(setorId),
      tipoSaidaId: Number(tipoSaidaId),
      finalidade: finalidade.trim(),
      obs: obs.trim() || undefined,
      produtos: itens.map((item) => ({
        produtoId: Number(item.produtoId),
        quantidade: Number(item.quantidade),
      })),
    };

    try {
      setLoading(true);
      if (saidaSelecionada) {
        await atualizarSaida(saidaSelecionada.id, dados);
        toast.success("Saída atualizada com sucesso.");
      } else {
        await criarSaida(dados);
        toast.success("Saída registrada com sucesso.");
      }
      fecharModal();
      await carregarDados();
    } catch (error: any) {
      console.error("Erro ao salvar saída:", error);
      toast.error(
        error?.response?.data?.message || "Não foi possível registrar a saída.",
      );
    } finally {
      setLoading(false);
    }
  };

  const excluir = async (saida: Saida) => {
    const confirmar = window.confirm(
      `Deseja desativar a saída #${saida.id}? O estoque dos produtos será devolvido.`,
    );

    if (!confirmar) {
      return;
    }

    try {
      setLoading(true);
      await desativarSaida(saida.id);
      toast.success("Saída desativada e estoque restaurado.");
      await carregarDados();
    } catch (error: any) {
      console.error("Erro ao desativar saída:", error);
      toast.error(
        error?.response?.data?.message || "Não foi possível desativar a saída.",
      );
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn<Saida>[] = [
    { key: "id", label: "Código", width: "80px", align: "center" },
    { key: "funcionario", label: "Funcionário" },
    { key: "setor", label: "Setor" },
    { key: "tipoSaida", label: "Tipo de saída" },
    { key: "finalidade", label: "Finalidade" },
    {
      key: "produtos",
      label: "Itens",
      align: "center",
      render: (_, row) => row.produtos.length,
    },
    {
      key: "dataCriacao",
      label: "Data",
      render: (value) =>
        value ? new Date(String(value)).toLocaleString("pt-BR") : "-",
    },
  ];

  const actions: TableAction<Saida>[] = [
    {
      label: "Ver",
      variant: "secondary",
      onClick: visualizarSaida,
    },
    {
      label: "Editar",
      variant: "primary",
      onClick: abrirEdicao,
    },
    {
      label: "Desativar",
      variant: "danger",
      onClick: excluir,
    },
  ];

  return (
    <div className="saida-page">
      <div className="page-header">
        <div>
          <h2>Saídas de Produtos</h2>
          <p>Registre e acompanhe as retiradas de produtos do estoque.</p>
        </div>

        <button type="button" className="btn-primary" onClick={abrirNovaSaida}>
          Nova Saída
        </button>
      </div>

      <Table
        columns={columns}
        data={saidas}
        actions={actions}
        loading={loading}
        rowKey="id"
        emptyMessage="Nenhuma saída realizada."
        totalItems={saidas.length}
      />

      <Modal
        isOpen={modalAberto}
        onClose={fecharModal}
        title={modoVisualizacao ? `Saída #${saidaSelecionada?.id}` : saidaSelecionada ? "Editar Saída" : "Nova Saída"}
        width="900px"
        footer={
          !modoVisualizacao ? (
            <>
              <button type="button" className="btn-secondary" onClick={fecharModal}>
                Cancelar
              </button>
              <button type="button" className="btn-primary" onClick={salvar} disabled={loading}>
                {saidaSelecionada ? "Salvar alterações" : "Registrar saída"}
              </button>
            </>
          ) : (
            <button type="button" className="btn-secondary" onClick={fecharModal}>
              Fechar
            </button>
          )
        }
      >
        <div className="saida-form">
          <div className="form-section">
            <h3>Dados da retirada</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Funcionário que está retirando *</label>
                <select value={funcionarioId} onChange={(e) => setFuncionarioId(e.target.value ? Number(e.target.value) : "")} disabled={modoVisualizacao}>
                  <option value="">Selecione o funcionário</option>
                  {funcionarios.map((f) => <option key={f.id} value={f.id}>{f.nome}{f.cpf ? ` — ${f.cpf}` : ""}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Setor *</label>
                <select value={setorId} onChange={(e) => setSetorId(e.target.value ? Number(e.target.value) : "")} disabled={modoVisualizacao}>
                  <option value="">Selecione o setor</option>
                  {setores.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Tipo de saída *</label>
                <select value={tipoSaidaId} onChange={(e) => setTipoSaidaId(e.target.value ? Number(e.target.value) : "")} disabled={modoVisualizacao}>
                  <option value="">Selecione o tipo</option>
                  {tiposSaidas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Finalidade *</label>
                <input value={finalidade} onChange={(e) => setFinalidade(e.target.value)} disabled={modoVisualizacao} placeholder="Finalidade da retirada" />
              </div>            </div>

            <div className="form-group">
              <label>Observações</label>
              <textarea value={obs} onChange={(e) => setObs(e.target.value)} disabled={modoVisualizacao} placeholder="Observações da saída" rows={3} />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>Produtos</h3>
              {!modoVisualizacao && (
                <button type="button" className="btn-secondary" onClick={adicionarItem}>
                  Adicionar produto
                </button>
              )}
            </div>

            {itens.map((item, index) => {
              const produto = produtos.find((p) => p.id === item.produtoId);
              const disponivel = produto?.estoque ?? 0;

              return (
                <div className="produto-item" key={`${index}-${item.produtoId}`}>
                  <div className="form-group produto-select">
                    <label>Produto *</label>
                    <select
                      value={item.produtoId}
                      disabled={modoVisualizacao}
                      onChange={(e) => alterarItem(index, "produtoId", e.target.value ? Number(e.target.value) : "")}
                    >
                      <option value="">Selecione o produto</option>
                      {produtos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome} — estoque: {p.estoque} {p.siglaUnidadeMedida}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group quantidade-input">
                    <label>Quantidade *</label>
                    <input
                      type="number"
                      min="1"
                      max={disponivel || undefined}
                      value={item.quantidade}
                      disabled={modoVisualizacao}
                      onChange={(e) => alterarItem(index, "quantidade", e.target.value ? Number(e.target.value) : "")}
                    />
                    {produto && <small>Disponível: {disponivel} {produto.siglaUnidadeMedida}</small>}
                  </div>

                  <div className="form-group valor-input">
                    <label>Valor estimado</label>
                    <input value={produto ? `R$ ${(produto.valorUnitario * Number(item.quantidade || 0)).toFixed(2)}` : "-"} disabled />
                  </div>

                  {!modoVisualizacao && (
                    <button type="button" className="btn-remove" onClick={() => removerItem(index)} title="Remover produto">
                      Remover
                    </button>
                  )}
                </div>
              );
            })}

            <div className="saida-total">
              <strong>Total estimado:</strong>
              <span>R$ {totalSaida.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
