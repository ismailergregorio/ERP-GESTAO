import { toast } from "react-toastify";
import api from "../../Services/Api";

const base = "entradas";

const baseFornecedores = "fornecedores";
const baseTiposEntrada = "tipos-entrada";

export async function getFornecedores() {
  try {
    const resposta = await api.get(`/${baseFornecedores}`);

    return resposta.data;
  } catch (e: any) {
    console.error(e);

    toast.error(e.response?.data?.message ?? "Erro ao buscar fornecedores.");
  }
}

export async function getTiposEntrada() {
  try {
    const resposta = await api.get(`/${baseTiposEntrada}`);

    return resposta.data;
  } catch (e: any) {
    console.error(e);

    toast.error(
      e.response?.data?.message ?? "Erro ao buscar tipos de entrada.",
    );
  }
}

export async function getProduto(id: number) {
  try {
    const resposta = await api.get(`/produtos/${id}`);

    return resposta.data;
  } catch (e: any) {
    console.error(e);

    toast.error(
      e.response?.data?.message ?? "Erro ao buscar tipos de entrada.",
    );
  }
}

export async function getProdutos() {
  try {
    const resposta = await api.get(`/produtos`);

    return resposta.data;
  } catch (e: any) {
    console.error(e);

    toast.error(
      e.response?.data?.message ?? "Erro ao buscar tipos de entrada.",
    );
  }
}

export async function getEntrada(id: number) {
  try {
    const resposta = await api.get(`/entradas/${id}`);

    return resposta.data;
  } catch (e: any) {
    console.error(e);

    toast.error(
      e.response?.data?.message ?? "Erro ao buscar tipos de entrada.",
    );
  }
}

export async function getFornecedor(id: number) {
  try {
    const resposta = await api.get(`/fornecedores/${id}`);

    return resposta.data;
  } catch (e: any) {
    console.error(e);

    toast.error(
      e.response?.data?.message ?? "Erro ao buscar tipos de entrada.",
    );
  }
}

export async function getFornecedorCnpj(cnpj: string) {
  try {
    const resposta = await api.get(`/fornecedores/cnpj/${cnpj}`);

    return resposta.data;
  } catch (e: any) {
    console.error(e);

    toast.error(
      e.response?.data?.message ?? "Erro ao buscar tipos de entrada.",
    );
  }
}
