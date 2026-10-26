import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import Table from "../Table/Table";
import type { TableColumn } from "../Table/Table";
import type { NotaFiscal } from "../../types/NotaFiscal";
import type { Produto } from "../../types/Produto";
import type { ProdutoRegistroNF } from "../../types/ProdutoRegistroNF";
import type { ProdutosRelacionado } from "../../types/ProdutosRelacionado";
import { listarProdutosPorNF } from "../../services/produtosRegistroNFService";
import { listarProdutosAtivos } from "../../services/produtoService";
import { listarTiposEntradas } from "../../services/tipoEntradaService";
import { finalizarEntrada } from "../../services/entradaService";
import "../../pages/Entradas/ModalRelacionamento.css";

interface Props {
  isOpen: boolean;
  notaFiscal: NotaFiscal | null;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
}

export default function RelacionarProdutosNFModal({
  isOpen,
  notaFiscal,
  onClose,
  onSuccess,
}: Props) {
  const [itens, setItens] = useState<ProdutosRelacionado[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!isOpen || !notaFiscal) return;

    let cancelado = false;
    async function carregar() {
      try {
        setCarregando(true);
        const [itensNF, produtosSistema] = await Promise.all([
          listarProdutosPorNF(notaFiscal!.id),
          listarProdutosAtivos(),
        ]);
        if (cancelado) return;
        const itensAtivos = itensNF.filter((item) => item.ativo);
        setProdutos(produtosSistema.filter((produto) => produto.ativo));
        setItens(itensAtivos.map((item: ProdutoRegistroNF) => ({
          id: item.id,
          codigo: item.codigo,
          descricao: item.descricao,
          quantidade: Number(item.quantidade),
          unidade: item.unidade,
          valorUnitario: Number(item.valorUnitario),
          valorTotal: Number(item.valorTotal),
          produtoSistemaId: null,
          tipoCalculo: "MULTIPLICAR",
          fatorCalculo: 1,
          quantidadeCalculada: Number(item.quantidade),
          possuiValidade: false,
          dataValidade: null,
        })));
        if (itensAtivos.length === 0) {
          window.alert("Esta nota fiscal não possui produtos registrados para vinculação. Notas criadas sem os itens precisam ter seus produtos cadastrados antes.");
        }
      } catch (error) {
        console.error("Erro ao carregar produtos para vinculação:", error);
        if (!cancelado) window.alert("Não foi possível carregar os produtos da nota fiscal.");
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }
    carregar();
    return () => { cancelado = true; };
  }, [isOpen, notaFiscal]);

  function atualizarItem(id: number, alteracoes: Partial<ProdutosRelacionado>) {
    setItens((atuais) => atuais.map((item) => {
      if (item.id !== id) return item;
      const atualizado = { ...item, ...alteracoes };
      const fator = Number(atualizado.fatorCalculo) || 1;
      atualizado.quantidadeCalculada = atualizado.tipoCalculo === "MULTIPLICAR"
        ? atualizado.quantidade * fator
        : atualizado.quantidade / fator;
      if (!atualizado.possuiValidade) atualizado.dataValidade = null;
      return atualizado;
    }));
  }

  async function confirmarVinculacao() {
    if (!notaFiscal) return;
    if (itens.length === 0) {
      window.alert("Esta nota fiscal não possui itens para vincular.");
      return;
    }
    if (itens.some((item) => item.produtoSistemaId === null)) {
      window.alert("Relacione todos os produtos da nota fiscal antes de finalizar.");
      return;
    }
    if (itens.some((item) => !Number.isFinite(item.quantidadeCalculada) || item.quantidadeCalculada <= 0)) {
      window.alert("Verifique os fatores de cálculo e as quantidades dos produtos.");
      return;
    }
    if (itens.some((item) => item.possuiValidade && !item.dataValidade)) {
      window.alert("Informe a data de validade de todos os produtos que possuem validade.");
      return;
    }
    const idsProdutos = itens.map((item) => item.produtoSistemaId);
    if (new Set(idsProdutos).size !== idsProdutos.length) {
      window.alert("A API não permite repetir o mesmo produto do sistema em mais de uma linha da entrada. Combine as linhas da nota ou selecione produtos diferentes.");
      return;
    }

    try {
      setSalvando(true);
      const tipos = await listarTiposEntradas();
      const normalizar = (valor: string) => valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
      const tipoNF = tipos.find((tipo) => {
        const nome = normalizar(tipo.nome);
        return nome.includes("entrada") && (nome.includes("nf") || nome.includes("nota fiscal"));
      });
      if (!tipoNF) throw new Error('Não existe um tipo de entrada cadastrado para nota fiscal. Cadastre um tipo como "Entrada com NF".');

      const resposta = await finalizarEntrada({
        tiposEntradaId: tipoNF.id,
        obs: `Entrada criada pela vinculação da nota fiscal ${notaFiscal.numero}.`,
        nfId: notaFiscal.id,
        numeroNF: null,
        produtos: itens.map((item) => ({
          produtoId: item.produtoSistemaId as number,
          produtoNFId: item.id,
          dataValidade: item.possuiValidade ? item.dataValidade : null,
          quantidadeItens: item.quantidadeCalculada,
          valorUnitario: item.valorUnitario,
          valorTotal: item.valorTotal,
        })),
      });
      window.alert(`Entrada #${resposta.id} criada. Os itens foram vinculados e o estoque foi atualizado.`);
      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao vincular nota fiscal:", error);
      const mensagem = error instanceof Error ? error.message : "Não foi possível vincular a nota fiscal e gerar a entrada.";
      window.alert(mensagem);
    } finally {
      setSalvando(false);
    }
  }

  const columns: TableColumn<ProdutosRelacionado>[] = [
    { key: "codigo", label: "Código", width: "100px" },
    { key: "descricao", label: "Descrição da NF", width: "220px" },
    { key: "quantidade", label: "Qtd. NF", width: "90px", align: "right", render: (v) => Number(v).toLocaleString("pt-BR") },
    { key: "unidade", label: "Unidade NF", width: "90px", align: "center" },
    {
      key: "produtoSistemaId", label: "Produto do sistema", width: "220px",
      render: (_, row) => (
        <select className="campo-tabela select-produto" value={row.produtoSistemaId ?? ""} onChange={(event) => atualizarItem(row.id, { produtoSistemaId: event.target.value ? Number(event.target.value) : null })}>
          <option value="">Selecionar produto</option>
          {produtos.map((produto) => <option key={produto.id} value={produto.id}>{produto.nome}</option>)}
        </select>
      ),
    },
    {
      key: "tipoCalculo", label: "Cálculo", width: "120px",
      render: (_, row) => (
        <select className="campo-tabela select-calculo" value={row.tipoCalculo} onChange={(event) => atualizarItem(row.id, { tipoCalculo: event.target.value as "MULTIPLICAR" | "DIVIDIR" })}>
          <option value="MULTIPLICAR">Multiplicar</option><option value="DIVIDIR">Dividir</option>
        </select>
      ),
    },
    {
      key: "fatorCalculo", label: "Fator", width: "85px", align: "right",
      render: (_, row) => <input className="campo-tabela input-fator" type="number" min="0.0001" step="any" value={row.fatorCalculo} onChange={(event) => atualizarItem(row.id, { fatorCalculo: Number(event.target.value) })} />,
    },
    {
      key: "quantidadeCalculada", label: "Qtd. entrada", width: "110px", align: "right",
      render: (_, row) => <span className="quantidade-calculada">{row.quantidadeCalculada.toLocaleString("pt-BR", { maximumFractionDigits: 4 })}</span>,
    },
    {
      key: "possuiValidade", label: "Validade", width: "100px",
      render: (_, row) => <select className="campo-tabela select-validade" value={row.possuiValidade ? "SIM" : "NAO"} onChange={(event) => atualizarItem(row.id, { possuiValidade: event.target.value === "SIM", dataValidade: null })}><option value="NAO">Não</option><option value="SIM">Sim</option></select>,
    },
    {
      key: "dataValidade", label: "Data de validade", width: "145px",
      render: (_, row) => <input className="campo-tabela input-validade" type="date" disabled={!row.possuiValidade} value={row.dataValidade ?? ""} onChange={(event) => setItens((atuais) => atuais.map((item) => item.id === row.id ? { ...item, dataValidade: event.target.value || null } : item))} />,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vincular produtos e gerar entrada"
      width="100%"
      closeOnOverlayClick={false}
      footer={<div className="relacionamento-footer"><button type="button" className="btn-relacionamento btn-cancelar" onClick={onClose} disabled={salvando}>Cancelar</button><button type="button" className="btn-relacionamento btn-finalizar" onClick={confirmarVinculacao} disabled={carregando || salvando || itens.length === 0}>{salvando ? "Gerando entrada..." : "Vincular e atualizar estoque"}</button></div>}
    >
      <div className="relacionamento-container">
        <div className="dados-nota">
          <div className="campo-nota"><label>Número da NF</label><span>{notaFiscal?.numero || "-"}</span></div>
          <div className="campo-nota"><label>Fornecedor</label><span>{notaFiscal?.nomeFantasiaFornecedor || notaFiscal?.razaoSocialFornecedor || "-"}</span></div>
          <div className="campo-nota"><label>Chave de acesso</label><span>{notaFiscal?.chaveAcesso || "-"}</span></div>
        </div>
        <div className="relacionamento-header"><h3>Produtos da nota fiscal</h3><p>Associe cada item da NF a um produto do sistema. Ao finalizar, será criada uma entrada vinculada à NF e o estoque será atualizado pela API.</p></div>
        <div className="relacionamento-tabela"><Table columns={columns} data={itens} rowKey="id" loading={carregando} /></div>
      </div>
    </Modal>
  );
}
