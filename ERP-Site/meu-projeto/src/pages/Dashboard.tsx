import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  CircleAlert,
  FileText,
  History,
  Package,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { listarEstoque } from "../services/estoqueService";
import { listarMovimentacoes } from "../services/movimentacaoService";
import { listarNotasFiscais } from "../services/notaFiscalService";
import type { EstoqueProduto } from "../types/Estoque";
import type { Movimentacao } from "../types/Movimentacao";
import type { NotaFiscal } from "../types/NotaFiscal";

import "./Dashboard.css";

const moeda = (valor: number) =>
  Number(valor ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const dataHora = (valor: string) => {
  const data = new Date(valor);
  return Number.isNaN(data.getTime())
    ? "-"
    : data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [estoque, setEstoque] = useState<EstoqueProduto[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarDashboard = async () => {
    try {
      setLoading(true);

      const [estoqueData, movimentacoesData, notasData] = await Promise.all([
        listarEstoque(),
        listarMovimentacoes(),
        listarNotasFiscais(),
      ]);

      setEstoque(estoqueData);
      setMovimentacoes(movimentacoesData);
      setNotas(notasData);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      toast.error("Não foi possível carregar o resumo do ERP.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDashboard();
  }, []);

  const resumo = useMemo(() => {
    const agora = Date.now();
    const seteDias = 7 * 24 * 60 * 60 * 1000;

    const recentes = movimentacoes.filter((movimento) => {
      const data = new Date(movimento.data).getTime();
      return !Number.isNaN(data) && agora - data <= seteDias;
    });

    const entradas = movimentacoes.filter((m) => m.tipo === "ENTRADA");
    const saidas = movimentacoes.filter((m) => m.tipo === "SAIDA");

    const valorEstoque = estoque.reduce(
      (total, item) =>
        total +
        Number(item.quantidadeEstoque ?? 0) * Number(item.valorMedio ?? 0),
      0,
    );

    return {
      produtos: estoque.length,
      unidades: estoque.reduce(
        (total, item) => total + Number(item.quantidadeEstoque ?? 0),
        0,
      ),
      baixo: estoque.filter((item) => item.statusEstoque === "BAIXO"),
      valorEstoque,
      entradas,
      saidas,
      recentes,
      notasPendentes: notas.filter((nota) => !nota.nf_vinculada).length,
    };
  }, [estoque, movimentacoes, notas]);

  const ultimasMovimentacoes = useMemo(
    () =>
      [...movimentacoes]
        .sort(
          (a, b) =>
            new Date(b.data).getTime() - new Date(a.data).getTime(),
        )
        .slice(0, 6),
    [movimentacoes],
  );

  const produtosCriticos = useMemo(
    () =>
      [...estoque]
        .filter((item) => item.statusEstoque === "BAIXO")
        .sort((a, b) => a.quantidadeEstoque - b.quantidadeEstoque)
        .slice(0, 5),
    [estoque],
  );

  const atalhos = [
    {
      titulo: "Nova entrada",
      descricao: "Registrar recebimento de produtos",
      icon: ArrowDownToLine,
      className: "dashboard-shortcut-primary",
      onClick: () => navigate("/entradas"),
    },
    {
      titulo: "Nova saída",
      descricao: "Registrar retirada de produtos",
      icon: ArrowUpFromLine,
      className: "dashboard-shortcut-danger",
      onClick: () => navigate("/estoque/saidas"),
    },
    {
      titulo: "Consultar estoque",
      descricao: "Ver saldo e validade dos itens",
      icon: Boxes,
      className: "dashboard-shortcut-neutral",
      onClick: () => navigate("/estoque"),
    },
    {
      titulo: "Movimentações",
      descricao: "Consultar histórico do estoque",
      icon: History,
      className: "dashboard-shortcut-neutral",
      onClick: () => navigate("/estoque/movimentacoes"),
    },
  ];

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <span className="dashboard-eyebrow">VISÃO GERAL DO ERP</span>
          <h1>Olá, seja bem-vindo</h1>
          <p>
            Acompanhe o estoque, entradas, saídas e documentos pendentes em um
            único lugar.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-refresh"
          onClick={carregarDashboard}
          disabled={loading}
        >
          <RefreshCw size={17} className={loading ? "dashboard-spin" : ""} />
          Atualizar dados
        </button>
      </section>

      <section className="dashboard-kpis">
        <article className="dashboard-kpi dashboard-kpi-blue">
          <div className="dashboard-kpi-icon">
            <Package size={21} />
          </div>
          <div>
            <span>Produtos em estoque</span>
            <strong>{resumo.produtos}</strong>
            <small>{resumo.unidades} unidades disponíveis</small>
          </div>
        </article>

        <article className="dashboard-kpi dashboard-kpi-red">
          <div className="dashboard-kpi-icon">
            <CircleAlert size={21} />
          </div>
          <div>
            <span>Estoque abaixo do mínimo</span>
            <strong>{resumo.baixo.length}</strong>
            <small>Itens que precisam de atenção</small>
          </div>
        </article>

        <article className="dashboard-kpi dashboard-kpi-green">
          <div className="dashboard-kpi-icon">
            <TrendingUp size={21} />
          </div>
          <div>
            <span>Valor estimado do estoque</span>
            <strong>{moeda(resumo.valorEstoque)}</strong>
            <small>Quantidade × valor médio</small>
          </div>
        </article>

        <article className="dashboard-kpi dashboard-kpi-orange">
          <div className="dashboard-kpi-icon">
            <FileText size={21} />
          </div>
          <div>
            <span>NF aguardando entrada</span>
            <strong>{resumo.notasPendentes}</strong>
            <small>Documentos ainda não vinculados</small>
          </div>
        </article>
      </section>

      <section className="dashboard-shortcuts">
        <div className="dashboard-section-heading">
          <div>
            <h2>Ações rápidas</h2>
            <p>Acesse as operações mais utilizadas.</p>
          </div>
        </div>

        <div className="dashboard-shortcut-grid">
          {atalhos.map((atalho) => {
            const Icon = atalho.icon;
            return (
              <button
                type="button"
                className={`dashboard-shortcut ${atalho.className}`}
                key={atalho.titulo}
                onClick={atalho.onClick}
              >
                <span className="dashboard-shortcut-icon">
                  <Icon size={20} />
                </span>
                <span className="dashboard-shortcut-content">
                  <strong>{atalho.titulo}</strong>
                  <small>{atalho.descricao}</small>
                </span>
                <span className="dashboard-shortcut-arrow">→</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="dashboard-main-grid">
        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Movimentações recentes</h2>
              <p>{resumo.recentes.length} movimentações nos últimos 7 dias</p>
            </div>
            <button
              type="button"
              className="dashboard-link"
              onClick={() => navigate("/estoque/movimentacoes")}
            >
              Ver todas
            </button>
          </div>

          <div className="dashboard-movement-summary">
            <div>
              <span className="dashboard-dot dashboard-dot-green" />
              <span>Entradas</span>
              <strong>{resumo.entradas.length}</strong>
            </div>
            <div>
              <span className="dashboard-dot dashboard-dot-red" />
              <span>Saídas</span>
              <strong>{resumo.saidas.length}</strong>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-empty">Carregando movimentações...</div>
          ) : ultimasMovimentacoes.length === 0 ? (
            <div className="dashboard-empty">
              Nenhuma movimentação registrada.
            </div>
          ) : (
            <div className="dashboard-movement-list">
              {ultimasMovimentacoes.map((movimento) => {
                const entrada = movimento.tipo === "ENTRADA";

                return (
                  <div
                    className="dashboard-movement-item"
                    key={`${movimento.tipo}-${movimento.id}`}
                  >
                    <div
                      className={`dashboard-movement-icon ${
                        entrada ? "is-entry" : "is-exit"
                      }`}
                    >
                      {entrada ? (
                        <ArrowDownToLine size={17} />
                      ) : (
                        <ArrowUpFromLine size={17} />
                      )}
                    </div>

                    <div className="dashboard-movement-info">
                      <strong>{movimento.produto}</strong>
                      <span>
                        {entrada
                          ? movimento.documento
                            ? `NF ${movimento.documento}`
                            : "Entrada sem NF"
                          : `${movimento.responsavel ?? "Responsável não informado"}${
                              movimento.setor ? ` · ${movimento.setor}` : ""
                            }`}
                      </span>
                    </div>

                    <div className="dashboard-movement-qty">
                      <strong className={entrada ? "positive" : "negative"}>
                        {entrada ? "+" : "-"}
                        {movimento.quantidade}
                      </strong>
                      <span>{dataHora(movimento.data)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Atenção no estoque</h2>
              <p>Produtos que chegaram ao limite mínimo.</p>
            </div>
            <button
              type="button"
              className="dashboard-link"
              onClick={() => navigate("/estoque")}
            >
              Ver estoque
            </button>
          </div>

          {produtosCriticos.length === 0 ? (
            <div className="dashboard-stock-ok">
              <span>
                <TrendingUp size={21} />
              </span>
              <div>
                <strong>Estoque sob controle</strong>
                <p>Nenhum produto abaixo do mínimo.</p>
              </div>
            </div>
          ) : (
            <div className="dashboard-critical-list">
              {produtosCriticos.map((produto) => (
                <button
                  type="button"
                  className="dashboard-critical-item"
                  key={produto.produtoId}
                  onClick={() => navigate("/estoque")}
                >
                  <span className="dashboard-critical-icon">
                    <CircleAlert size={17} />
                  </span>
                  <span className="dashboard-critical-info">
                    <strong>{produto.produto}</strong>
                    <small>
                      Mínimo: {produto.estoqueMinimo} {produto.unidade}
                    </small>
                  </span>
                  <span className="dashboard-critical-value">
                    {produto.quantidadeEstoque}
                    <small>{produto.unidade}</small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="dashboard-footer-cards">
        <button
          type="button"
          className="dashboard-footer-card"
          onClick={() => navigate("/notas-fiscais")}
        >
          <span className="dashboard-footer-icon">
            <FileText size={20} />
          </span>
          <span>
            <strong>Notas fiscais</strong>
            <small>{notas.length} documentos cadastrados</small>
          </span>
          <span>→</span>
        </button>

        <button
          type="button"
          className="dashboard-footer-card"
          onClick={() => navigate("/estoque")}
        >
          <span className="dashboard-footer-icon">
            <Boxes size={20} />
          </span>
          <span>
            <strong>Valor médio dos produtos</strong>
            <small>Consulte custo médio e validade</small>
          </span>
          <span>→</span>
        </button>

        <button
          type="button"
          className="dashboard-footer-card"
          onClick={() => navigate("/estoque/movimentacoes")}
        >
          <span className="dashboard-footer-icon">
            <History size={20} />
          </span>
          <span>
            <strong>Histórico de movimentações</strong>
            <small>{movimentacoes.length} registros no sistema</small>
          </span>
          <span>→</span>
        </button>
      </section>
    </div>
  );
}
