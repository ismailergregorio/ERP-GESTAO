import Layout from "./components/Layout";
import AppRoutes from "./router/AppRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Layout>
      <AppRoutes />
      <ToastContainer />
    </Layout>
  );
}

export default App;
