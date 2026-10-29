import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const url = String(config.url || "");
  const isLogin = /\/auth\/login(?:\?|$)/.test(url);
  if (isLogin) {
    delete config.headers.Authorization;
    return config;
  }
  const token = sessionStorage.getItem("erp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Não apaga a sessão automaticamente em falhas de login/troca de senha:
    // isso permite corrigir a senha atual sem ser expulso da tela.
    const url = String(error.config?.url || "");
    const endpointDeAutenticacao = /\/auth\/(login|alterar-senha)(\?|$)/.test(url);
    if (error.response?.status === 401 && !endpointDeAutenticacao) {
      sessionStorage.removeItem("erp_token");
      sessionStorage.removeItem("erp_usuario");
    }
    return Promise.reject(error);
  },
);

export default api;
