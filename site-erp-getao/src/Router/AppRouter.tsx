import { Routes, Route } from "react-router-dom";
import Home from "../Pages/PageHome";
import Estoque from "../Pages/PageEstoqueEntrada";
import Configuracao from "../Pages/PageConfiguracao/PageConfiguracao";
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/estoque/entrada" element={<Estoque />} />
      <Route path="/configuracoes" element={<Configuracao />} />
    </Routes>
  );
}
