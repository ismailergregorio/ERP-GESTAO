import api from './api'; import type {Setor,SetorRequest} from '../types/Setor';
export const listarSetores=async()=> (await api.get<Setor[]>('/setores')).data;
export const buscarSetorPorId=async(id:number)=> (await api.get<Setor>(`/setores/${id}`)).data;
export const criarSetor=async(d:SetorRequest)=> (await api.post<Setor>('/setores',d)).data;
export const atualizarSetor=async(id:number,d:SetorRequest)=> (await api.put<Setor>(`/setores/${id}`,d)).data;
export const excluirSetor=async(id:number)=>{await api.delete(`/setores/${id}`)};
