import api from './api'; import type {Funcionario,FuncionarioRequest} from '../types/Funcionario';
export const listarFuncionarios=async()=> (await api.get<Funcionario[]>('/funcionarios')).data;
export const buscarFuncionarioPorId=async(id:number)=> (await api.get<Funcionario>(`/funcionarios/${id}`)).data;
export const criarFuncionario=async(d:FuncionarioRequest)=> (await api.post<Funcionario>('/funcionarios',d)).data;
export const atualizarFuncionario=async(id:number,d:FuncionarioRequest)=> (await api.put<Funcionario>(`/funcionarios/${id}`,d)).data;
export const excluirFuncionario=async(id:number)=>{await api.delete(`/funcionarios/${id}`)};
