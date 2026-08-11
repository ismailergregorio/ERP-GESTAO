import "./PageConfiguracao-css.css";
import Layout from "../../Layout/LayoutPages";
import TabelaTipoSaida from "./TabelaTipoSaida";
import TabelaTipoEntrada from "./TabelaEntrada";
import TabelatipoCategoria from "./TabelaCategorias";
import TabelatipoCentroDecusto from "./TabelaCentroDeCusto";
import TabelaUnidadeMedida from "./TabelaUnidadeMedida";
export default function Configuracao() {
  return (
    <Layout title="Configuraçoes">
      <section className="configuration">
        <TabelaTipoSaida />
        <TabelaTipoEntrada />
        <TabelatipoCategoria />
        <TabelatipoCentroDecusto />
        <TabelaUnidadeMedida />
      </section>
    </Layout>
  );
}
