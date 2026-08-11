import "./App.css";
import AppRouter from "./Router/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </>
  );
}

export default App;
