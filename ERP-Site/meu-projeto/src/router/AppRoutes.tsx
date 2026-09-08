import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import CategoriaProdutos from "../pages/CategoriaProduto/CategoriaProdutos";

export default function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categorias" element={<CategoriaProdutos />} />
    </Routes>
  );
}
