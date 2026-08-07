import "./PageConfiguracao-css.css";
import HeaderTabela from "../../Componete/HeaderTabela/HeaderTabela";
import Table from "../../Componete/Table/Table";
import Layout from "../../Layout/LayoutPages";
import type { Column } from "../../Componete/Table/Table.types";
import api from "../../Services/Api";
import { useEffect } from "react";

interface CategoriaSaida {
  id: number;
  nome: string;
  status: true;
}
export default function Configuracao() {
  const colun: Column<CategoriaSaida>[] = [
    {
      key: "id",
      title: "Id",
    },
    {
      key: "nome",
      title: "Nome",
    },
    {
      key: "status",
      title: "Status",
      render: (value: any) => (value ? "Ativo" : "Inativo"),
    },
  ];

  const data: CategoriaSaida[] = [
    { id: 1, nome: "Teste 1", status: true },
    { id: 2, nome: "Teste 2", status: true },
  ];

  async function getTipoSaida() {
    try {
      const resposta = await api.get("/tipos-saida");
      console.log(resposta.data);
    } catch (e: any) {
      console.error(e);
    }
  }
  useEffect(()=>{
    getTipoSaida();
  },[])

  return (
    <Layout title="Configuraçoes">
      <section className="configuration">
        <HeaderTabela title="Tipos De Saida">
          <Table columns={colun} data={data}></Table>
        </HeaderTabela>
      </section>
    </Layout>
  );
}
