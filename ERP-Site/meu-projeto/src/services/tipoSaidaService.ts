import api from './api'; import type {TipoSaida,TipoSaidaRequest} from '../types/TipoSaida';
export const listarTiposSaidas=async()=> (await api.get<TipoSaida[]>('/tipos-saidas')).data;
export const buscarTipoSaidaPorId=async(id:number)=> (await api.get<TipoSaida>(`/tipos-saidas/${id}`)).data;
export const criarTipoSaida=async(d:TipoSaidaRequest)=> (await api.post<TipoSaida>('/tipos-saidas',d)).data;
export const atualizarTipoSaida=async(id:number,d:TipoSaidaRequest)=> (await api.put<TipoSaida>(`/tipos-saidas/${id}`,d)).data;
export const excluirTipoSaida=async(id:number)=>{await api.delete(`/tipos-saidas/${id}`)};
