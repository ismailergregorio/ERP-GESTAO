import { Routes, Route } from "react-router-dom";
import Home from "../Pages/PageHome";
import Estoque from "../Pages/PageEstoqueEntrada/PageEstoqueEntrada";
import Configuracao from "../Pages/PageConfiguracao/PageConfiguracao";
import PageProdutos from "../Pages/PageProdutos";
import Fornecedores from "../Pages/PageFornecedores";
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/estoque/entrada" element={<Estoque />} />
      <Route path="/configuracoes" element={<Configuracao />} />
      <Route path="/estoque/produtos" element={<PageProdutos />} />
      <Route path="/cadastros/fornecedores" element={<Fornecedores />} />
    </Routes>
  );
}
