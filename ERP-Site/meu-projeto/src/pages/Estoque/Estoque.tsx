import { useEffect, useMemo, useState } from "react";
import { History, RefreshCw } from "lucide-react";
import Table from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import type { TableAction, TableColumn } from "../../components/Table/Table";
import { listarEstoque } from "../../services/estoqueService";
import { listarMovimentacoesProduto } from "../../services/movimentacaoService";
import type { EstoqueProduto } from "../../types/Estoque";
import type { Movimentacao } from "../../types/Movimentacao";
import { toast } from "react-toastify";
import "./Estoque.css";

export default function Estoque() {
  const [itens, setItens] = useState<EstoqueProduto[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<EstoqueProduto | null>(null);
  const [modalHistorico, setModalHistorico] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingHistorico, setLoadingHistorico] = useState(false);

  const carregar = async () => {
    try { setLoading(true); setItens(await listarEstoque()); }
    catch (e) { console.error(e); toast.error("Não foi possível carregar o estoque."); }
    finally { setLoading(false); }
  };

  useEffect(() => { carregar(); }, []);

  const abrirHistorico = async (produto: EstoqueProduto) => {
    try {
      setProdutoSelecionado(produto);
      setLoadingHistorico(true);
      setModalHistorico(true);
      setMovimentacoes(await listarMovimentacoesProduto(produto.produtoId));
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível carregar o histórico do produto.");
    } finally { setLoadingHistorico(false); }
  };

  const resumo = useMemo(() => ({
    produtos: itens.length,
    unidades: itens.reduce((s, i) => s + i.quantidadeEstoque, 0),
    baixo: itens.filter(i => i.statusEstoque === "BAIXO").length,
  }), [itens]);

  const columns: TableColumn<EstoqueProduto>[] = [
    { key: "produtoId", label: "Código", width: "80px", align: "center" },
    { key: "produto", label: "Produto" },
    { key: "categoria", label: "Categoria" },
    { key: "unidade", label: "Unidade", width: "90px", align: "center" },
    { key: "quantidadeEstoque", label: "Estoque", width: "100px", align: "right" },
    { key: "valorMedio", label: "Valor médio", align: "right", render: v => Number(v ?? 0).toLocaleString("pt-BR", { style:"currency", currency:"BRL" }) },
    { key: "validadeMaisProxima", label: "Validade mais próxima", render: v => v ? new Date(String(v)+"T00:00:00").toLocaleDateString("pt-BR") : "-" },
    { key: "statusEstoque", label: "Status", render: v => <span className={`estoque-status ${String(v).toLowerCase()}`}>{String(v)}</span> },
  ];

  const actions: TableAction<EstoqueProduto>[] = [{ label:"Histórico", variant:"secondary", onClick:abrirHistorico }];

  return <div className="estoque-page">
    <div className="page-header">
      <div><h2>Estoque Atual</h2><p>Acompanhe quantidade, valor médio e validade dos produtos do sistema.</p></div>
      <button type="button" className="btn-primary" onClick={carregar} disabled={loading}><RefreshCw size={17}/> Atualizar</button>
    </div>

    <div className="estoque-resumo">
      <div className="estoque-card"><span>Produtos em estoque</span><strong>{resumo.produtos}</strong></div>
      <div className="estoque-card"><span>Unidades disponíveis</span><strong>{resumo.unidades}</strong></div>
      <div className="estoque-card"><span>Produtos abaixo do mínimo</span><strong>{resumo.baixo}</strong></div>
    </div>

    <Table columns={columns} data={itens} actions={actions} loading={loading} rowKey="produtoId" emptyMessage="Nenhum produto cadastrado no estoque." totalItems={itens.length}/>

    <Modal isOpen={modalHistorico} onClose={() => setModalHistorico(false)} title={`Histórico — ${produtoSelecionado?.produto ?? "Produto"}`} width="900px" footer={<button className="btn-secondary" onClick={() => setModalHistorico(false)}>Fechar</button>}>
      <div className="estoque-historico">
        {loadingHistorico ? <p>Carregando movimentações...</p> : movimentacoes.length === 0 ? <p>Nenhuma movimentação encontrada.</p> : movimentacoes.map(m => <div className="estoque-historico-item" key={`${m.tipo}-${m.id}`}>
          <div className={m.tipo === "ENTRADA" ? "mov-entrada" : "mov-saida"}>{m.tipo}</div>
          <div><strong>{new Date(m.data).toLocaleString("pt-BR")}</strong><br/><small>{m.tipo === "SAIDA" ? `${m.responsavel ?? "-"} — ${m.setor ?? "-"}` : `NF: ${m.documento ?? "Sem NF"}`}</small></div>
          <div><strong>{m.tipo === "ENTRADA" ? "+" : "-"}{m.quantidade}</strong><br/><small>{m.finalidade ?? ""}</small></div>
          <div>{Number(m.valorTotal ?? 0).toLocaleString("pt-BR", {style:"currency",currency:"BRL"})}</div>
        </div>)}
      </div>
    </Modal>
  </div>;
}
