import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import CategoriaProdutos from "../pages/CategoriaProduto/CategoriaProdutos";
import UnidadeMedida from "../pages/UnidadeMedida/UnidadeMedida";
import Produtos from "../pages/Produtos/Produtos";
import Fornecedores from "../pages/Fornecedores/Fornecedores";
import NotasFiscais from "../pages/NotasFiscais/NotasFiscais";
import ProdutosRegistroNF from "../pages/ProdutosRegistroNF/ProdutosRegistroNF";
import TiposEntradas from "../pages/TiposEntradas/TiposEntradas";
import Entradas from "../pages/Entradas/Entradas";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/categorias" element={<CategoriaProdutos />} />
      <Route path="/unidades-medida" element={<UnidadeMedida />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/fornecedores" element={<Fornecedores />} />
      <Route path="/notas-fiscais" element={<NotasFiscais />} />
      <Route path="/produtos-notas-fiscais" element={<ProdutosRegistroNF />} />
      <Route path="/tipo-entrada" element={<TiposEntradas />} />
      <Route path="/entradas" element={<Entradas />} />
    </Routes>
  );
}
