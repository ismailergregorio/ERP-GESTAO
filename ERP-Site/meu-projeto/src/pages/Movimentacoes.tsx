import { useEffect, useState } from "react";
import Table from "../components/Table/Table";
import type { TableColumn } from "../components/Table/Table";
import { listarMovimentacoes } from "../services/movimentacaoService";
import type { Movimentacao } from "../types/Movimentacao";
import { toast } from "react-toastify";

export default function Movimentacoes() {
  const [data, setData] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => { (async()=>{ try{setLoading(true);setData(await listarMovimentacoes());}catch(e){console.error(e);toast.error("Não foi possível carregar as movimentações.");}finally{setLoading(false);} })(); },[]);
  const columns: TableColumn<Movimentacao>[] = [
    {key:"data",label:"Data",render:v=>new Date(String(v)).toLocaleString("pt-BR")},
    {key:"tipo",label:"Movimento",render:v=><strong>{String(v)}</strong>},
    {key:"produto",label:"Produto"},
    {key:"quantidade",label:"Quantidade",align:"right"},
    {key:"valorTotal",label:"Valor",align:"right",render:v=>Number(v??0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})},
    {key:"responsavel",label:"Responsável",render:(v,row)=>row.tipo === "SAIDA" ? `${String(v??"-")} — ${row.setor??"-"}` : (row.documento ? `NF ${row.documento}` : "Sem NF")},
    {key:"finalidade",label:"Finalidade",render:v=>String(v??"-")},
  ];
  return <div><div className="page-header"><div><h2>Movimentações</h2><p>Histórico consolidado das entradas e saídas dos produtos do sistema.</p></div></div><Table columns={columns} data={data} loading={loading} rowKey="id" emptyMessage="Nenhuma movimentação encontrada." totalItems={data.length}/></div>;
}
