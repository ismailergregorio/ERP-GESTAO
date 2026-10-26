import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { toast } from "react-toastify";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import type { TableAction, TableColumn } from "../../components/Table/Table";
import { listarProdutosAtivos } from "../../services/produtoService";
import { listarFuncionarios } from "../../services/funcionarioService";
import { listarSetores } from "../../services/setorService";
import { listarTiposSaidas } from "../../services/tipoSaidaService";
import { abrirPdfSaida, criarSaidaEpi, desativarSaida, listarSaidas } from "../../services/saidaService";
import type { Produto } from "../../types/Produto";
import type { Funcionario } from "../../types/Funcionario";
import type { Setor } from "../../types/Setor";
import type { TipoSaida } from "../../types/TipoSaida";
import type { Saida, SaidaEpiRequest } from "../../types/Saida";
import "./SaidasEpi.css";

type ItemFormulario = { produtoId: number | ""; quantidade: number | "" };
const itemVazio = (): ItemFormulario => ({ produtoId: "", quantidade: 1 });
const categoriaEpiOuUniforme = (categoria: string | null | undefined) =>
  ["epi", "uniforme"].includes((categoria ?? "").trim().toLocaleLowerCase("pt-BR"));

function formatarData(data?: string | null) {
  return data ? new Date(data).toLocaleString("pt-BR") : "-";
}

export default function SaidasEpi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const desenhandoRef = useRef(false);
  const [saidas, setSaidas] = useState<Saida[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [tiposSaidas, setTiposSaidas] = useState<TipoSaida[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [funcionarioId, setFuncionarioId] = useState<number | "">("");
  const [setorId, setSetorId] = useState<number | "">("");
  const [tipoSaidaId, setTipoSaidaId] = useState<number | "">("");
  const [finalidade, setFinalidade] = useState("Entrega de EPI/Uniforme");
  const [obs, setObs] = useState("");
  const [itens, setItens] = useState<ItemFormulario[]>([itemVazio()]);
  const [temAssinatura, setTemAssinatura] = useState(false);

  const produtosEpi = useMemo(
    () => produtos.filter((produto) => produto.ativo && categoriaEpiOuUniforme(produto.categoria)),
    [produtos],
  );

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [saidasData, produtosData, funcionariosData, setoresData, tiposData] = await Promise.all([
        listarSaidas(), listarProdutosAtivos(), listarFuncionarios(), listarSetores(), listarTiposSaidas(),
      ]);
      setSaidas(saidasData.filter((saida) => saida.saidaEpi === true));
      setProdutos(produtosData);
      setFuncionarios(funcionariosData.filter((f) => f.ativo));
      setSetores(setoresData.filter((s) => s.ativo));
      setTiposSaidas(tiposData.filter((t) => t.ativo));
    } catch (error) {
      console.error("Erro ao carregar saídas de EPI/Uniforme:", error);
      toast.error("Não foi possível carregar as saídas de EPI/Uniforme.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void carregarDados(); }, []);

  const limparAssinatura = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setTemAssinatura(false);
  };

  const limparFormulario = () => {
    setFuncionarioId(""); setSetorId(""); setTipoSaidaId("");
    setFinalidade("Entrega de EPI/Uniforme"); setObs(""); setItens([itemVazio()]);
    setTemAssinatura(false);
  };

  const iniciarAssinatura = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    desenhandoRef.current = true;
    canvas.setPointerCapture(event.pointerId);
    context.beginPath(); context.moveTo(x, y);
    context.lineWidth = 3; context.lineCap = "round"; context.lineJoin = "round"; context.strokeStyle = "#14213d";
    setTemAssinatura(true);
  };

  const desenharAssinatura = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!desenhandoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    context.lineTo(x, y); context.stroke();
  };

  const finalizarTraco = () => { desenhandoRef.current = false; };

  const alterarItem = (index: number, campo: keyof ItemFormulario, valor: number | "") => {
    setItens((atuais) => atuais.map((item, i) => i === index ? { ...item, [campo]: valor } : item));
  };

  const adicionarItem = () => setItens((atuais) => [...atuais, itemVazio()]);
  const removerItem = (index: number) => setItens((atuais) => atuais.length <= 1 ? atuais : atuais.filter((_, i) => i !== index));

  const totalEstimado = useMemo(() => itens.reduce((total, item) => {
    if (item.produtoId === "" || item.quantidade === "") return total;
    const produto = produtosEpi.find((p) => p.id === item.produtoId);
    return total + (produto?.valorUnitario ?? 0) * Number(item.quantidade);
  }, 0), [itens, produtosEpi]);

  const salvar = async () => {
    if (funcionarioId === "" || setorId === "" || tipoSaidaId === "" || !finalidade.trim()) {
      toast.error("Preencha funcionário, setor, tipo de saída e finalidade."); return;
    }
    if (!itens.length || itens.some((item) => item.produtoId === "" || item.quantidade === "" || Number(item.quantidade) <= 0)) {
      toast.error("Informe os produtos e quantidades corretamente."); return;
    }
    const ids = itens.map((item) => Number(item.produtoId));
    if (new Set(ids).size !== ids.length) { toast.error("Não repita o mesmo produto na retirada."); return; }
    if (!temAssinatura || !canvasRef.current) { toast.error("A assinatura do funcionário é obrigatória."); return; }
    const assinaturaBase64 = canvasRef.current.toDataURL("image/png");
    if (assinaturaBase64.length > 2_800_000) { toast.error("A assinatura ficou muito grande. Limpe e assine novamente."); return; }

    const itemComProblema = itens.find((item) => {
      const produto = produtosEpi.find((p) => p.id === item.produtoId);
      return !produto || Number(item.quantidade) > produto.estoque;
    });
    if (itemComProblema) { toast.error("Confira a categoria e o estoque disponível dos produtos selecionados."); return; }

    const dados: SaidaEpiRequest = {
      funcionarioId: Number(funcionarioId), setorId: Number(setorId), tipoSaidaId: Number(tipoSaidaId),
      finalidade: finalidade.trim(), obs: obs.trim() || undefined,
      produtos: itens.map((item) => ({ produtoId: Number(item.produtoId), quantidade: Number(item.quantidade) })),
      assinaturaBase64,
    };

    try {
      setLoading(true);
      await criarSaidaEpi(dados);
      toast.success("Saída de EPI/Uniforme registrada e assinada com sucesso.");
      setModalAberto(false); limparFormulario(); await carregarDados();
    } catch (error: any) {
      console.error("Erro ao registrar saída de EPI/Uniforme:", error);
      toast.error(error?.response?.data?.message || "Não foi possível registrar a saída. Verifique os dados e o estoque.");
    } finally { setLoading(false); }
  };

  const desativar = async (saida: Saida) => {
    if (!window.confirm(`Deseja desativar a saída #${saida.id}? Os itens serão devolvidos ao estoque conforme a regra da API.`)) return;
    try {
      setLoading(true); await desativarSaida(saida.id); toast.success("Saída desativada e estoque restaurado."); await carregarDados();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Não foi possível desativar a saída.");
    } finally { setLoading(false); }
  };

  const columns: TableColumn<Saida>[] = [
    { key: "id", label: "Código", width: "80px", align: "center" },
    { key: "funcionario", label: "Funcionário" },
    { key: "setor", label: "Setor" },
    { key: "tipoSaida", label: "Tipo de saída" },
    { key: "finalidade", label: "Finalidade" },
    { key: "produtos", label: "Itens", align: "center", render: (_, row) => row.produtos?.length ?? 0 },
    { key: "assinaturaColetada", label: "Assinatura", align: "center", render: (value) => value ? "Coletada" : "Não informada" },
    { key: "dataAssinatura", label: "Data da assinatura", render: (value) => formatarData(value ? String(value) : null) },
    { key: "dataCriacao", label: "Data", render: (value) => formatarData(value ? String(value) : null) },
  ];

  const actions: TableAction<Saida>[] = [
    { label: "PDF", variant: "secondary", onClick: async (saida) => {
      try { await abrirPdfSaida(saida.id); } catch (error) { console.error(error); toast.error("Não foi possível gerar/abrir o PDF desta saída."); }
    } },
    { label: "Desativar", variant: "danger", onClick: desativar },
  ];

  return (
    <div className="saida-epi-page">
      <div className="page-header">
        <div>
          <h2>Saída de EPIs e Uniformes</h2>
          <p>Registre a entrega individual de EPIs e uniformes com assinatura do funcionário.</p>
        </div>
        <button type="button" className="epi-btn-primary" onClick={() => { limparFormulario(); setModalAberto(true); }}>
          Nova retirada
        </button>
      </div>

      <div className="epi-info"><strong>Regra de seleção:</strong> somente produtos ativos das categorias EPI e Uniforme são exibidos. A API valida categoria, estoque e assinatura durante o registro.</div>
      <Table columns={columns} data={saidas} actions={actions} loading={loading} rowKey="id" emptyMessage="Nenhuma saída de EPI/Uniforme registrada." totalItems={saidas.length} />

      <Modal isOpen={modalAberto} onClose={() => { setModalAberto(false); limparFormulario(); }} title="Nova retirada de EPI/Uniforme" width="950px"
        footer={<><button type="button" className="epi-btn-secondary" onClick={() => { setModalAberto(false); limparFormulario(); }}>Cancelar</button><button type="button" className="epi-btn-primary" onClick={() => void salvar()} disabled={loading}>{loading ? "Registrando..." : "Registrar retirada e assinatura"}</button></>}>
        <div className="epi-form">
          <section className="epi-section">
            <h3>Dados da retirada</h3>
            <div className="epi-form-grid">
              <label>Funcionário destinatário *<select value={funcionarioId} onChange={(e) => setFuncionarioId(e.target.value ? Number(e.target.value) : "")}><option value="">Selecione o funcionário</option>{funcionarios.map((f) => <option key={f.id} value={f.id}>{f.nome}{f.cpf ? ` — ${f.cpf}` : ""}</option>)}</select></label>
              <label>Setor *<select value={setorId} onChange={(e) => setSetorId(e.target.value ? Number(e.target.value) : "")}><option value="">Selecione o setor</option>{setores.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}</select></label>
              <label>Tipo de saída *<select value={tipoSaidaId} onChange={(e) => setTipoSaidaId(e.target.value ? Number(e.target.value) : "")}><option value="">Selecione o tipo</option>{tiposSaidas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}</select></label>
              <label>Finalidade *<input value={finalidade} onChange={(e) => setFinalidade(e.target.value)} placeholder="Ex.: entrega de EPI para atividade operacional" /></label>
            </div>
            <label className="epi-full-label">Observações<textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={2} placeholder="CA conferido, condição do item, etc." /></label>
          </section>

          <section className="epi-section">
            <div className="epi-section-heading"><h3>Itens para entrega</h3><button type="button" className="epi-btn-secondary" onClick={adicionarItem}>Adicionar produto</button></div>
            {produtosEpi.length === 0 && <p className="epi-warning">Nenhum produto ativo está associado às categorias EPI ou Uniforme. Confira o cadastro das categorias e dos produtos.</p>}
            {itens.map((item, index) => {
              const produto = produtosEpi.find((p) => p.id === item.produtoId);
              return <div className="epi-item-row" key={index}>
                <label className="epi-product-field">Produto *<select value={item.produtoId} onChange={(e) => alterarItem(index, "produtoId", e.target.value ? Number(e.target.value) : "")}><option value="">Selecione EPI/Uniforme</option>{produtosEpi.map((p) => <option key={p.id} value={p.id}>{p.nome} ({p.categoria}) — estoque: {p.estoque} {p.siglaUnidadeMedida}</option>)}</select>{produto && <small>Categoria: {produto.categoria} · Disponível: {produto.estoque} {produto.siglaUnidadeMedida}</small>}</label>
                <label>Quantidade *<input type="number" min={1} max={produto?.estoque ?? undefined} value={item.quantidade} onChange={(e) => alterarItem(index, "quantidade", e.target.value ? Number(e.target.value) : "")} /></label>
                <div className="epi-item-value"><span>Valor estimado</span><strong>{produto ? (produto.valorUnitario * Number(item.quantidade || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}</strong></div>
                <button type="button" className="epi-btn-remove" onClick={() => removerItem(index)} disabled={itens.length === 1}>Remover</button>
              </div>;
            })}
            <div className="epi-total"><span>Total estimado</span><strong>{totalEstimado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div>
          </section>

          <section className="epi-section">
            <div className="epi-section-heading"><h3>Assinatura do funcionário *</h3><button type="button" className="epi-btn-secondary" onClick={limparAssinatura}>Limpar assinatura</button></div>
            <p className="epi-signature-help">Solicite ao funcionário que assine no quadro abaixo. A assinatura será enviada como imagem PNG e ficará vinculada ao registro.</p>
            <canvas ref={canvasRef} className="epi-signature-canvas" width={1000} height={260} aria-label="Área para assinatura do funcionário" onPointerDown={iniciarAssinatura} onPointerMove={desenharAssinatura} onPointerUp={finalizarTraco} onPointerCancel={finalizarTraco} onPointerLeave={finalizarTraco} />
            <div className={temAssinatura ? "epi-signature-status is-signed" : "epi-signature-status"}>{temAssinatura ? "Assinatura capturada" : "A assinatura é obrigatória para registrar a retirada"}</div>
          </section>
        </div>
      </Modal>
    </div>
  );
}
