import axios, { AxiosError } from "axios";

/**
 * Instância HTTP única do app.
 * Configure EXPO_PUBLIC_API_URL com a URL acessível pelo dispositivo móvel.
 * Ex.: http://192.168.0.20:8080/api
 */
const configuredBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const api = axios.create({
  baseURL: (configuredBaseUrl || "http://10.0.2.2:8080/api").replace(/\/+$/, ""),
  timeout: 20000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Não registra tokens, dados pessoais nem corpos de requisição no log.
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error),
);

/** Converte erros do Axios em mensagens úteis para exibição no app. */
export function mensagemErroApi(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; mensagem?: string; error?: string; detail?: string }
      | string
      | undefined;

    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object") {
      const message = data.message || data.mensagem || data.detail || data.error;
      if (message) return message;
    }

    if (error.response) {
      return `A API respondeu com HTTP ${error.response.status}. ${error.message}`;
    }
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return "A API demorou para responder. Verifique a conexão e tente novamente.";
    }
    if (error.request) {
      return "Não foi possível alcançar a API. Confira o IP, a porta, o Wi-Fi e se o servidor está em execução.";
    }
    return error.message || fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default api;
