import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AppRoutes from "./router/AppRoutes";
import Login from "./pages/Login";
import AlterarSenha from "./pages/AlterarSenha";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/alterar-senha"
          element={sessionStorage.getItem("erp_token") ? <AlterarSenha /> : <Navigate to="/login" replace />}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<Layout><AppRoutes /></Layout>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
}

export default App;
